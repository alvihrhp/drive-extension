import { Router, Request, Response } from "express";
/** Controller */
import UserController from "../controllers/UserController";

const router = Router();

router.post("/authLink", UserController.getAuthLink);

router.get("/oauth2callback", UserController.OAuthCallback);

router.post("/getValidToken", UserController.getValidToken);

router.post("/verify", UserController.verify);

router.post("/slackAuth?", UserController.slackAuth);

export default router;
