"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
/** Controller */
var UserController_1 = __importDefault(require("../controllers/UserController"));
var router = (0, express_1.Router)();
router.post("/authLink", UserController_1.default.getAuthLink);
router.get("/oauth2callback", UserController_1.default.OAuthCallback);
router.post("/getValidToken", UserController_1.default.getValidToken);
router.post("/verify", UserController_1.default.verify);
router.post("/slackAuth?", UserController_1.default.slackAuth);
exports.default = router;
