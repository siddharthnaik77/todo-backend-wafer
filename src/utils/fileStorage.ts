import { promises as fs } from "fs";
import path from "path";

export interface FileTask {
  id: number;
  name: string;
  description: string;
  status: string;
}

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "tasks.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(dataFile);
    } catch {
      await fs.writeFile(dataFile, JSON.stringify([]), "utf8");
    }
  } catch (err) {
    throw err;
  }
}

export async function readTasks(): Promise<FileTask[]> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as FileTask[];
}

export async function writeTasks(tasks: FileTask[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(tasks, null, 2), "utf8");
}

export async function appendTask(task: Omit<FileTask, "id">): Promise<FileTask> {
  const tasks = await readTasks();
  const maxId = tasks.reduce((m, t) => Math.max(m, t.id || 0), 0);
  const newTask: FileTask = { id: maxId + 1, ...task };
  tasks.push(newTask);
  await writeTasks(tasks);
  return newTask;
}

export async function updateTaskFile(id: number, data: Partial<FileTask>): Promise<boolean> {
  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks[idx] = { ...tasks[idx], ...data };
  await writeTasks(tasks);
  return true;
}

export async function deleteTaskFile(id: number): Promise<boolean> {
  const tasks = await readTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  await writeTasks(tasks);
  return true;
}
