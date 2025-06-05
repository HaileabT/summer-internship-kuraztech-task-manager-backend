import { Router } from "express";
import {
  createTaskController,
  deleteTaskController,
  getTasksController,
  updateTaskStatusController,
} from "../controllers/tasks.controllers";

const tasksRouter = Router();

tasksRouter.route("/").get(getTasksController).post(createTaskController);
tasksRouter.route("/:id").put(updateTaskStatusController).delete(deleteTaskController);

export { tasksRouter };
