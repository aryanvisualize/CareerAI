const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateStructuredResume } = require("../services/ai.service")
const { generateResumePdf } = require("../services/resume-pdf.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res) {
    try {
        console.log("========== RESUME PDF ==========");
        console.log("METHOD:", req.method);
        console.log("PARAMS:", req.params);

        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        console.log("INTERVIEW REPORT FOUND:", !!interviewReport);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;

        console.log("Resume length:", resume?.length);
        console.log("Job description length:", jobDescription?.length);
        console.log("Self description length:", selfDescription?.length);

        console.log("Generating structured resume...");

        const resumeData = await generateStructuredResume({
            resume,
            jobDescription,
            selfDescription
        });

        console.log("Resume JSON generated successfully");
        console.log("Generating PDF with PDFKit...");

        const pdfBuffer = await generateResumePdf(resumeData);

        if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.subarray(0, 4).toString() !== "%PDF") {
            throw new Error("Generated PDF buffer is invalid.");
        }

        console.log("PDF generated successfully");
        console.log("PDF size:", pdfBuffer.length);
        console.log("================================");

        res.status(200);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `inline; filename="resume.pdf"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        return res.send(pdfBuffer);

    } catch (error) {
        console.error("========== RESUME PDF ERROR ==========");
        console.error(error.message);
        console.error(error.stack);
        console.error("======================================");

        return res.status(500).json({
            message: "Failed to generate resume PDF. Please try again.",
            code: "RESUME_PDF_GENERATION_FAILED"
        });
    }
}


module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
