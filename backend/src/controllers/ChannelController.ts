import { Request, Response, NextFunction } from "express";
/** Axios */
import axios from "axios";
/** Prisma Client */
import { PrismaClient } from "@prisma/client";
/** Helper */
import { BaseURl } from "../helper";
/** logger */
import logger from "../logger";

const prisma = new PrismaClient();

class ChannelController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { id } = req.params;

      const channels = await prisma.channel.findMany({
        where: {
          teamId: Number(id),
        },
        orderBy: {
          id: "asc",
        },
      });

      logger.log({
        level: "info",
        message: "Find all channels that connected to the team id",
        are: channels,
      });

      await prisma.$disconnect();

      res.status(200).json({
        message: "Successfully Get List Slack Channels",
        data: channels,
      });
    } catch (error) {
      await prisma.$disconnect();
      logger.log({
        level: "error",
        message: "Error on method getList on Channel Controller",
        are: error,
      });
      console.log(error);
    }
  }
}

export default ChannelController;
