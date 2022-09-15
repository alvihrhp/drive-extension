import { Router } from "express";
/** Controller */
import DriveController from "../controllers/DriveController";

const router = Router();

router.get("/list?", DriveController.get);

router.get("/sublist?", DriveController.getSub);

router.put("/connect?", DriveController.connect);

router.put("/disconnect", DriveController.disconnect);

export default router;
