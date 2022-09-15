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
/** Axios */
var axios_1 = __importDefault(require("axios"));
/** Prisma */
var client_1 = require("@prisma/client");
/** Helper */
var helper_1 = require("../helper");
/** Logger */
var logger_1 = __importDefault(require("../logger"));
var prisma = new client_1.PrismaClient();
var DriveController = /** @class */ (function () {
    function DriveController() {
    }
    DriveController.get = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, response, files, folders, filterFolders, i, flag, j, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        return [4 /*yield*/, prisma.$connect()];
                    case 1:
                        _a.sent();
                        token = req.query.token;
                        return [4 /*yield*/, axios_1.default.get("".concat(helper_1.BaseURl.googleDrive(), "?ordeBy=folder&fields=files(id, name, webViewLink, owners, mimeType)&q=mimeType = 'application/vnd.google-apps.folder' and 'root' in parents"), {
                                headers: {
                                    Authorization: "Bearer ".concat(token),
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        files = response.data.files;
                        logger_1.default.log({
                            level: "info",
                            message: "Get list of root Drive folders from Drive API",
                            are: files,
                        });
                        return [4 /*yield*/, prisma.channel.findMany()];
                    case 3:
                        folders = _a.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Find all channels from the database",
                            are: folders,
                        });
                        filterFolders = [];
                        for (i = 0; i < files.length; i++) {
                            flag = false;
                            for (j = 0; j < folders.length; j++) {
                                if (files[i].id === folders[j].folder_id) {
                                    flag = true;
                                }
                            }
                            if (!flag) {
                                filterFolders.push(files[i]);
                            }
                        }
                        logger_1.default.log({
                            level: "info",
                            message: "Filter root folders that already connected to a channel",
                            are: filterFolders,
                        });
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 4:
                        _a.sent();
                        res.status(200).json({
                            message: "Fetch files success",
                            data: filterFolders,
                        });
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 6:
                        _a.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error on method get inside Drive Controller",
                            are: error_1,
                        });
                        console.log(error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DriveController.getSub = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, folder_id, token, response, files, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, folder_id = _a.folder_id, token = _a.token;
                        return [4 /*yield*/, axios_1.default.get("".concat(helper_1.BaseURl.googleDrive(), "?ordeBy=folder&fields=files(id, name, webViewLink, owners, mimeType)&q=mimeType = 'application/vnd.google-apps.folder' and '").concat(folder_id, "' in parents"), {
                                headers: {
                                    Authorization: "Bearer ".concat(token),
                                },
                            })];
                    case 1:
                        response = _b.sent();
                        files = response.data.files;
                        logger_1.default.log({
                            level: "info",
                            message: "Get list of sub folder from a parent folder",
                            are: files,
                        });
                        res.status(200).json({
                            message: "Fetch files success",
                            data: files,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error on method getSub inside Drive Controller",
                            are: error_2,
                        });
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DriveController.connect = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var by, _a, folderId, driveLink_1, driveName, channelName, channelId, ownerEmail, token, permission, description, bookmark, access_token, channels, isFolderConnected, channel, channelInfo, members, membersInfo, i, member, membersIdentity, arrayPermission, i, request, dataPermission, updateChannel, responseListBookmark, listBookmarks, flagFolder, i, addBookmark, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 19, , 21]);
                        return [4 /*yield*/, prisma.$connect()];
                    case 1:
                        _b.sent();
                        by = req.query.by;
                        _a = req.body, folderId = _a.id, driveLink_1 = _a.webViewLink, driveName = _a.name, channelName = _a.channelName, channelId = _a.channelId, ownerEmail = _a.ownerEmail, token = _a.token, permission = _a.permission, description = _a.description, bookmark = _a.bookmark, access_token = _a.access_token;
                        return [4 /*yield*/, prisma.channel.findMany()];
                    case 2:
                        channels = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Find many channels to filter them which channel already connected to a Drive Folder",
                            are: channels,
                        });
                        isFolderConnected = channels.filter(function (channel) {
                            return channel.drive_link === driveLink_1;
                        });
                        logger_1.default.log({
                            level: "info",
                            message: "If a request folder already connected to a another channel then throw an error",
                            are: isFolderConnected,
                        });
                        if (isFolderConnected.length) {
                            throw "Drive folder already connected to another channel";
                        }
                        return [4 /*yield*/, prisma.channel.findUnique({
                                where: {
                                    id: channelId,
                                },
                            })];
                    case 3:
                        channel = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Find channel with a unique channel id",
                            are: channel,
                        });
                        return [4 /*yield*/, axios_1.default.get("".concat(helper_1.BaseURl.slack(), "/conversations.members?channel=").concat(channel.channel_id, "&pretty=1"), {
                                headers: {
                                    Authorization: "Bearer ".concat(access_token),
                                },
                            })];
                    case 4:
                        channelInfo = _b.sent();
                        members = channelInfo.data.members;
                        logger_1.default.log({
                            level: "info",
                            message: "Get list of all members by hitting conversations.members Slack Event API and add URL query to filter the channel",
                            are: members,
                        });
                        membersInfo = [];
                        i = 0;
                        _b.label = 5;
                    case 5:
                        if (!(i < members.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, axios_1.default.get("".concat(helper_1.BaseURl.slack(), "/users.info?user=").concat(members[i], "&pretty=1"), {
                                headers: {
                                    Authorization: "Bearer ".concat(access_token),
                                },
                            })];
                    case 6:
                        member = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Get user detail information by hitting users.info Slack Event API",
                            are: member,
                        });
                        membersInfo.push(member);
                        _b.label = 7;
                    case 7:
                        i++;
                        return [3 /*break*/, 5];
                    case 8:
                        logger_1.default.info({
                            level: "info",
                            message: "Store all the user detail information in a variable called membersInfo",
                            are: membersInfo,
                        });
                        membersIdentity = membersInfo.map(function (member) {
                            var user = member.data.user;
                            return user;
                        });
                        logger_1.default.log({
                            level: "info",
                            message: "Get user property to get members identity by mapping the membersInfo array",
                            are: membersIdentity,
                        });
                        arrayPermission = [];
                        i = 0;
                        _b.label = 9;
                    case 9:
                        if (!(i < membersIdentity.length)) return [3 /*break*/, 13];
                        request = void 0;
                        if (!!ownerEmail.includes(membersIdentity[i].profile.email)) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(folderId, "/permissions"),
                                method: "POST",
                                headers: {
                                    Authorization: "Bearer ".concat(token),
                                },
                                data: {
                                    role: permission,
                                    type: "user",
                                    emailAddress: membersIdentity[i].profile.email,
                                },
                            })];
                    case 10:
                        request = _b.sent();
                        _b.label = 11;
                    case 11:
                        if (request) {
                            logger_1.default.log({
                                level: "info",
                                message: "If a member of the channel is not the owner of the Drive Folder that just connected to a channel then enter a condition",
                            });
                            dataPermission = request.data;
                            arrayPermission.push(dataPermission);
                            logger_1.default.info({
                                level: "info",
                                message: "Store all the new members permission to access the Drive Folder in arrayPerrmission",
                                are: arrayPermission,
                            });
                        }
                        _b.label = 12;
                    case 12:
                        i++;
                        return [3 /*break*/, 9];
                    case 13: return [4 /*yield*/, prisma.channel.update({
                            where: {
                                id: channelId,
                            },
                            data: {
                                drive_name: driveName,
                                drive_link: driveLink_1,
                                folder_id: folderId,
                                drive_permission: permission,
                            },
                        })];
                    case 14:
                        updateChannel = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Update a channel after connect a Drive Folder to a channel",
                            are: updateChannel,
                        });
                        if (!bookmark) return [3 /*break*/, 17];
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/bookmarks.list?channel_id=").concat(channel.channel_id, "&pretty=1"),
                                method: "GET",
                                headers: {
                                    Authorization: "Bearer ".concat(access_token),
                                },
                            })];
                    case 15:
                        responseListBookmark = _b.sent();
                        listBookmarks = responseListBookmark.data.bookmarks;
                        logger_1.default.log({
                            level: "info",
                            message: "Get list of bookmarks that are in the channel",
                            are: listBookmarks,
                        });
                        flagFolder = false;
                        for (i = 0; i < listBookmarks.length; i++) {
                            if (driveLink_1 === listBookmarks[i].link) {
                                flagFolder = true;
                            }
                        }
                        if (!!flagFolder) return [3 /*break*/, 17];
                        logger_1.default.log({
                            level: "info",
                            message: "If the channel bookmarks didn't have the same Drive Folder link then enter a condition",
                            are: flagFolder,
                        });
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/bookmarks.add?channel_id=").concat(channel.channel_id, "&title=Channel%20Files&type=link&link=").concat(driveLink_1, "&pretty=1"),
                                method: "POST",
                                headers: {
                                    Authorization: "Bearer ".concat(access_token),
                                },
                            })];
                    case 16:
                        addBookmark = _b.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Add bookmark to a channel",
                            are: addBookmark.data,
                        });
                        _b.label = 17;
                    case 17: return [4 /*yield*/, prisma.$disconnect()];
                    case 18:
                        _b.sent();
                        res.status(200).json({
                            message: "Update Success",
                            data: updateChannel,
                        });
                        return [3 /*break*/, 21];
                    case 19:
                        error_3 = _b.sent();
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 20:
                        _b.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error on method connect inside Drive Controller",
                            are: error_3,
                        });
                        res.status(400).json({
                            message: "Connect folder failed",
                            error: error_3,
                        });
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    DriveController.disconnect = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_1, id, token, access_token, channel_1, getPermission, _b, permissionIds, permissions, filterPermissons, i, deletePermission, responseListBookmark, listBookmarks, filterBookmark, removeBookmark, disconnectFolder, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 13, , 15]);
                        return [4 /*yield*/, prisma.$connect()];
                    case 1:
                        _c.sent();
                        _a = req.body, name_1 = _a.name, id = _a.id, token = _a.token, access_token = _a.access_token;
                        return [4 /*yield*/, prisma.channel.findUnique({
                                where: {
                                    id: id,
                                },
                            })];
                    case 2:
                        channel_1 = _c.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Find a channel according to parameters channel id",
                            are: channel_1,
                        });
                        if (!(channel_1 === null || channel_1 === void 0 ? void 0 : channel_1.folder_id)) return [3 /*break*/, 10];
                        logger_1.default.log({
                            level: "info",
                            message: "If a channel folder_id column have a value then enter a condition",
                        });
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(channel_1.folder_id, "?fields=*"),
                                method: "get",
                                headers: {
                                    Authorization: "Bearer ".concat(token),
                                },
                            })];
                    case 3:
                        getPermission = _c.sent();
                        _b = getPermission.data, permissionIds = _b.permissionIds, permissions = _b.permissions;
                        logger_1.default.log({
                            level: "info",
                            message: "Get all users Drive folder permission in the channel",
                            are: { permissionIds: permissionIds, permissions: permissions },
                        });
                        filterPermissons = permissions.filter(function (userPermission) {
                            return userPermission.role === "owner";
                        });
                        logger_1.default.log({
                            level: "info",
                            message: "Filter the Drive Folder permission to determine who the owner",
                            are: filterPermissons,
                        });
                        i = 0;
                        _c.label = 4;
                    case 4:
                        if (!(i < permissionIds.length)) return [3 /*break*/, 7];
                        if (!(filterPermissons[0].id !== permissionIds[i])) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.googleDrive(), "/").concat(channel_1.folder_id, "/permissions/").concat(permissionIds[i]),
                                method: "DELETE",
                                headers: {
                                    Authorization: "Bearer ".concat(token),
                                },
                            })];
                    case 5:
                        deletePermission = _c.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Revoke all the user permission to access the Drive Folder",
                            are: deletePermission,
                        });
                        _c.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, (0, axios_1.default)({
                            url: "".concat(helper_1.BaseURl.slack(), "/bookmarks.list?channel_id=").concat(channel_1.channel_id, "&pretty=1"),
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(access_token),
                            },
                        })];
                    case 8:
                        responseListBookmark = _c.sent();
                        listBookmarks = responseListBookmark.data.bookmarks;
                        logger_1.default.log({
                            level: "info",
                            message: "Get all list bookmark in the channel",
                            are: listBookmarks,
                        });
                        filterBookmark = listBookmarks.filter(function (bookmark) {
                            return bookmark.link === channel_1.drive_link;
                        });
                        if (!(filterBookmark.length > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, axios_1.default)({
                                url: "".concat(helper_1.BaseURl.slack(), "/bookmarks.remove?bookmark_id=").concat(filterBookmark[0].id, "&channel_id=").concat(channel_1.channel_id, "&pretty=1"),
                                method: "POST",
                                headers: {
                                    Authorization: "Bearer ".concat(access_token),
                                },
                            })];
                    case 9:
                        removeBookmark = _c.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Remove bookmark from the channel after disconnect the folder from the channel",
                            are: removeBookmark.data,
                        });
                        _c.label = 10;
                    case 10: return [4 /*yield*/, prisma.channel.update({
                            where: {
                                id: id,
                            },
                            data: {
                                drive_link: null,
                                drive_name: null,
                                folder_id: null,
                                drive_permission: null,
                            },
                        })];
                    case 11:
                        disconnectFolder = _c.sent();
                        logger_1.default.log({
                            level: "info",
                            message: "Update the datbase to remove drive_link, drive_name, folder_id, and folder_permission",
                            are: disconnectFolder,
                        });
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 12:
                        _c.sent();
                        res.status(200).json({
                            message: "Drive successfully disconnected",
                            data: disconnectFolder,
                        });
                        return [3 /*break*/, 15];
                    case 13:
                        error_4 = _c.sent();
                        return [4 /*yield*/, prisma.$disconnect()];
                    case 14:
                        _c.sent();
                        logger_1.default.log({
                            level: "error",
                            message: "Error on disconnect function",
                            are: error_4,
                        });
                        console.log(error_4);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return DriveController;
}());
exports.default = DriveController;
