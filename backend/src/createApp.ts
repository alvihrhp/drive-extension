import { App, ExpressReceiver } from "@slack/bolt";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createApp = (appName: string) => {
  const signingSecret: any = process.env.SLACK_SIGNING_SECRET;
  const token: any = process.env.SLACK_APP_BOT_TOKEN;

  const receiver = new ExpressReceiver({
    signingSecret,
    endpoints: {
      events: `/${appName}/slack/events`,
    },
  });

  const app = new App({
    authorize: authorizeFn,
    receiver,
  });

  return { app, receiver };
};

const authorizeFn = async ({ teamId, enterpriseId }: any) => {
  // Fetch team info from database
  const team = await prisma.team.findUnique({
    where: {
      team_id: teamId,
    },
  });

  if (team) {
    return {
      userToken: team.access_token,
    };
  }

  throw new Error("No matching authorizations");
};
