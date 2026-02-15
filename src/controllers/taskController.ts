import { Request, Response } from "express";
import { Task } from "../models/task"; // Only used if USE_DB=true
import { Op } from "sequelize";
import {
  readTasks,
  appendTask,
  updateTaskFile,
  deleteTaskFile,
  FileTask,
} from "../utils/fileStorage";

const useDb = process.env.USE_DB === "true";
console.log("Using DB:",typeof useDb);
/**
 * Get all tasks
 */
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.query;

    if (useDb) {
      // DB mode
      const whereClause: any = {};
      if (name) whereClause.name = { [Op.like]: `%${name}%` };
      if (status && status !== "All") whereClause.status = status;
      const tasks = await Task.findAll({ where: whereClause, order: [["id", "DESC"]] });
      return res.status(200).json(tasks);
    }

    // In-memory mode
    let tasks = await readTasks();
    let filtered = [...tasks]; // clone
    if (name) {
      const n = String(name).toLowerCase();
      filtered = filtered.filter((t) => t.name.toLowerCase().includes(n));
    }
    if (status && status !== "All") {
      filtered = filtered.filter((t) => t.status === status);
    }

    return res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Add a new task
 */
export const addTask = async (req: Request, res: Response) => {
  try {
    const { name, description, status } = req.body;

    if (useDb) {
      const task = await Task.create({ name, description, status });
      return res.status(201).json(task);
    }

    const newTask = await appendTask({
      name,
      description,
      status: status || "Incomplete",
    });
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update a task
 */
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status, description } = req.body;

    if (useDb) {
      const updated = await Task.update(
        { name, status, description },
        { where: { id } }
      );
      if (updated[0] === 0) return res.status(404).json({ message: "Task not found" });
      return res.json({ message: "Task updated" });
    }

    const ok = await updateTaskFile(Number(id), { name, status, description });
    if (!ok) return res.status(404).json({ message: "Task not found" });

    return res.json({ message: "Task updated" });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (useDb) {
      const deleted = await Task.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ message: "Task not found" });
      return res.json({ message: "Task deleted" });
    }

    const ok = await deleteTaskFile(Number(id));
    if (!ok) return res.status(404).json({ message: "Task not found" });

    return res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
