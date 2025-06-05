import { Request, Response } from "express";
import { writeFile, readFile } from "fs/promises";
import { getLatestTaskId, updateCurrentTaskId } from "../utils/task.utils";
import path, { parse } from "path";
import { APIResponse } from "../types/APIResponse";

const TASK_FILE = path.join(__dirname, "../data/tasks.json");

export const createTaskController = async (req: Request, res: Response) => {
  const { title } = req.body;

  const current_id = await getLatestTaskId();
  const newTask = {
    id: current_id,
    title,
    completed: req.body?.completed || false,
  };
  let fileData;
  let parsedFileData: any[] = [];

  try {
    fileData = await readFile(TASK_FILE, "utf-8");
    parsedFileData = JSON.parse(fileData);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await writeFile(TASK_FILE, JSON.stringify([], null, 2));
    }
    parsedFileData = [];
  }
  parsedFileData.push(newTask);
  await writeFile(TASK_FILE, JSON.stringify(parsedFileData, null, 2));
  await updateCurrentTaskId(current_id + 1);

  const taskResponse: APIResponse = {
    status: "success",
    message: "Task created successfully",
    data: {
      task: newTask,
    },
  };
  res.status(201).json(taskResponse);
  return;
};

export const getTasksController = async (req: Request, res: Response) => {
  try {
    const taskData = await readFile(TASK_FILE, "utf-8");
    const taskResponse: APIResponse = {
      status: "success",
      result: JSON.parse(taskData).length,
      message: "Tasks retrieved successfully",
      data: {
        tasks: JSON.parse(taskData),
      },
    };
    res.status(200).json(taskResponse);
    return;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const noTaskError: APIResponse = {
        status: "success",
        data: [],
      };
      res.status(404).json(noTaskError);
      return;
    }

    sendInternalServerError(res, error);
    return;
  }
};

export const updateTaskStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tasks = await readFile(TASK_FILE, "utf-8");
    const parsedTasks = JSON.parse(tasks);

    const taskIndex = parsedTasks.findIndex((task: any) => task.id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error("NOT_FOUND");
    }

    parsedTasks[taskIndex].completed = !parsedTasks[taskIndex].completed;
    await writeFile(TASK_FILE, JSON.stringify(parsedTasks, null, 2));

    const taskResponse: APIResponse = {
      status: "success",
      message: "Task status updated successfully",
      data: {
        task: parsedTasks[taskIndex],
      },
    };
    res.status(200).json(taskResponse);
    return;
  } catch (error: any) {
    if (error.code === "ENOENT" || error.message === "NOT_FOUND") {
      const noTaskError: APIResponse = {
        status: "error",
        message: "Task not found",
      };
      res.status(404).json(noTaskError);
      return;
    }

    sendInternalServerError(res, error);
    return;
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tasks = await readFile(TASK_FILE, "utf-8");
    const parsedTasks: any[] = JSON.parse(tasks);

    const deletedTask = parsedTasks.find((task: any) => task.id === parseInt(id));
    if (!deletedTask) {
      throw new Error("NOT_FOUND");
    }

    const newTasks = parsedTasks.filter((task: any) => task.id !== parseInt(id));

    await writeFile(TASK_FILE, JSON.stringify(newTasks, null, 2));

    const taskResponse: APIResponse = {
      status: "success",
      message: "Task deleted successfully",
      data: {
        task: deletedTask,
      },
    };
    res.status(200).json(taskResponse);
    return;
  } catch (error: any) {
    if (error.code === "ENOENT" || error.message === "NOT_FOUND") {
      const noTaskError: APIResponse = {
        status: "error",
        message: "Task not found",
      };
      res.status(404).json(noTaskError);
      return;
    }

    sendInternalServerError(res, error);
    return;
  }
};

const sendInternalServerError = (res: Response, error: any) => {
  const internalServerError: APIResponse = {
    status: "error",
    message: "Internal Server Error",
  };
  res.status(500).json(internalServerError);
};
