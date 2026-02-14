import { Request, Response } from "express";
import Task from "../models/task";
import { Op } from "sequelize";


export const getTasks = async (req: Request, res: Response) => {
  try {
    const { name, status } = req.query; 

    const whereClause: any = {};

    // query params ?name=abc&status=Complete this use in filter query
    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` }; 
    }

    if (status && status !== "All") {
      whereClause.status = status; 
    }

    const tasks = await Task.findAll({ where: whereClause,order: [["id", "DESC"]] });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTask = async (req: Request, res: Response) => {

  const { name,description, status } = req.body;
  const task = await Task.create({ name, description, status });
  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status } = req.body;
  await Task.update({ name, status }, { where: { id } });
  res.json({ message: "Task updated" });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Task.destroy({ where: { id } });
  res.json({ message: "Task deleted" });
};
