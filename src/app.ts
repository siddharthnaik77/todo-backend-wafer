import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";

const app = express();

// CORS middleware - allow requests from frontend
app.use(
  cors({
    origin: [
      "https://todo-frontend-wafer.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
