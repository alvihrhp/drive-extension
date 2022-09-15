"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Google Auth Library */
var googleapis_1 = require("googleapis");
/** Prisma Client */
var client_1 = require("@prisma/client");
/** Axios */
var axios_1 = __importDefault(require("axios"));
/** Helper */
var helper_1 = require("../helper");
/** Logger */
var logger_1 = __importDefault(require("../logger"));
var prisma = new client_1.PrismaClient();
var oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URL);
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.getAuthLink = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                try {
                    url = oauth2Client.generateAuthUrl({
                        access_type: "offline",
                        scope: [
                            "".concat(helper_1.BaseURl.googleAuth(), "/userinfo.email"),
                            "".concat(helper_1.BaseURl.googleAuth(), "/userinfo.profile"),
                            "".concat(helper_1.BaseURl.googleAuth(), "/drive"),
                        ],
                        prompt: "consent",
                    });
                    logger_1.default.log({
                        level: "info",
                        message: "Generarte Google Oauth2 URL to login to google",
                        are: url,
                    });
                    res.status(200).json({
                        message: "Successfully fetched google link",
                        data: url,
                    });
                }
                catch (error) {
                    logger_1.default.log({
                        level: "error",
                        message: "Error in getAuthLink method",
                        are: error,
                    });
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    UserController.OAuthCallback = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var code;
            return __generator(this, function (_a) {
                try {
                    code = req.query.code;
                    oauth2Client.getToken(code, function (err, tokens) {
                        if (err) {
                            throw err.message;
                        }
                        logger_1.default.log({
                            level: "info",
                            message: "Get google Oauth2 refresh_token and and access_token",
                            are: tokens,
                        });
                        var accessToken = tokens.access_token;
                        var refreshToken = tokens.refresh_token;
                        res.redirect("".concat(process.env.CLIENT_URL, "?accessToken=").concat(accessToken, "&refreshToken=").concat(refreshToken));
                    });
                }
                catch (error) {
                    logger_1.default.log({
                        level: "error",
                        message: "Error in method OAuthCallback",
                        are: error,
                    });
                    console.log(error);
                }
                return [2 /*return*/];
            });
        });
    };
    UserController.getValidToken = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, data, response, access_token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        refreshToken = req.body.refreshToken;
                        data = {
                            client_id: process.env.GOOGLE_CLIENT_ID,
                            client_secret: process.env.GOOGLE_CLIENT_SECRET,
                            refresh_token: refreshToken,
                            grant_type: "refresh_token",
                        };
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.googleOAuth(), "/v4/token"),
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                data: data,
                            })];
                    case 1:
                        response = _a.sent();
                        access_token = response.data.access_token;
                        logger_1.default.log({
                            level: "info",
                            message: "Get new access_token if the current access_token is expired",
                            are: response.data,
                        });
                        res.status(200).json({
                            message: "Got a new token",
                            data: access_token,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error in getValidToken method",
                            are: error_1,
                        });
                        console.log(error_1.data.error);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.slackAuth = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var code, workspace, dataWorkspace, workspaceDetail, dataWorkspaceDetail, authedUser, dataAuthedUser, newUser, findUser, newTeam_1, findTeam, channels, dataChannels, newChannels, insertChannels, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 14, , 16]);
                        return [4 /*yield*/, prisma.$connect()];
                    case 1:
                        _a.sent();
                        code = req.query.code;
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/oauth.v2.access?client_id=").concat(process.env.SLACK_APP_CLIENT_ID, "&client_secret=").concat(process.env.SLACK_CLIENT_SECRET, "&code=").concat(code),
                                method: "POST",
                            })];
                    case 2:
                        workspace = _a.sent();
                        dataWorkspace = workspace.data;
                        logger_1.default.log({
                            level: "info",
                            message: "Installing Slack Drive to the choosen workspace",
                            leve: dataWorkspace,
                        });
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/team.info?team=").concat(dataWorkspace.team.id, "&pretty=1"),
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer ".concat(dataWorkspace.authed_user.access_token),
                                },
                            })];
                    case 3:
                        workspaceDetail = _a.sent();
                        dataWorkspaceDetail = workspaceDetail.data;
                        logger_1.default.log({
                            level: "info",
                            message: "Getting detail information from workspace that just got installed",
                            leve: dataWorkspaceDetail,
                        });
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/users.info?user=").concat(dataWorkspace.authed_user.id, "&pretty=1"),
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer ".concat(dataWorkspace.authed_user.access_token),
                                },
                            })];
                    case 4:
                        authedUser = _a.sent();
                        dataAuthedUser = authedUser.data;
                        logger_1.default.log({
                            level: "info",
                            message: "Getting the owner email of the workspace that just installed Slack Drive ",
                            leve: dataAuthedUser,
                        });
                        newUser = void 0;
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    email: dataAuthedUser.user.profile.email,
                                },
                            })];
                    case 5:
                        findUser = _a.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Get user froom DB where email is from dataAuthedUser.user.profile.email",
                            are: findUser,
                        });
                        if (!((findUser === null || findUser === void 0 ? void 0 : findUser.email) !== dataAuthedUser.user.profile.email)) return [3 /*break*/, 7];
                        return [4 /*yield*/, prisma.user.create({
                                data: {
                                    email: dataAuthedUser.user.profile.email,
                                    slack_user_id: dataAuthedUser.user.id,
                                },
                            })];
                    case 6:
                        newUser = _a.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Insert new user to the database",
                            leve: dataAuthedUser,
                        });
                        _a.label = 7;
                    case 7: return [4 /*yield*/, prisma.team.findUnique({
                            where: {
                                team_id: dataWorkspace.team.id,
                            },
                        })];
                    case 8:
                        findTeam = _a.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Find workspace on the DB to know if the team already exist in the or not",
                            are: findTeam,
                        });
                        if (!!findTeam) return [3 /*break*/, 12];
                        return [4 /*yield*/, prisma.team.create({
                                data: {
                                    name: dataWorkspaceDetail.team.name,
                                    url: dataWorkspaceDetail.team.url,
                                    domain: dataWorkspaceDetail.team.domain,
                                    is_verified: dataWorkspaceDetail.team.is_verified,
                                    team_id: dataWorkspaceDetail.team.id,
                                    access_token: dataWorkspace.authed_user.access_token,
                                    userId: newUser ? newUser.id : findUser.id,
                                },
                            })];
                    case 9:
                        newTeam_1 = _a.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "If the workspace is not already in the DB create a new one",
                            are: newTeam_1,
                        });
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/conversations.list?pretty=1&types=public_channel,private_channel"),
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer ".concat(dataWorkspace.authed_user.access_token),
                                },
                            })];
                    case 10:
                        channels = _a.sent();
                        dataChannels = channels.data.channels;
                        logger_1.default.log({
                            level: "info",
                            message: "Get all the channels from the workspace that just installed Slack Drive",
                            are: dataChannels,
                        });
                        newChannels = dataChannels.map(function (channel) {
                            return {
                                channel_id: channel.id,
                                name: channel.name,
                                teamId: newTeam_1.id,
                            };
                        });
                        return [4 /*yield*/, prisma.channel.createMany({
                                data: newChannels,
                            })];
                    case 11:
                        insertChannels = _a.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Insert all the channels from the workspace that just installed Slack Drive",
                            are: insertChannels,
                        });
                        _a.label = 12;
                    case 12: return [4 /*yield*/, prisma.$disconnect()];
                    case 13:
                        _a.sent();
                        res.status(201).json({
                            message: "Slack Drive successfully installed on your workspace",
                        });
                        return [3 /*break*/, 16];
                    case 14:
                        error_2 = _a.sent();
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 15:
                        _a.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error in getValidToken method",
                            are: error_2,
                        });
                        console.log(error_2);
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    UserController.verify = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, token, refreshToken, responseGoogleUser, dataGoogleUser, userId, user, updatedUser, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 10]);
                        return [4 /*yield*/, prisma.$connect()];
                    case 1:
                        _b.sent();
                        _a = req.body, token = _a.token, refreshToken = _a.refreshToken;
                        return [4 /*yield*/, axios_1.default.get("".concat(helper_1.BaseURl.googleOAuth(), "/v1/userinfo?alt=json&access_token=").concat(token))];
                    case 2:
                        responseGoogleUser = _b.sent();
                        dataGoogleUser = responseGoogleUser.data;
                        logger_1.default.log({
                            level: "info",
                            message: "Verify the user when loggin in into google",
                            are: dataGoogleUser,
                        });
                        userId = dataGoogleUser.id;
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: {
                                    google_user_id: userId,
                                },
                            })];
                    case 3:
                        user = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Find a user base on google_user_id",
                            are: user,
                        });
                        updatedUser = void 0;
                        if (!!user) return [3 /*break*/, 5];
                        return [4 /*yield*/, prisma.user.update({
                                where: {
                                    email: dataGoogleUser.email,
                                },
                                data: {
                                    access_token: token,
                                    refresh_token: token,
                                    google_user_id: userId,
                                },
                            })];
                    case 4:
                        updatedUser = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "If the google hasn't have a google_user_id then update the user with the new access_token, refresh_token and google_user_id",
                            are: updatedUser,
                        });
                        _b.label = 5;
                    case 5: return [4 /*yield*/, prisma.user.update({
                            where: {
                                google_user_id: userId,
                            },
                            data: {
                                refresh_token: refreshToken,
                            },
                        })];
                    case 6:
                        updatedUser = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "If a user already have google_user_id then update the refresh_token only",
                            are: updatedUser,
                        });
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 7:
                        _b.sent();
                        res.status(200).json({
                            message: "User successfully fetched",
                            data: updatedUser,
                        });
                        return [3 /*break*/, 10];
                    case 8:
                        error_3 = _b.sent();
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 9:
                        _b.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error in method verify",
                            are: error_3,
                        });
                        console.log(error_3);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.default = UserController;
