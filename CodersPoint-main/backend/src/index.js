// import dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import logger from "./logger/index.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// import routes files
import authRoutes from "./routes/auth.route.js";
import problemsRoutes from "./routes/problems.route.js";
import executionRoutes from "./routes/execution.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";

import userRouter from "./routes/user.route.js";
import commentRoutes from "./routes/comment.route.js";
import contestRoutes from "./routes/contest.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

// configure dotenv
dotenv.config({
    path: ".env",
});

const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);

// health check for uptime monitors / platform health checks
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemsRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/contests", contestRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

// serve the built frontend from the same origin/service in production
if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendDist));
    app.use((req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

// Start server
app.listen(port, () => {
    logger.info(`Server is up and running on PORT ${port}`);
});
