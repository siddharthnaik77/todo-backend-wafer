import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const useDb = process.env.USE_DB === "true";

let sequelize: Sequelize | null = null;

if (useDb) {
  sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
      host: process.env.DB_HOST!,
      dialect: "mysql",
    }
  );
}

export default sequelize;
