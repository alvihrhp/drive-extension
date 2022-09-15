import { Request, Response, NextFunction } from "express";
/** Prisma Client */
import { PrismaClient } from "@prisma/client";
/** logger */
import logger from "../logger";

const prisma = new PrismaClient();

class WorkspaceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.$connect();

      const { userId } = req.params;

      const workspaces = await prisma.team.findMany({
        where: {
          userId: Number(userId),
        },
      });

      logger.info({
        level: "info",
        message: `Get list of teams that connected to userID: ${userId}`,
        are: workspaces,
      });

      await prisma.$disconnect();

      res.status(200).json({
        message: "Workspaces successfully fetched",
        data: workspaces,
      });
    } catch (error) {
      await prisma.$disconnect();
      logger.info({
        level: "error",
        message: `Get list of teams that connected to a user`,
        are: error,
      });

      console.log(error);
    }
  }
}

export default WorkspaceController;
