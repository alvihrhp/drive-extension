/** Express */
import express, { Express } from "express";
/** Debugger */
import winston from "winston";
/** Cors */
import cors from "cors";
/** Router */
import router from "./routes";
/** Middleware */
import errorHandler from "./middleware/errorHandler";
/** Slack Event */
import { receiver as appSlack } from "./events";
/** Path */
import path from "path";

require("dotenv").config();

const app: Express = express();

const PORT = process.env.PORT || 8000;

app.use(appSlack.router);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(router);

// Render React through express
app.use(express.static(path.join(__dirname, "../..", "build")));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../..", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is litening on PORT = ${PORT}`);
});
