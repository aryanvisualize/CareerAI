const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateStructuredResume } = require("../services/ai.service")
const { generateResumePdf } = require("../services/resume-pdf.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * Classify an error thrown by the Gemini SDK or other upstream services
 * and return an appropriate HTTP status code + safe message.
 */
function classifyUpstreamError(error) {
    const status = error?.status ?? error?.response?.status ?? error?.statusCode

    if (status === 429) {
        return { code: 429, message: "AI service is rate-limited. Please wait a moment and try again." }
    }
    if (status === 404) {
        return { code: 503, message: "AI model is unavailable. Please contact support." }
    }
    if (status === 401 || status === 403) {
        return { code: 503, message: "AI service authentication failed. Please contact support." }
    }
    if (status === 400) {
        return { code: 400, message: "Invalid request sent to AI service." }
    }

    // Check for rate-limit message strings emitted by the SDK
    const msg = error?.message ?? ""
    if (/rate.?limit|quota|too many requests/i.test(msg)) {
        return { code: 429, message: "AI service is rate-limited. Please wait a moment and try again." }
    }

    return { code: 500, message: "An unexpected error occurred. Please try again." }
}


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description is required." })
        }

        if (!req.file && !selfDescription) {
            return res.status(400).json({ message: "Please provide a resume file or a self-description." })
        }

        let resumeText = ""

        if (req.file) {
            try {
                const parsed = await pdfParse(req.file.buffer)
                resumeText = parsed.text || ""
            } catch (parseErr) {
                console.error("PDF parse error:", parseErr.message)
                return res.status(400).json({ message: "Could not parse the uploaded PDF. Please check the file and try again." })
            }
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        })

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })

    } catch (error) {
        console.error("generateInterViewReportController error:", error.message)
        const { code, message } = classifyUpstreamError(error)
        return res.status(code).json({ message })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("getInterviewReportByIdController error:", error.message)
        return res.status(500).json({ message: "Failed to fetch interview report." })
    }
}


/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("getAllInterviewReportsController error:", error.message)
        return res.status(500).json({ message: "Failed to fetch interview reports." })
    }
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        console.log("========== RESUME PDF ==========")
        console.log("METHOD:", req.method)
        console.log("PARAMS:", req.params)

        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        console.log("INTERVIEW REPORT FOUND:", !!interviewReport)

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        console.log("Resume length:", resume?.length)
        console.log("Job description length:", jobDescription?.length)
        console.log("Self description length:", selfDescription?.length)
        console.log("Generating structured resume...")

        const resumeData = await generateStructuredResume({
            resume,
            jobDescription,
            selfDescription
        })

        console.log("Resume JSON generated successfully")
        console.log("Generating PDF with PDFKit...")

        const pdfBuffer = await generateResumePdf(resumeData)

        if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.subarray(0, 4).toString() !== "%PDF") {
            throw new Error("Generated PDF buffer is invalid.")
        }

        console.log("PDF generated successfully")
        console.log("PDF size:", pdfBuffer.length)
        console.log("================================")

        res.status(200)
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename="resume.pdf"`)
        res.setHeader("Content-Length", pdfBuffer.length)

        return res.send(pdfBuffer)

    } catch (error) {
        console.error("========== RESUME PDF ERROR ==========")
        console.error(error.message)
        console.error(error.stack)
        console.error("======================================")

        const { code, message } = classifyUpstreamError(error)
        return res.status(code).json({
            message,
            code: "RESUME_PDF_GENERATION_FAILED"
        })
    }
}


module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}


