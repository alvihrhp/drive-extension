import { createApp } from "./createApp";
/** Prisma Client */
import { PrismaClient } from "@prisma/client";
/** Axios */
import axios from "axios";
/** Helper */
import { BaseURl } from "./helper";
/** Logger */
import logging from "./logger";

const { app, receiver } = createApp("slackgoogledrive");

const prisma = new PrismaClient();

app.event("group_deleted", async ({ event, client, logger }) => {
  try {
    await prisma.$connect();

    const { type, channel }: { type: string; channel: string } = event;

    logging.log({
      level: "info",
      message: "Delete private channel from Slack",
      are: channel,
    });

    const uniqueChannel = await prisma.channel.findUnique({
      where: {
        channel_id: channel,
      },
      include: {
        team: true,
      },
    });

    logging.log({
      level: "info",
      message: "Find a channel with a unique id",
      are: uniqueChannel,
    });

    if (uniqueChannel?.drive_link) {
      const { folder_id, team } = uniqueChannel;

      logging.log({
        level: "info",
        message:
          "If a channel does exist with a drive link then enter a condition",
      });

      const user: any = await prisma.user.findFirst({
        where: {
          id: team.userId,
        },
      });

      logging.log({
        level: "info",
        message: "Find a the owner of the workspace base on team user id",
        are: user,
      });

      const body = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: user.refresh_token,
        grant_type: "refresh_token",
      };

      const response = await axios({
        url: `${BaseURl.googleOAuth()}/v4/token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: body,
      });

      const { access_token } = response.data;

      logging.log({
        level: "info",
        message: "Get new access token based on refresh token in user database",
        are: access_token,
      });

      const getPermission = await axios({
        url: `${BaseURl.googleDrive()}/${folder_id}?fields=*`,
        method: "get",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { permissionIds, permissions } = getPermission.data;

      logging.log({
        level: "info",
        message:
          "Gel all user permission from the folder that connected to the private channel that want to be deleted",
        are: getPermission.data,
      });

      const filterPermissons = permissions.filter(
        (userPermission: { [key: string]: any }) => {
          return userPermission.role === "owner";
        }
      );

      logging.log({
        level: "info",
        message:
          "Filter all the permissions and return the user who own the folder",
        are: filterPermissons,
      });

      for (let i = 0; i < permissionIds.length; i++) {
        if (filterPermissons[0].id !== permissionIds[i]) {
          logging.log({
            level: "info",
            message: `If ${filterPermissons[0].id} not equal to ${permissionIds[0]} then enter a condition`,
          });
          const deletePermission = await axios({
            url: `${BaseURl.googleDrive()}/${folder_id}/permissions/${
              permissionIds[i]
            }`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          logging.log({
            level: "info",
            message:
              "Revoke all the user permission to access the folder that connected to the private channel",
            are: deletePermission.data,
          });
        }
      }
    }

    const deleteChannel = await prisma.channel.delete({
      where: {
        channel_id: channel,
      },
    });

    logging.info({
      level: "info",
      message: "Delete private channel from database based on channel id",
      are: deleteChannel,
    });

    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    logging.log({
      level: "error",
      message: "Error on app event group_deleted",
      are: error,
    });
    console.log(error);
  }
});

app.event("channel_deleted", async ({ event, client, logger }) => {
  try {
    await prisma.$connect();

    const { type, channel }: any = event;

    logging.log({
      level: "info",
      message: "Delete public channel from Slack",
      are: channel,
    });

    const uniqueChannel = await prisma.channel.findUnique({
      where: {
        channel_id: channel,
      },
      include: {
        team: true,
      },
    });

    logging.log({
      level: "info",
      message:
        "Find a channel based on channel id and include a team that stored that channel",
      are: uniqueChannel,
    });

    if (uniqueChannel?.drive_link) {
      const { folder_id, team } = uniqueChannel;

      logging.log({
        level: "info",
        message:
          "If a channel does exist with a drive link then enter a condition",
      });

      const user: any = await prisma.user.findFirst({
        where: {
          id: team.userId,
        },
      });

      logging.log({
        level: "info",
        message: "Find a the owner of the workspace base on team user id",
        are: user,
      });

      const body = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: user.refresh_token,
        grant_type: "refresh_token",
      };

      const response = await axios({
        url: `${BaseURl.googleOAuth()}/v4/token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: body,
      });

      const { access_token } = response.data;

      logging.log({
        level: "info",
        message: "Get new access token based on refresh token in user database",
        are: access_token,
      });

      const getPermission = await axios({
        url: `${BaseURl.googleDrive()}/${folder_id}?fields=*`,
        method: "get",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { permissionIds, permissions } = getPermission.data;

      logging.log({
        level: "info",
        message:
          "Gel all user permission from the folder that connected to the private channel that want to be deleted",
        are: getPermission.data,
      });

      const filterPermissons = permissions.filter(
        (userPermission: { [key: string]: any }) => {
          return userPermission.role === "owner";
        }
      );

      logging.log({
        level: "info",
        message:
          "Filter all the permissions and return the user who own the folder",
        are: filterPermissons,
      });

      for (let i = 0; i < permissionIds.length; i++) {
        if (filterPermissons[0].id !== permissionIds[i]) {
          logging.log({
            level: "info",
            message: `If ${filterPermissons[0].id} not equal to ${permissionIds[0]} then enter a condition`,
          });
          const deletePermission = await axios({
            url: `${BaseURl.googleDrive()}/${folder_id}/permissions/${
              permissionIds[i]
            }`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          logging.log({
            level: "info",
            message:
              "Revoke all the user permission to access the folder that connected to the private channel",
            are: deletePermission.data,
          });
        }
      }
    }

    const deleteChannel = await prisma.channel.delete({
      where: {
        channel_id: channel,
      },
    });

    logging.info({
      level: "info",
      message: "Delete public channel from database based on channel id",
      are: deleteChannel,
    });

    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    logging.log({
      level: "error",
      message: "Error on app event channel_deleted",
      are: error,
    });
    console.log(error);
  }
});

app.event("member_joined_channel", async ({ event, client, logger }) => {
  try {
    await prisma.$connect();

    const {
      type,
      user,
      channel: channelId,
      channel_type,
      team,
      event_ts,
    } = event;

    logging.log({
      level: "info",
      message:
        "Slack event if a member join a channel or a private channel is created",
      are: { user, team, channelId },
    });

    const existingChannel = await prisma.channel.findUnique({
      where: {
        channel_id: channelId,
      },
    });

    logging.log({
      level: "info",
      message: "Search for a channel based on channel id",
      are: existingChannel,
    });

    if (!existingChannel) {
      logging.log({
        level: "info",
        message: `If existingChannel is null then a new private channel is created`,
      });

      const newChannel: any = await client.conversations.info({
        channel: channelId,
      });

      logging.log({
        level: "info",
        message:
          "Get new channel detail through conversations.info Slack API endpoint",
        are: newChannel,
      });

      const teamInfo: any = await prisma.team.findUnique({
        where: {
          team_id: team,
        },
      });

      logging.log({
        level: "info",
        message: "Get team info from team table database through team_id",
        are: teamInfo,
      });

      const data = {
        channel_id: newChannel.channel.id,
        name: newChannel.channel.name,
        teamId: teamInfo.id,
      };

      logging.log({
        level: "info",
        message:
          "Create new variable called data to store all the information needed for insert new priavte channel to the database with property channel_id, name and team_id",
        are: data,
      });

      const insertChannel = await prisma.channel.create({
        data,
      });

      logging.log({
        level: "info",
        message: "Insert new private to the database",
        are: insertChannel,
      });
    } else {
      logging.log({
        level: "info",
        message: "If existing channel does exist then enter else condition",
      });

      const { user: userInfo }: any = await client.users.info({
        user,
      });

      logging.log({
        level: "info",
        message:
          "Get information from the user that just join the channel by hitting users.info Slack API endpoint",
        are: userInfo,
      });

      const { email } = userInfo.profile;

      const teamDB: any = await prisma.team.findFirst({
        where: {
          team_id: team,
        },
        include: {
          user: true,
        },
      });

      const { user: userDB } = teamDB;

      logging.log({
        level: "info",
        message:
          "Get workspace owner from database through team id and include user",
        are: userDB,
      });

      if (userDB.refresh_token) {
        logging.log({
          level: "info",
          message:
            "Check if the owner of the workspace already have the refresh token to indicate that the owner have already logged in to Slack Drive",
        });

        const body = {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: userDB.refresh_token,
          grant_type: "refresh_token",
        };

        const response = await axios({
          url: `${BaseURl.googleOAuth()}/v4/token`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: body,
        });

        const { access_token } = response.data;

        logging.log({
          level: "info",
          message:
            "Get new access token from google oauth with owner workspace refresh token that stored in the database",
          are: access_token,
        });

        const channel: any = await prisma.channel.findUnique({
          where: {
            channel_id: channelId,
          },
        });

        const { folder_id, drive_permission } = channel;

        logging.log({
          level: "info",
          message:
            "Find channel from the database with channel_id to get the folder_id that connected to that channel and user permission as a reader or writer",
          are: { folder_id, drive_permission },
        });

        if (folder_id) {
          const permission: any = await axios({
            url: `${BaseURl.googleDrive()}/${folder_id}/permissions`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            data: {
              role: drive_permission,
              type: "user",
              emailAddress: email,
            },
          });
          logging.log({
            level: "info",
            message: "Give drive access to the new user that join the channel",
            are: permission.data,
          });
        }
      }
    }

    await prisma.$disconnect();
  } catch (error: any) {
    await prisma.$disconnect();
    logging.log({
      level: "error",
      message: "Error on app event member_joined_channel",
      are: error,
    });
    console.log(error.response.data);
  }
});

app.event("member_left_channel", async ({ event, client, logger }) => {
  try {
    await prisma.$connect();

    const { channel, team, user } = event;

    logging.log({
      level: "info",
      message: "Slack Event for member left channel",
      are: { channel, team, user },
    });

    const channelDB: any = await prisma.channel.findUnique({
      where: {
        channel_id: channel,
      },
      include: {
        team: true,
      },
    });

    const { team: teamDB } = channelDB;

    logging.log({
      level: "info",
      message: "Get team from database through find channel by channel_id",
      are: teamDB,
    });

    const userDB: any = await prisma.user.findUnique({
      where: {
        id: teamDB.userId,
      },
    });

    logging.log({
      level: "info",
      message: "Get the owner of the workspace with user id",
      are: userDB,
    });

    if (channelDB?.drive_link) {
      logging.log({
        level: "info",
        message: "If a channel have a drive_link value then enter a condition",
      });

      const { members } = await client.users.list({
        team_id: channel,
      });

      logging.log({
        level: "info",
        message: "Get all members from the channel that the user left",
        are: members,
      });

      const body = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: userDB.refresh_token,
        grant_type: "refresh_token",
      };

      const response = await axios({
        url: `${BaseURl.googleOAuth()}/v4/token`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: body,
      });

      const { access_token } = response.data;

      logging.log({
        level: "info",
        message:
          "Get new access_token from the owner of the workspace refresh_token",
        are: access_token,
      });

      const getPermission = await axios({
        url: `${BaseURl.googleDrive()}/${channelDB.folder_id}?fields=*`,
        method: "get",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const { permissionIds, permissions } = getPermission.data;

      logging.log({
        level: "info",
        message:
          "Get all user permission from the Drive Folder that connected to the channel",
        are: { permissionIds, permissions },
      });

      const filterUser: any = members?.filter(
        (member: { [key: string]: any }) => {
          return member.id === user;
        }
      );

      logging.log({
        level: "info",
        message:
          "Filter all the members to determine which user left the channel",
        are: filterUser,
      });

      const filterPermission = permissions.filter(
        (permission: { [key: string]: any }) => {
          return filterUser[0].profile.email === permission.emailAddress;
        }
      );

      logging.log({
        level: "info",
        message:
          "Filter list of user permissions to access the drive folder with the user who left the channel",
        are: filterPermission,
      });

      if (filterPermission.length && filterPermission[0].role !== "owner") {
        const deletePermission = await axios({
          url: `${BaseURl.googleDrive()}/${channelDB.folder_id}/permissions/${
            filterPermission[0].id
          }`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        logging.info({
          level: "info",
          message:
            "Revoke the user permission to access the drive folder for the user who left the channel",
          are: deletePermission.data,
        });
      }
    }
    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    logging.log({
      level: "error",
      message: "Error on app event member_left_channel",
      are: error,
    });
    console.log(error);
  }
});

export { receiver };
