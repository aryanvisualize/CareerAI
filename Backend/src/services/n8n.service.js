
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const REQUEST_TIMEOUT_MS = 5000;

async function sendReportReadyEvent(report) {
    // 1. Retrieve the report owner's email
    const user = await userModel
        .findById(report.user)
        .select("email");

    if (!user || !user.email) {
        throw new Error(
            "Cannot send report-ready event: user or email not found."
        );
    }

    // 2. Retrieve n8n configuration
    const webhookUrl = process.env.N8N_REPORT_READY_WEBHOOK_URL;
    const jwtSecret = process.env.N8N_REPORT_READY_JWT_SECRET;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!webhookUrl || !jwtSecret || !frontendUrl) {
        throw new Error(
            "Missing n8n webhook or frontend configuration."
        );
    }

    // 3. Construct report details
    const reportId = String(report._id);
    const userId = String(user._id);
    const eventId = `report-ready:${reportId}`;

    const baseFrontendUrl = frontendUrl.replace(/\/+$/, "");

    const payload = {
        event: "interview.report.created",
        eventId,
        recipientEmail: user.email,
        userId,
        reportId,
        title: report.title,
        matchScore: report.matchScore,
        reportUrl: `${baseFrontendUrl}/interview/${reportId}`,
    };

    // 4. Generate signed JWT
    const token = jwt.sign(
        {
            iss: "careerai",
            aud: "n8n-report-ready",
            sub: userId,
            jti: eventId,
        },
        jwtSecret,
        {
            algorithm: "HS256",
            expiresIn: "60s",
        }
    );

    // 5. Send event to n8n
    const abortController = new AbortController();

    const timeout = setTimeout(
        () => abortController.abort(),
        REQUEST_TIMEOUT_MS
    );

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            signal: abortController.signal,
        });

        if (!response.ok) {
            throw new Error(
                `n8n webhook returned HTTP ${response.status}.`
            );
        }

        console.log(
            `[n8n] Report-ready event sent successfully: ${reportId}`
        );

    } finally {
        clearTimeout(timeout);
    }
}

module.exports = { sendReportReadyEvent };
