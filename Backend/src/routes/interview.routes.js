const express = require("express")
const authMiddleware = require("../middleware/auth.middleware.js")
const interviewController = require("../controllers/interview.controller.js")
const upload = require("../middleware/file.middleware.js")

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description,resume pdf and job description.
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route PATCH /api/interview/report/:interviewId/pin
 * @description Update the pinned state of an interview report.
 * @access private
 */
interviewRouter.patch("/report/:interviewId/pin", authMiddleware.authUser, interviewController.updateInterviewReportPinController)

/**
 * @route DELETE /api/interview/report/:interviewId
 * @description Delete an interview report owned by the logged in user.
 * @access private
 */
interviewRouter.delete("/report/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewReportController)


/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)



module.exports = interviewRouter
