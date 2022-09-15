import { Router } from "express";
/** Controller */
import WorkspaceController from "../controllers/WorkspaceController";

const router = Router();

router.get("/:userId", WorkspaceController.getAll);

export default router;
