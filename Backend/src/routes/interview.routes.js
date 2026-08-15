const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const interviewController = require("../controllers/interview.controller.js");
const upload = require("../middleware/file.middleware.js");

const interviewRouter = express.Router();
/**
 * @route POST /api/interview
 * @description Generate an interview report for a candidate based on their resume, self description and job description
 * @access Private
 */

interviewRouter.post("/", authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController);


module.exports = interviewRouter;