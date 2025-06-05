import express, { Express, static as staticServe } from "express";
import path from "path";
import { tasksRouter } from "./routes/tasks.routes";

const api: Express = express();
api.use(express.json());

api.use("/api/tasks", tasksRouter);
api.use("/", staticServe(path.join(__dirname, "public")));

export { api };
