"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/** Controller */
var DriveController_1 = __importDefault(require("../controllers/DriveController"));
var router = (0, express_1.Router)();
router.get("/list?", DriveController_1.default.get);
router.get("/sublist?", DriveController_1.default.getSub);
router.put("/connect?", DriveController_1.default.connect);
router.put("/disconnect", DriveController_1.default.disconnect);
exports.default = router;
