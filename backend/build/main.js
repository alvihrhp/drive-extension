"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Express */
var express_1 = __importDefault(require("express"));
/** Cors */
var cors_1 = __importDefault(require("cors"));
/** Router */
var routes_1 = __importDefault(require("./routes"));
/** Slack Event */
var events_1 = require("./events");
/** Path */
var path_1 = __importDefault(require("path"));
require("dotenv").config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 8000;
app.use(events_1.receiver.router);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.default);
// Render React through express
app.use(express_1.default.static(path_1.default.join(__dirname, "../..", "build")));
app.use(express_1.default.static("public"));
app.use(function (req, res, next) {
    res.sendFile(path_1.default.join(__dirname, "../..", "build", "index.html"));
});
app.listen(PORT, function () {
    console.log("Server is litening on PORT = ".concat(PORT));
});
