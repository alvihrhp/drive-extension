import { Router } from "express";
/** Controller */
import ChannelController from "../controllers/ChannelController";

const router = Router();

router.get("/list/:id", ChannelController.getList);

export default router;
