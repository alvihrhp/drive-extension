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
exports.receiver = void 0;
var createApp_1 = require("./createApp");
/** Prisma Client */
var client_1 = require("@prisma/client");
/** Axios */
var axios_1 = __importDefault(require("axios"));
/** Helper */
var helper_1 = require("./helper");
/** Logger */
var logger_1 = __importDefault(require("./logger"));
var _a = (0, createApp_1.createApp)("slackgoogledrive"), app = _a.app, receiver = _a.receiver;
exports.receiver = receiver;
var prisma = new client_1.PrismaClient();
app.event("group_deleted", function (_a) {
    var event = _a.event, client = _a.client, logger = _a.logger;
    return __awaiter(void 0, void 0, void 0, function () {
        var type, channel, uniqueChannel, folder_id, team, user, body, response, access_token, getPermission, _b, permissionIds, permissions, filterPermissons, i, deletePermission, deleteChannel, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 12, , 14]);
                    return [4 /*yield*/, prisma.$connect()];
                case 1:
                    _c.sent();
                    type = event.type, channel = event.channel;
                    logger_1.default.log({
                        level: "info",
                        message: "Delete private channel from Slack",
                        are: channel,
                    });
                    return [4 /*yield*/, prisma.channel.findUnique({
                            where: {
                                channel_id: channel,
                            },
                            include: {
                                team: true,
                            },
                        })];
                case 2:
                    uniqueChannel = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Find a channel with a unique id",
                        are: uniqueChannel,
                    });
                    if (!(uniqueChannel === null || uniqueChannel === void 0 ? void 0 : uniqueChannel.drive_link)) return [3 /*break*/, 9];
                    folder_id = uniqueChannel.folder_id, team = uniqueChannel.team;
                    logger_1.default.log({
                        level: "info",
                        message: "If a channel does exist with a drive link then enter a condition",
                    });
                    return [4 /*yield*/, prisma.user.findFirst({
                            where: {
                                id: team.userId,
                            },
                        })];
                case 3:
                    user = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Find a the owner of the workspace base on team user id",
                        are: user,
                    });
                    body = {
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: user.refresh_token,
                        grant_type: "refresh_token",
                    };
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleOAuth(), "/v4/token"),
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            data: body,
                        })];
                case 4:
                    response = _c.sent();
                    access_token = response.data.access_token;
                    logger_1.default.log({
                        level: "info",
                        message: "Get new access token based on refresh token in user database",
                        are: access_token,
                    });
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(folder_id, "?fields=*"),
                            method: "get",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                case 5:
                    getPermission = _c.sent();
                    _b = getPermission.data, permissionIds = _b.permissionIds, permissions = _b.permissions;
                    logger_1.default.log({
                        level: "info",
                        message: "Gel all user permission from the folder that connected to the private channel that want to be deleted",
                        are: getPermission.data,
                    });
                    filterPermissons = permissions.filter(function (userPermission) {
                        return userPermission.role === "owner";
                    });
                    logger_1.default.log({
                        level: "info",
                        message: "Filter all the permissions and return the user who own the folder",
                        are: filterPermissons,
                    });
                    i = 0;
                    _c.label = 6;
                case 6:
                    if (!(i < permissionIds.length)) return [3 /*break*/, 9];
                    if (!(filterPermissons[0].id !== permissionIds[i])) return [3 /*break*/, 8];
                    logger_1.default.log({
                        level: "info",
                        message: "If ".concat(filterPermissons[0].id, " not equal to ").concat(permissionIds[0], " then enter a condition"),
                    });
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(folder_id, "/permissions/").concat(permissionIds[i]),
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                case 7:
                    deletePermission = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Revoke all the user permission to access the folder that connected to the private channel",
                        are: deletePermission.data,
                    });
                    _c.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, prisma.channel.delete({
                        where: {
                            channel_id: channel,
                        },
                    })];
                case 10:
                    deleteChannel = _c.sent();
                    logger_1.default.info({
                        level: "info",
                        message: "Delete private channel from database based on channel id",
                        are: deleteChannel,
                    });
                    return [4 /*yield*/, prisma.$disconnect()];
                case 11:
                    _c.sent();
                    return [3 /*break*/, 14];
                case 12:
                    error_1 = _c.sent();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 13:
                    _c.sent();
                    logger_1.default.log({
                        level: "error",
                        message: "Error on app event group_deleted",
                        are: error_1,
                    });
                    console.log(error_1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
});
app.event("channel_deleted", function (_a) {
    var event = _a.event, client = _a.client, logger = _a.logger;
    return __awaiter(void 0, void 0, void 0, function () {
        var type, channel, uniqueChannel, folder_id, team, user, body, response, access_token, getPermission, _b, permissionIds, permissions, filterPermissons, i, deletePermission, deleteChannel, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 12, , 14]);
                    return [4 /*yield*/, prisma.$connect()];
                case 1:
                    _c.sent();
                    type = event.type, channel = event.channel;
                    logger_1.default.log({
                        level: "info",
                        message: "Delete public channel from Slack",
                        are: channel,
                    });
                    return [4 /*yield*/, prisma.channel.findUnique({
                            where: {
                                channel_id: channel,
                            },
                            include: {
                                team: true,
                            },
                        })];
                case 2:
                    uniqueChannel = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Find a channel based on channel id and include a team that stored that channel",
                        are: uniqueChannel,
                    });
                    if (!(uniqueChannel === null || uniqueChannel === void 0 ? void 0 : uniqueChannel.drive_link)) return [3 /*break*/, 9];
                    folder_id = uniqueChannel.folder_id, team = uniqueChannel.team;
                    logger_1.default.log({
                        level: "info",
                        message: "If a channel does exist with a drive link then enter a condition",
                    });
                    return [4 /*yield*/, prisma.user.findFirst({
                            where: {
                                id: team.userId,
                            },
                        })];
                case 3:
                    user = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Find a the owner of the workspace base on team user id",
                        are: user,
                    });
                    body = {
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: user.refresh_token,
                        grant_type: "refresh_token",
                    };
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleOAuth(), "/v4/token"),
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            data: body,
                        })];
                case 4:
                    response = _c.sent();
                    access_token = response.data.access_token;
                    logger_1.default.log({
                        level: "info",
                        message: "Get new access token based on refresh token in user database",
                        are: access_token,
                    });
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(folder_id, "?fields=*"),
                            method: "get",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                case 5:
                    getPermission = _c.sent();
                    _b = getPermission.data, permissionIds = _b.permissionIds, permissions = _b.permissions;
                    logger_1.default.log({
                        level: "info",
                        message: "Gel all user permission from the folder that connected to the private channel that want to be deleted",
                        are: getPermission.data,
                    });
                    filterPermissons = permissions.filter(function (userPermission) {
                        return userPermission.role === "owner";
                    });
                    logger_1.default.log({
                        level: "info",
                        message: "Filter all the permissions and return the user who own the folder",
                        are: filterPermissons,
                    });
                    i = 0;
                    _c.label = 6;
                case 6:
                    if (!(i < permissionIds.length)) return [3 /*break*/, 9];
                    if (!(filterPermissons[0].id !== permissionIds[i])) return [3 /*break*/, 8];
                    logger_1.default.log({
                        level: "info",
                        message: "If ".concat(filterPermissons[0].id, " not equal to ").concat(permissionIds[0], " then enter a condition"),
                    });
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(folder_id, "/permissions/").concat(permissionIds[i]),
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                case 7:
                    deletePermission = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Revoke all the user permission to access the folder that connected to the private channel",
                        are: deletePermission.data,
                    });
                    _c.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, prisma.channel.delete({
                        where: {
                            channel_id: channel,
                        },
                    })];
                case 10:
                    deleteChannel = _c.sent();
                    logger_1.default.info({
                        level: "info",
                        message: "Delete public channel from database based on channel id",
                        are: deleteChannel,
                    });
                    return [4 /*yield*/, prisma.$disconnect()];
                case 11:
                    _c.sent();
                    return [3 /*break*/, 14];
                case 12:
                    error_2 = _c.sent();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 13:
                    _c.sent();
                    logger_1.default.log({
                        level: "error",
                        message: "Error on app event channel_deleted",
                        are: error_2,
                    });
                    console.log(error_2);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
});
app.event("member_joined_channel", function (_a) {
    var event = _a.event, client = _a.client, logger = _a.logger;
    return __awaiter(void 0, void 0, void 0, function () {
        var type, user, channelId, channel_type, team, event_ts, existingChannel, newChannel, teamInfo, data, insertChannel, userInfo, email, teamDB, userDB, body, response, access_token, channel, folder_id, drive_permission, permission, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 14, , 16]);
                    return [4 /*yield*/, prisma.$connect()];
                case 1:
                    _b.sent();
                    type = event.type, user = event.user, channelId = event.channel, channel_type = event.channel_type, team = event.team, event_ts = event.event_ts;
                    logger_1.default.log({
                        level: "info",
                        message: "Slack event if a member join a channel or a private channel is created",
                        are: { user: user, team: team, channelId: channelId },
                    });
                    return [4 /*yield*/, prisma.channel.findUnique({
                            where: {
                                channel_id: channelId,
                            },
                        })];
                case 2:
                    existingChannel = _b.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Search for a channel based on channel id",
                        are: existingChannel,
                    });
                    if (!!existingChannel) return [3 /*break*/, 6];
                    logger_1.default.log({
                        level: "info",
                        message: "If existingChannel is null then a new private channel is created",
                    });
                    return [4 /*yield*/, client.conversations.info({
                            channel: channelId,
                        })];
                case 3:
                    newChannel = _b.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Get new channel detail through conversations.info Slack API endpoint",
                        are: newChannel,
                    });
                    return [4 /*yield*/, prisma.team.findUnique({
                            where: {
                                team_id: team,
                            },
                        })];
                case 4:
                    teamInfo = _b.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Get team info from team table database through team_id",
                        are: teamInfo,
                    });
                    data = {
                        channel_id: newChannel.channel.id,
                        name: newChannel.channel.name,
                        teamId: teamInfo.id,
                    };
                    logger_1.default.log({
                        level: "info",
                        message: "Create new variable called data to store all the information needed for insert new priavte channel to the database with property channel_id, name and team_id",
                        are: data,
                    });
                    return [4 /*yield*/, prisma.channel.create({
                            data: data,
                        })];
                case 5:
                    insertChannel = _b.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Insert new private to the database",
                        are: insertChannel,
                    });
                    return [3 /*break*/, 12];
                case 6:
                    logger_1.default.log({
                        level: "info",
                        message: "If existing channel does exist then enter else condition",
                    });
                    return [4 /*yield*/, client.users.info({
                            user: user,
                        })];
                case 7:
                    userInfo = (_b.sent()).user;
                    logger_1.default.log({
                        level: "info",
                        message: "Get information from the user that just join the channel by hitting users.info Slack API endpoint",
                        are: userInfo,
                    });
                    email = userInfo.profile.email;
                    return [4 /*yield*/, prisma.team.findFirst({
                            where: {
                                team_id: team,
                            },
                            include: {
                                user: true,
                            },
                        })];
                case 8:
                    teamDB = _b.sent();
                    userDB = teamDB.user;
                    logger_1.default.log({
                        level: "info",
                        message: "Get workspace owner from database through team id and include user",
                        are: userDB,
                    });
                    if (!userDB.refresh_token) return [3 /*break*/, 12];
                    logger_1.default.log({
                        level: "info",
                        message: "Check if the owner of the workspace already have the refresh token to indicate that the owner have already logged in to Slack Drive",
                    });
                    body = {
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: userDB.refresh_token,
                        grant_type: "refresh_token",
                    };
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleOAuth(), "/v4/token"),
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            data: body,
                        })];
                case 9:
                    response = _b.sent();
                    access_token = response.data.access_token;
                    logger_1.default.log({
                        level: "info",
                        message: "Get new access token from google oauth with owner workspace refresh token that stored in the database",
                        are: access_token,
                    });
                    return [4 /*yield*/, prisma.channel.findUnique({
                            where: {
                                channel_id: channelId,
                            },
                        })];
                case 10:
                    channel = _b.sent();
                    folder_id = channel.folder_id, drive_permission = channel.drive_permission;
                    logger_1.default.log({
                        level: "info",
                        message: "Find channel from the database with channel_id to get the folder_id that connected to that channel and user permission as a reader or writer",
                        are: { folder_id: folder_id, drive_permission: drive_permission },
                    });
                    if (!folder_id) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(folder_id, "/permissions"),
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                            data: {
                                role: drive_permission,
                                type: "user",
                                emailAddress: email,
                            },
                        })];
                case 11:
                    permission = _b.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Give drive access to the new user that join the channel",
                        are: permission.data,
                    });
                    _b.label = 12;
                case 12: return [4 /*yield*/, prisma.$disconnect()];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 14:
                    error_3 = _b.sent();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 15:
                    _b.sent();
                    logger_1.default.log({
                        level: "error",
                        message: "Error on app event member_joined_channel",
                        are: error_3,
                    });
                    console.log(error_3.response.data);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
});
app.event("member_left_channel", function (_a) {
    var event = _a.event, client = _a.client, logger = _a.logger;
    return __awaiter(void 0, void 0, void 0, function () {
        var channel, team, user_1, channelDB, teamDB, userDB, members, body, response, access_token, getPermission, _b, permissionIds, permissions, filterUser_1, filterPermission, deletePermission, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 10, , 12]);
                    return [4 /*yield*/, prisma.$connect()];
                case 1:
                    _c.sent();
                    channel = event.channel, team = event.team, user_1 = event.user;
                    logger_1.default.log({
                        level: "info",
                        message: "Slack Event for member left channel",
                        are: { channel: channel, team: team, user: user_1 },
                    });
                    return [4 /*yield*/, prisma.channel.findUnique({
                            where: {
                                channel_id: channel,
                            },
                            include: {
                                team: true,
                            },
                        })];
                case 2:
                    channelDB = _c.sent();
                    teamDB = channelDB.team;
                    logger_1.default.log({
                        level: "info",
                        message: "Get team from database through find channel by channel_id",
                        are: teamDB,
                    });
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: {
                                id: teamDB.userId,
                            },
                        })];
                case 3:
                    userDB = _c.sent();
                    logger_1.default.log({
                        level: "info",
                        message: "Get the owner of the workspace with user id",
                        are: userDB,
                    });
                    if (!(channelDB === null || channelDB === void 0 ? void 0 : channelDB.drive_link)) return [3 /*break*/, 8];
                    logger_1.default.log({
                        level: "info",
                        message: "If a channel have a drive_link value then enter a condition",
                    });
                    return [4 /*yield*/, client.users.list({
                            team_id: channel,
                        })];
                case 4:
                    members = (_c.sent()).members;
                    logger_1.default.log({
                        level: "info",
                        message: "Get all members from the channel that the user left",
                        are: members,
                    });
                    body = {
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: userDB.refresh_token,
                        grant_type: "refresh_token",
                    };
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleOAuth(), "/v4/token"),
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            data: body,
                        })];
                case 5:
                    response = _c.sent();
                    access_token = response.data.access_token;
                    logger_1.default.log({
                        level: "info",
                        message: "Get new access_token from the owner of the workspace refresh_token",
                        are: access_token,
                    });
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(channelDB.folder_id, "?fields=*"),
                            method: "get",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                case 6:
                    getPermission = _c.sent();
                    _b = getPermission.data, permissionIds = _b.permissionIds, permissions = _b.permissions;
                    logger_1.default.log({
                        level: "info",
                        message: "Get all user permission from the Drive Folder that connected to the channel",
                        are: { permissionIds: permissionIds, permissions: permissions },
                    });
                    filterUser_1 = members === null || members === void 0 ? void 0 : members.filter(function (member) {
                        return member.id === user_1;
                    });
                    logger_1.default.log({
                        level: "info",
                        message: "Filter all the members to determine which user left the channel",
                        are: filterUser_1,
                    });
                    filterPermission = permissions.filter(function (permission) {
                        return filterUser_1[0].profile.email === permission.emailAddress;
                    });
                    logger_1.default.log({
                        level: "info",
                        message: "Filter list of user permissions to access the drive folder with the user who left the channel",
                        are: filterPermission,
                    });
                    if (!(filterPermission.length && filterPermission[0].role !== "owner")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(channelDB.folder_id, "/permissions/").concat(filterPermission[0].id),
                            method: "DELETE",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                case 7:
                    deletePermission = _c.sent();
                    logger_1.default.info({
                        level: "info",
                        message: "Revoke the user permission to access the drive folder for the user who left the channel",
                        are: deletePermission.data,
                    });
                    _c.label = 8;
                case 8: return [4 /*yield*/, prisma.$disconnect()];
                case 9:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 10:
                    error_4 = _c.sent();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 11:
                    _c.sent();
                    logger_1.default.log({
                        level: "error",
                        message: "Error on app event member_left_channel",
                        are: error_4,
                    });
                    console.log(error_4);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
});
