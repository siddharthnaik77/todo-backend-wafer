import express from "express";
const cors = require("cors");
import taskRoutes from "./routes/taskRoutes";

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: [
    "https://todo-frontend-wafer.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/tasks", taskRoutes);


app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
