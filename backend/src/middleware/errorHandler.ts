import { Request, Response, NextFunction } from "express";

export default function (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
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
