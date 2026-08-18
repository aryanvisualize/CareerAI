const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://careerai-frontend-4cnt.onrender.com",
];

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
        status: "ok"
    });
});

module.exports = app;
