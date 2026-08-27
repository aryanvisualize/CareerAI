const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.FRONTEND_URLS
  .split(",")
  .map(origin => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        exposedHeaders: ["Content-Disposition", "Content-Length"],
    })
);

// required all the routes here
const authRouter = require("./routes/auth.routes.js");
const interviewRouter = require("./routes/interview.routes.js");

// using all the routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        env: process.env.NODE_ENV || "development",
    });
});

// Global error handler — catches unhandled errors from async route handlers
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message)
    // Never expose stack traces in production
    const isDev = process.env.NODE_ENV !== "production"
    res.status(err.status || 500).json({
        message: isDev ? err.message : "Internal server error",
    })
})

console.log(`[app] NODE_ENV: ${process.env.NODE_ENV || "development"}`)
console.log(`[app] Allowed CORS origins: ${allowedOrigins.join(", ")}`)

module.exports = app;
