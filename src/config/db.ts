import { Sequelize } from "sequelize"
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME || "todo_db",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  }
);

export default sequelize;
