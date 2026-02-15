import { Request, Response } from "express";
import Task from "../models/task";
import { Op } from "sequelize";
import {
  readTasks,
  appendTask,
  updateTaskFile,
  deleteTaskFile,
  FileTask,
} from "../utils/fileStorage";

const useDb = process.env.USE_DB === "true";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.query;

    if (useDb) {
      const whereClause: any = {};
      if (name) whereClause.name = { [Op.like]: `%${name}%` };
      if (status && status !== "All") whereClause.status = status;
      const tasks = await Task.findAll({ where: whereClause, order: [["id", "DESC"]] });
      return res.status(200).json(tasks);
    }

    // File-based
    const tasks = await readTasks();
    let filtered = tasks.slice().sort((a, b) => b.id - a.id);
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
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const { name, description, status } = req.body;
    if (useDb) {
      const task = await Task.create({ name, description, status });
      return res.json(task);
    }

    const newTask = await appendTask({ name, description, status: status || "Incomplete" });
    return res.json(newTask);
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status, description } = req.body;
    if (useDb) {
      await Task.update({ name, status, description }, { where: { id } });
      return res.json({ message: "Task updated" });
    }

    const ok = await updateTaskFile(Number(id), { name, status, description });
    if (!ok) return res.status(404).json({ message: "Task not found" });
    return res.json({ message: "Task updated" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (useDb) {
      await Task.destroy({ where: { id } });
      return res.json({ message: "Task deleted" });
    }

    const ok = await deleteTaskFile(Number(id));
    if (!ok) return res.status(404).json({ message: "Task not found" });
    return res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
