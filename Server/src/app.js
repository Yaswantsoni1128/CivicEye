import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import complainRoutes from "./routes/complain.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import otpRoutes from "./routes/otp.routes.js";
import workerRoutes from "./routes/worker.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({
  extended: true,
  limit: "16kb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "16kb"
}));


app.use(cors({
  origin: process.env.CORS_ORIGIN || "https://civic-59dqhror1-yaswants-projects.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))

app.use(express.static("public"));

app.get("/", (req, res)=>{
  res.send("main");
});

app.use("/api/auth", authRoutes);
app.use("/api/complain", complainRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/worker", workerRoutes);
export {app}

