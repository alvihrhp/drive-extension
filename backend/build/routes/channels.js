"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/** Controller */
var ChannelController_1 = __importDefault(require("../controllers/ChannelController"));
var router = (0, express_1.Router)();
router.get("/list/:id", ChannelController_1.default.getList);
exports.default = router;
