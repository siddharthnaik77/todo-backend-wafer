import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const app = express();

// CORS middleware
const allowedOrigins = [
  "https://todo-frontend-wafer.vercel.app",
  "http://localhost:3000",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests for all routes
app.options("*", cors({ origin: allowedOrigins }));

app.use(express.json());

// File storage setup
const STORAGE_FILE = path.join(process.cwd(), "data", "tasks.json");

function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadTasks() {
  ensureDataDir();
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(STORAGE_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

function saveTasks(tasks: any[]) {
  ensureDataDir();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(tasks, null, 2));
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  try {
    const tasks = loadTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Get task by ID
app.get("/api/tasks/:id", (req, res) => {
  try {
    const tasks = loadTasks();
    const task = tasks.find((t: any) => t.id === req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error fetching task" });
  }
});

// Create task
app.post("/api/tasks", (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }
    const tasks = loadTasks();
    const newTask = {
      id: uuidv4(),
      title,
      description: description || "",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});

// Update task
app.put("/api/tasks/:id", (req, res) => {
  try {
    const tasks = loadTasks();
    const taskIndex = tasks.findIndex((t: any) => t.id === req.params.id);
    if (taskIndex === -1) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveTasks(tasks);
    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => { 
  try {
    const tasks = loadTasks();
    const filteredTasks = tasks.filter((t: any) => t.id !== req.params.id);
    if (filteredTasks.length === tasks.length) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    saveTasks(filteredTasks);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;