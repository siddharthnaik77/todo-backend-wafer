import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/db";

const useDb = process.env.USE_DB === "true";

export interface TaskAttributes {
  id?: number;
  name: string;
  description: string;
  status: string;
}

export class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public status!: string;
}

// Only define the model if USE_DB is true
if (useDb && sequelize) {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "tasks",
      modelName: "Task",
    }
  );
}
