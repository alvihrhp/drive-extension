"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(err, req, res, next) {
    switch (err.name) {
        case "BadRequest":
            res.status(400).json({ errors: err.message });
            break;
        case "JsonWebTokenError":
            res.status(400).json({ errors: err.message });
            break;
        case "NotFound":
            res.status(404).json({ errors: err.message });
            break;
        case "NotAuthorized":
            res.status(401).json({ errors: err.message });
            break;
        default:
            res.status(500).json(err);
            break;
    }
}
exports.default = default_1;
