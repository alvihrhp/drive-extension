"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseURl = /** @class */ (function () {
    function BaseURl() {
    }
    BaseURl.googleAuth = function () {
        return "https://www.googleapis.com/auth";
    };
    BaseURl.googleDrive = function () {
        return "https://www.googleapis.com/drive/v3/files";
    };
    BaseURl.googleOAuth = function () {
        return "https://www.googleapis.com/oauth2";
    };
    BaseURl.slack = function () {
        return "https://slack.com/api";
    };
    return BaseURl;
}());
exports.default = BaseURl;
