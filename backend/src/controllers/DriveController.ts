import { Request, Response, NextFunction } from "express";
/** Axios */
import axios from "axios";
/** Prisma */
import { PrismaClient } from "@prisma/client";
/** Helper */
import { BaseURl } from "../helper";
/** Logger */
import logger from "../logger";

const prisma = new PrismaClient();

class DriveController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { token }: any = req.query;

      const response = await axios.get(
        `${BaseURl.googleDrive()}?ordeBy=folder&fields=files(id, name, webViewLink, owners, mimeType)&q=mimeType = 'application/vnd.google-apps.folder' and 'root' in parents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { files } = response.data;

      logger.log({
        level: "info",
        message: "Get list of root Drive folders from Drive API",
        are: files,
      });

      const folders = await prisma.channel.findMany();

      logger.log({
        level: "info",
        message: "Find all channels from the database",
        are: folders,
      });

      const filterFolders = [];

      for (let i = 0; i < files.length; i++) {
        let flag = false;
        for (let j = 0; j < folders.length; j++) {
          if (files[i].id === folders[j].folder_id) {
            flag = true;
          }
        }
        if (!flag) {
          filterFolders.push(files[i]);
        }
      }

      logger.log({
        level: "info",
        message: "Filter root folders that already connected to a channel",
        are: filterFolders,
      });

      await prisma.$disconnect();

      res.status(200).json({
        message: "Fetch files success",
        data: filterFolders,
      });
    } catch (error: any) {
      await prisma.$disconnect();
      logger.log({
        level: "error",
        message: "Error on method get inside Drive Controller",
        are: error,
      });
      console.log(error);
    }
  }
  static async getSub(req: Request, res: Response, next: NextFunction) {
    try {
      const { folder_id, token }: any = req.query;

      const response = await axios.get(
        `${BaseURl.googleDrive()}?ordeBy=folder&fields=files(id, name, webViewLink, owners, mimeType)&q=mimeType = 'application/vnd.google-apps.folder' and '${folder_id}' in parents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { files } = response.data;

      logger.log({
        level: "info",
        message: "Get list of sub folder from a parent folder",
        are: files,
      });

      res.status(200).json({
        message: "Fetch files success",
        data: files,
      });
    } catch (error) {
      logger.log({
        level: "error",
        message: "Error on method getSub inside Drive Controller",
        are: error,
      });
      console.log(error);
    }
  }
  static async connect(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { by } = req.query;

      let {
        id: folderId,
        webViewLink: driveLink,
        name: driveName,
        channelName,
        channelId,
        ownerEmail,
        token,
        permission,
        description,
        bookmark,
        access_token,
      } = req.body;

      const channels: any = await prisma.channel.findMany();

      logger.log({
        level: "info",
        message:
          "Find many channels to filter them which channel already connected to a Drive Folder",
        are: channels,
      });

      const isFolderConnected = channels.filter(
        (channel: { [key: string]: any }) => {
          return channel.drive_link === driveLink;
        }
      );

      logger.log({
        level: "info",
        message:
          "If a request folder already connected to a another channel then throw an error",
        are: isFolderConnected,
      });

      if (isFolderConnected.length) {
        throw "Drive folder already connected to another channel";
      }

      const channel: any = await prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });

      logger.log({
        level: "info",
        message: "Find channel with a unique channel id",
        are: channel,
      });

      const channelInfo = await axios.get(
        `${BaseURl.slack()}/conversations.members?channel=${
          channel.channel_id
        }&pretty=1`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const { members } = channelInfo.data;

      logger.log({
        level: "info",
        message:
          "Get list of all members by hitting conversations.members Slack Event API and add URL query to filter the channel",
        are: members,
      });

      let membersInfo = [];

      for (let i = 0; i < members.length; i++) {
        const member = await axios.get(
          `${BaseURl.slack()}/users.info?user=${members[i]}&pretty=1`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        logger.log({
          level: "info",
          message:
            "Get user detail information by hitting users.info Slack Event API",
          are: member,
        });

        membersInfo.push(member);
      }

      logger.info({
        level: "info",
        message:
          "Store all the user detail information in a variable called membersInfo",
        are: membersInfo,
      });

      const membersIdentity = membersInfo.map(
        (member: { [key: string]: any }) => {
          const { user } = member.data;

          return user;
        }
      );

      logger.log({
        level: "info",
        message:
          "Get user property to get members identity by mapping the membersInfo array",
        are: membersIdentity,
      });

      let arrayPermission: any[] = [];

      for (let i = 0; i < membersIdentity.length; i++) {
        let request: any;
        if (!ownerEmail.includes(membersIdentity[i].profile.email)) {
          request = await axios({
            url: `${BaseURl.googleDrive()}/${folderId}/permissions`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              role: permission,
              type: "user",
              emailAddress: membersIdentity[i].profile.email,
            },
          });
        }
        if (request) {
          logger.log({
            level: "info",
            message:
              "If a member of the channel is not the owner of the Drive Folder that just connected to a channel then enter a condition",
          });

          const { data: dataPermission } = request;

          arrayPermission.push(dataPermission);

          logger.info({
            level: "info",
            message:
              "Store all the new members permission to access the Drive Folder in arrayPerrmission",

            are: arrayPermission,
          });
        }
      }

      const updateChannel = await prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          drive_name: driveName,
          drive_link: driveLink,
          folder_id: folderId,
          drive_permission: permission,
        },
      });

      logger.log({
        level: "info",
        message: "Update a channel after connect a Drive Folder to a channel",
        are: updateChannel,
      });

      if (bookmark) {
        const responseListBookmark = await axios({
          url: `${BaseURl.slack()}/bookmarks.list?channel_id=${
            channel.channel_id
          }&pretty=1`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const { bookmarks: listBookmarks } = responseListBookmark.data;

        logger.log({
          level: "info",
          message: "Get list of bookmarks that are in the channel",
          are: listBookmarks,
        });

        let flagFolder = false;

        for (let i = 0; i < listBookmarks.length; i++) {
          if (driveLink === listBookmarks[i].link) {
            flagFolder = true;
          }
        }

        if (!flagFolder) {
          logger.log({
            level: "info",
            message:
              "If the channel bookmarks didn't have the same Drive Folder link then enter a condition",
            are: flagFolder,
          });

          const addBookmark = await axios({
            url: `${BaseURl.slack()}/bookmarks.add?channel_id=${
              channel.channel_id
            }&title=Channel%20Files&type=link&link=${driveLink}&pretty=1`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          logger.log({
            level: "info",
            message: "Add bookmark to a channel",
            are: addBookmark.data,
          });
        }
      }

      await prisma.$disconnect();

      res.status(200).json({
        message: "Update Success",
        data: updateChannel,
      });
    } catch (error: any) {
      await prisma.$disconnect();
      logger.log({
        level: "error",
        message: "Error on method connect inside Drive Controller",
        are: error,
      });
      res.status(400).json({
        message: "Connect folder failed",
        error,
      });
    }
  }
  static async disconnect(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { name, id, token, access_token } = req.body;

      const channel = await prisma.channel.findUnique({
        where: {
          id,
        },
      });

      logger.log({
        level: "info",
        message: "Find a channel according to parameters channel id",
        are: channel,
      });

      if (channel?.folder_id) {
        logger.log({
          level: "info",
          message:
            "If a channel folder_id column have a value then enter a condition",
        });

        const getPermission = await axios({
          url: `${BaseURl.googleDrive()}/${channel.folder_id}?fields=*`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { permissionIds, permissions } = getPermission.data;

        logger.log({
          level: "info",
          message: "Get all users Drive folder permission in the channel",
          are: { permissionIds, permissions },
        });

        const filterPermissons = permissions.filter(
          (userPermission: { [key: string]: any }) => {
            return userPermission.role === "owner";
          }
        );

        logger.log({
          level: "info",
          message:
            "Filter the Drive Folder permission to determine who the owner",
          are: filterPermissons,
        });

        for (let i = 0; i < permissionIds.length; i++) {
          if (filterPermissons[0].id !== permissionIds[i]) {
            const deletePermission = await axios({
              url: `${BaseURl.googleDrive()}/${channel.folder_id}/permissions/${
                permissionIds[i]
              }`,
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            logger.log({
              level: "info",
              message:
                "Revoke all the user permission to access the Drive Folder",
              are: deletePermission,
            });
          }
        }

        const responseListBookmark = await axios({
          url: `${BaseURl.slack()}/bookmarks.list?channel_id=${
            channel.channel_id
          }&pretty=1`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const { bookmarks: listBookmarks } = responseListBookmark.data;

        logger.log({
          level: "info",
          message: "Get all list bookmark in the channel",
          are: listBookmarks,
        });

        const filterBookmark = listBookmarks.filter(
          (bookmark: { [key: string]: any }) => {
            return bookmark.link === channel.drive_link;
          }
        );

        if (filterBookmark.length > 0) {
          const removeBookmark = await axios({
            url: `${BaseURl.slack()}/bookmarks.remove?bookmark_id=${
              filterBookmark[0].id
            }&channel_id=${channel.channel_id}&pretty=1`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          logger.log({
            level: "info",
            message:
              "Remove bookmark from the channel after disconnect the folder from the channel",
            are: removeBookmark.data,
          });
        }
      }

      const disconnectFolder = await prisma.channel.update({
        where: {
          id: id,
        },
        data: {
          drive_link: null,
          drive_name: null,
          folder_id: null,
          drive_permission: null,
        },
      });

      logger.log({
        level: "info",
        message:
          "Update the datbase to remove drive_link, drive_name, folder_id, and folder_permission",
        are: disconnectFolder,
      });

      await prisma.$disconnect();

      res.status(200).json({
        message: "Drive successfully disconnected",
        data: disconnectFolder,
      });
    } catch (error: any) {
      await prisma.$disconnect();
      logger.log({
        level: "error",
        message: "Error on disconnect function",
        are: error,
      });
      console.log(error);
    }
  }
}

export default DriveController;
