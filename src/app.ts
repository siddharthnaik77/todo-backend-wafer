import express from "express";
const cors = require("cors");
import taskRoutes from "./routes/taskRoutes";
import sequelize from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

sequelize.sync({alter:true}).then(() => {
  console.log("Database synced!");
});

export default app;
