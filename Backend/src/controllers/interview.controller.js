const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewReport.model.js");


async function generateInterviewReportController(req, res) {
    const resumeFile = req.file
    const resumeContent = await pdfParse(resumeFile.buffer)
    const { selfDescription, jobDescription } = req.body
    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription  
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}

module.exports = {generateInterviewReportController}