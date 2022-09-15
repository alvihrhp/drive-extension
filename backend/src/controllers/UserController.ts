import { Request, Response, NextFunction } from "express";
/** Google Auth Library */
import { google } from "googleapis";
/** Prisma Client */
import { PrismaClient } from "@prisma/client";
/** Axios */
import axios from "axios";
/** Helper */
import { BaseURl } from "../helper";
/** Logger */
import logger from "../logger";

const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

class UserController {
  static async getAuthLink(req: Request, res: Response, next: NextFunction) {
    try {
      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          `${BaseURl.googleAuth()}/userinfo.email`,
          `${BaseURl.googleAuth()}/userinfo.profile`,
          `${BaseURl.googleAuth()}/drive`,
        ],
        prompt: "consent",
      });

      logger.log({
        level: "info",
        message: "Generarte Google Oauth2 URL to login to google",
        are: url,
      });

      res.status(200).json({
        message: "Successfully fetched google link",
        data: url,
      });
    } catch (error) {
      logger.log({
        level: "error",
        message: "Error in getAuthLink method",
        are: error,
      });
      console.log(error);
    }
  }
  static async OAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const code: any = req.query.code;
      oauth2Client.getToken(code, (err: any, tokens: any) => {
        if (err) {
          throw err.message;
        }

        logger.log({
          level: "info",
          message: "Get google Oauth2 refresh_token and and access_token",
          are: tokens,
        });

        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;

        res.redirect(
          `${process.env.CLIENT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
        );
      });
    } catch (error) {
      logger.log({
        level: "error",
        message: "Error in method OAuthCallback",
        are: error,
      });
      console.log(error);
    }
  }
  static async getValidToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken }: any = req.body;

      const data = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      };

      const response = await axios({
        url: `${BaseURl.googleOAuth()}/v4/token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });

      const { access_token } = response.data;

      logger.log({
        level: "info",
        message: "Get new access_token if the current access_token is expired",
        are: response.data,
      });

      res.status(200).json({
        message: "Got a new token",
        data: access_token,
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        message: "Error in getValidToken method",
        are: error,
      });
      console.log(error.data.error);
    }
  }

  static async slackAuth(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { code } = req.query;

      const workspace = await axios({
        url: `${BaseURl.slack()}/oauth.v2.access?client_id=${
          process.env.SLACK_APP_CLIENT_ID
        }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}`,
        method: "POST",
      });

      const { data: dataWorkspace } = workspace;

      logger.log({
        level: "info",
        message: "Installing Slack Drive to the choosen workspace",
        leve: dataWorkspace,
      });

      const workspaceDetail = await axios({
        url: `${BaseURl.slack()}/team.info?team=${
          dataWorkspace.team.id
        }&pretty=1`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${dataWorkspace.authed_user.access_token}`,
        },
      });

      const { data: dataWorkspaceDetail } = workspaceDetail;

      logger.log({
        level: "info",
        message:
          "Getting detail information from workspace that just got installed",
        leve: dataWorkspaceDetail,
      });

      const authedUser = await axios({
        url: `${BaseURl.slack()}/users.info?user=${
          dataWorkspace.authed_user.id
        }&pretty=1`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${dataWorkspace.authed_user.access_token}`,
        },
      });

      const { data: dataAuthedUser } = authedUser;

      logger.log({
        level: "info",
        message:
          "Getting the owner email of the workspace that just installed Slack Drive ",
        leve: dataAuthedUser,
      });

      let newUser: any;

      let findUser: any = await prisma.user.findUnique({
        where: {
          email: dataAuthedUser.user.profile.email,
        },
      });

      logger.log({
        level: "info",
        message:
          "Get user froom DB where email is from dataAuthedUser.user.profile.email",
        are: findUser,
      });

      if (findUser?.email !== dataAuthedUser.user.profile.email) {
        newUser = await prisma.user.create({
          data: {
            email: dataAuthedUser.user.profile.email,
            slack_user_id: dataAuthedUser.user.id,
          },
        });
        logger.log({
          level: "info",
          message: "Insert new user to the database",
          leve: dataAuthedUser,
        });
      }

      let newTeam: any;

      let findTeam = await prisma.team.findUnique({
        where: {
          team_id: dataWorkspace.team.id,
        },
      });

      logger.log({
        level: "info",
        message:
          "Find workspace on the DB to know if the team already exist in the or not",
        are: findTeam,
      });

      if (!findTeam) {
        newTeam = await prisma.team.create({
          data: {
            name: dataWorkspaceDetail.team.name,
            url: dataWorkspaceDetail.team.url,
            domain: dataWorkspaceDetail.team.domain,
            is_verified: dataWorkspaceDetail.team.is_verified,
            team_id: dataWorkspaceDetail.team.id,
            access_token: dataWorkspace.authed_user.access_token,
            userId: newUser ? newUser.id : findUser.id,
          },
        });

        logger.log({
          level: "info",
          message: "If the workspace is not already in the DB create a new one",
          are: newTeam,
        });

        const channels = await axios({
          url: `${BaseURl.slack()}/conversations.list?pretty=1&types=public_channel,private_channel`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${dataWorkspace.authed_user.access_token}`,
          },
        });

        const { channels: dataChannels } = channels.data;

        logger.log({
          level: "info",
          message:
            "Get all the channels from the workspace that just installed Slack Drive",
          are: dataChannels,
        });

        const newChannels = dataChannels.map(
          (channel: { [key: string]: any }) => {
            return {
              channel_id: channel.id,
              name: channel.name,
              teamId: newTeam.id,
            };
          }
        );

        const insertChannels = await prisma.channel.createMany({
          data: newChannels,
        });

        logger.log({
          level: "info",
          message:
            "Insert all the channels from the workspace that just installed Slack Drive",
          are: insertChannels,
        });
      }

      await prisma.$disconnect();

      res.status(201).json({
        message: "Slack Drive successfully installed on your workspace",
      });
    } catch (error) {
      await prisma.$disconnect();
      logger.log({
        level: "error",
        message: "Error in getValidToken method",
        are: error,
      });
      console.log(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { token, refreshToken } = req.body;

      const responseGoogleUser = await axios.get(
        `${BaseURl.googleOAuth()}/v1/userinfo?alt=json&access_token=${token}`
      );

      const { data: dataGoogleUser } = responseGoogleUser;

      logger.log({
        level: "info",
        message: "Verify the user when loggin in into google",
        are: dataGoogleUser,
      });

      const userId = dataGoogleUser.id;

      const user = await prisma.user.findUnique({
        where: {
          google_user_id: userId,
        },
      });

      logger.log({
        level: "info",
        message: "Find a user base on google_user_id",
        are: user,
      });

      let updatedUser: any;

      if (!user) {
        updatedUser = await prisma.user.update({
          where: {
            email: dataGoogleUser.email,
          },
          data: {
            access_token: token,
            refresh_token: token,
            google_user_id: userId,
          },
        });
        logger.log({
          level: "info",
          message:
            "If the google hasn't have a google_user_id then update the user with the new access_token, refresh_token and google_user_id",
          are: updatedUser,
        });
      }

      updatedUser = await prisma.user.update({
        where: {
          google_user_id: userId,
        },
        data: {
          refresh_token: refreshToken,
        },
      });

      logger.log({
        level: "info",
        message:
          "If a user already have google_user_id then update the refresh_token only",
        are: updatedUser,
      });

      await prisma.$disconnect();

      res.status(200).json({
        message: "User successfully fetched",
        data: updatedUser,
      });
    } catch (error) {
      await prisma.$disconnect();
      logger.log({
        level: "error",
        message: "Error in method verify",
        are: error,
      });
      console.log(error);
    }
  }
}

export default UserController;
