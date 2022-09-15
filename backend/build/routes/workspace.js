"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/** Controller */
var WorkspaceController_1 = __importDefault(require("../controllers/WorkspaceController"));
var router = (0, express_1.Router)();
router.get("/:userId", WorkspaceController_1.default.getAll);
exports.default = router;
