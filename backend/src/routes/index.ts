import { Router } from "express";

import channels from "./channels";

import user from "./user";

import drive from "./drive";

import workspace from "./workspace";

const router = Router();

router.use("/api/v1/channels", channels);

router.use("/api/v1/user", user);

router.use("/api/v1/drive", drive);

router.use("/api/v1/workspace", workspace);

export default router;
