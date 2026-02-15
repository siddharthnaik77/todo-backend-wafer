// In-memory storage for Vercel serverless environment
// Note: Data will be reset on each deployment/function restart

export interface FileTask {
  id: number;
  name: string;
  description: string;
  status: string;
}

// Simple in-memory store
let tasksStore: FileTask[] = [];
let nextId = 1;

// Initialize with sample data
if (tasksStore.length === 0) {
  tasksStore = [
    { id: 1, name: "Sample Task", description: "This is a sample task", status: "Incomplete" },
  ];
  nextId = 2;
}

export async function readTasks(): Promise<FileTask[]> {
  return Promise.resolve([...tasksStore]);
}

export async function writeTasks(tasks: FileTask[]): Promise<void> {
  tasksStore = tasks;
  return Promise.resolve();
}

export async function appendTask(task: Omit<FileTask, "id">): Promise<FileTask> {
  const newTask: FileTask = { id: nextId++, ...task };
  tasksStore.push(newTask);
  return Promise.resolve(newTask);
}

export async function updateTaskFile(id: number, data: Partial<FileTask>): Promise<boolean> {
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx === -1) return Promise.resolve(false);
  tasksStore[idx] = { ...tasksStore[idx], ...data };
  return Promise.resolve(true);
}

export async function deleteTaskFile(id: number): Promise<boolean> {
  const idx = tasksStore.findIndex((t) => t.id === id);
  if (idx === -1) return Promise.resolve(false);
  tasksStore.splice(idx, 1);
  return Promise.resolve(true);
}
