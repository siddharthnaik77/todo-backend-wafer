import express from "express";
const cors = require("cors");
import taskRoutes from "./routes/taskRoutes";

const app = express();

// Enable CORS for all origins (can be restricted later)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));

// Explicit CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/tasks", taskRoutes);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
