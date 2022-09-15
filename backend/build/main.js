"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/** Sentry */
var Sentry = __importStar(require("@sentry/node"));
var Tracing = __importStar(require("@sentry/tracing"));
/** Slack Event */
var events_1 = require("./events");
/** Path */
var path_1 = __importDefault(require("path"));
require("dotenv").config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 8000;
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app: app }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(events_1.receiver.router);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.default);
app.use(Sentry.Handlers.errorHandler({
    shouldHandleError: function (error) {
        // Capture all 404 and 500 errors
        if (error.status === 404 || error.status === 500) {
            return true;
        }
        return false;
    },
}));
// Render React through express
app.use(express_1.default.static(path_1.default.join(__dirname, "../..", "build")));
app.use(express_1.default.static("public"));
app.use(function (req, res, next) {
    res.sendFile(path_1.default.join(__dirname, "../..", "build", "index.html"));
});
app.listen(PORT, function () {
    console.log("Server is litening on PORT = ".concat(PORT));
});
