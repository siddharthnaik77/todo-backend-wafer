import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Task extends Model {
  public id!: number;
  public name!: string;
  public status!: string;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Complete", "Incomplete"),
      defaultValue: "Incomplete"
    }
  },
  {
    sequelize,
    tableName: "tasks"
  }
);

export default Task;
