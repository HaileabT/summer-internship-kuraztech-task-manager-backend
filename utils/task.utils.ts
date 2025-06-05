import { mkdir } from "fs";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const TASK_ID_FILE = path.join(__dirname, "../data/current_task.json");

export const getLatestTaskId = async () => {
  let fileData;
  let parsedFileData;
  try {
    fileData = await readFile(TASK_ID_FILE, "utf-8");
    parsedFileData = JSON.parse(fileData);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const dir = await readdir(path.join(__dirname, "../data")).catch(() =>
        mkdir(path.join(__dirname, "../data"), () => {})
      );
      await writeFile(TASK_ID_FILE, JSON.stringify({ current_id: 0 }, null, 2));

      await writeFile(TASK_ID_FILE, JSON.stringify({ current_id: 0 }, null, 2));
    }
    parsedFileData = { current_id: 0 };
  }
  const { current_id } = parsedFileData;
  return current_id;
};

export const updateCurrentTaskId = async (newId: number) => {
  const fileData = await readFile(TASK_ID_FILE, "utf-8");
  const data = JSON.parse(fileData);
  data.current_id = newId;
  await writeFile(TASK_ID_FILE, JSON.stringify(data, null, 2));
};
