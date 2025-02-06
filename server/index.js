import express from "express";
import dotenv from "dotenv";
dotenv.config();
// console.log("DB_URI:", process.env.DB_URI);  // Log DB URI
// console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);  // Log GitHub Client ID
// console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET);  // Log GitHub Client Secret
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import "./passport/github.auth.js";
import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";
import repoRoutes from "./routes/repo.route.js";
import searchRoutes from "./routes/search.route.js";
import connectMongoDB from "./db/connectMongoDB.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  credentials: true
}));


app.use(session({ 
  secret: process.env.SESSION_SECRET || "keyboard cat", 
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/search", searchRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  connectMongoDB();
});