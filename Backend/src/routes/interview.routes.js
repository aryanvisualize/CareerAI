const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const interviewController = require("../controllers/interview.controller.js");
const upload = require("../middlewares/upload.middleware.js");

const interviewRouter = express.Router();
/**
 * @route POST /api/interview
 * @description Generate an interview report for a candidate based on their resume, self description and job description
 * @access Private
 */

interviewRouter.post("/", authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReport);


module.exports = interviewRouter;