"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var channels_1 = __importDefault(require("./channels"));
var user_1 = __importDefault(require("./user"));
var drive_1 = __importDefault(require("./drive"));
var workspace_1 = __importDefault(require("./workspace"));
var router = (0, express_1.Router)();
router.use("/api/v1/channels", channels_1.default);
router.use("/api/v1/user", user_1.default);
router.use("/api/v1/drive", drive_1.default);
router.use("/api/v1/workspace", workspace_1.default);
exports.default = router;
