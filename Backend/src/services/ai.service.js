const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number in the preparation plan, starting from 1"),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          ),
        tasks: z
          .array(z.string())
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
          ),
      }),
    )
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

const geminiResponseSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
    },

    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },

    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          intention: { type: "string" },
          answer: { type: "string" },
        },
        required: ["question", "intention", "answer"],
      },
    },

    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: { type: "string" },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
          },
        },
        required: ["skill", "severity"],
      },
    },

    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },

    title: {
      type: "string",
    },
  },

  required: [
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
    "title",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate a complete interview report based on the candidate's resume, self-description, and job description.

You MUST return:
- matchScore
- at least 8 technicalQuestions
- at least 5 behavioralQuestions
- all relevant skillGaps
- a 7-day preparationPlan
- title

DO NOT return empty arrays.

For technicalQuestions and behavioralQuestions, each item must contain:
- question
- intention
- answer

For skillGaps, identify missing or weak skills based on the job description.

For preparationPlan, provide one entry for each day from 1 to 7.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema,
    },
  });
  const result = interviewReportSchema.parse(JSON.parse(response.text));
  console.log("GEMINI RESULT:", result);
  return result;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
     args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    console.log("PDF size:", pdfBuffer.length);
    console.log("PDF header:", pdfBuffer.subarray(0, 5).toString());

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
      ),
  });
  const prompt = `
Generate a high-quality, professional, ATS-friendly SINGLE-PAGE resume for the candidate using the following information.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}


========================
PRIMARY OBJECTIVE
========================

Create a resume that maximizes the candidate's chances of getting an interview for the target job.

The resume MUST fit on exactly ONE A4 page when rendered to PDF using Puppeteer.

This is a strict requirement.

Do NOT generate a 2-page resume.

Do NOT solve the page-length problem by simply making the font extremely small or making the resume difficult to read.

Instead, intelligently prioritize, rewrite, combine, and condense information while preserving the most valuable content.


========================
CONTENT PRIORITIZATION
========================

Prioritize information according to its relevance to the target job description.

Give the highest priority to:

1. Relevant professional experience
2. Relevant technical skills
3. Strong measurable achievements
4. Relevant projects
5. Education
6. Leadership, achievements, certifications, or other relevant information

Remove or shorten information that does not materially improve the candidate's chances of getting an interview.

Do NOT include:
- Generic career objectives
- Unnecessary personal information
- Long paragraphs
- Repetitive statements
- Generic soft skills unless specifically relevant
- Redundant descriptions of technologies
- Irrelevant experience
- Excessive explanations

Do not invent, exaggerate, or fabricate any experience, skills, achievements, metrics, education, companies, dates, or technologies.

Only use information supported by the provided candidate information.


========================
CONTENT QUALITY
========================

The resume should:

- Be tailored specifically to the target job description.
- Highlight the candidate's strongest and most relevant experience.
- Naturally incorporate important keywords from the job description where truthful and appropriate.
- Sound like it was written by an experienced human resume writer.
- NOT sound AI-generated.
- Use concise, strong, action-oriented language.
- Prefer measurable achievements whenever they are available.
- Convert lengthy descriptions into concise, high-impact bullet points.
- Avoid repeating the same information in multiple sections.
- Focus on impact rather than responsibilities.


========================
SINGLE-PAGE REQUIREMENT
========================

The final resume MUST fit on exactly ONE A4 page.

Use the available page space efficiently.

Use compact but highly readable formatting.

Recommended typography:

- Professional sans-serif font such as Arial, Helvetica, or similar.
- Body font approximately 9.5–10.5px.
- Section headings approximately 11–13px.
- Candidate name approximately 18–22px.
- Line-height approximately 1.1–1.25.
- Small but readable spacing between sections.
- Avoid excessive whitespace.
- Keep bullet points concise.

Do not use excessively large headings, large vertical gaps, oversized margins, or decorative elements that waste page space.

If the content is too long, reduce content by prioritization and concise rewriting BEFORE significantly reducing font size.

The resume should remain comfortable to read.


========================
RESUME STRUCTURE
========================

Use a clean professional structure similar to:

HEADER
- Candidate name
- Location
- Phone
- Email
- LinkedIn
- GitHub / Portfolio when available

SUMMARY
- 2–3 concise lines
- Tailored to the target role

TECHNICAL SKILLS
- Group related skills efficiently
- Avoid unnecessary repetition

EXPERIENCE
- Most relevant experience first
- Use concise bullet points
- Prefer 2–4 high-impact bullets per role
- Prioritize measurable achievements

PROJECTS
- Include only the most relevant projects
- Prefer 1–2 highly relevant projects
- Use concise bullets

EDUCATION
- Degree
- Institution
- Dates
- Relevant information only

ACHIEVEMENTS / LEADERSHIP / CERTIFICATIONS
- Include only if they add meaningful value for the target role


========================
ATS REQUIREMENTS
========================

The resume MUST be ATS friendly.

Use:

- Standard section headings
- Plain text content
- Standard readable fonts
- Simple one-column layout
- Normal HTML text elements
- Proper semantic structure
- Standard bullet points
- Clearly identifiable sections

Avoid:

- Tables for primary resume layout
- Multi-column layouts
- Text embedded inside images
- Icons replacing text
- Graphics
- Skill bars
- Progress bars
- Decorative charts
- Excessive colors
- Complex positioning
- Important information hidden using CSS
- Headers/footers containing critical information

The resume should remain easily parsable by ATS systems.


========================
VISUAL DESIGN
========================

The design should be:

- Simple
- Professional
- Modern
- Clean
- Elegant
- ATS friendly

You may use a subtle accent color for section headings or separators, but keep the design professional and restrained.

Do not use heavy backgrounds, excessive colors, large graphical elements, or decorative designs.

The resume should look like a strong professional resume, not an AI-generated template.


========================
HTML REQUIREMENTS
========================

Return a JSON object with exactly one field:

{
  "html": "..."
}

The html field must contain the complete HTML document that can be directly rendered by Puppeteer.

The HTML should include:

- <!DOCTYPE html>
- <html>
- <head>
- <meta charset="UTF-8">
- Appropriate CSS
- <body>

Use CSS designed specifically for an A4 single-page resume.

Include:

@page {
    size: A4;
    margin: 10mm;
}

Use a single-column layout.

Do not use external resources that may fail to load during Puppeteer rendering.

Do not use external images.

The HTML must be self-contained.

Make sure all important content is visible in the generated PDF.


========================
FINAL QUALITY CHECK
========================

Before returning the HTML, internally verify that:

1. The resume is tailored to the target job.
2. The most relevant skills and experience are emphasized.
3. Important achievements are preserved.
4. There is no fabricated information.
5. There is no unnecessary repetition.
6. The resume is ATS friendly.
7. The resume is concise.
8. The resume is visually professional.
9. The resume is designed to fit on ONE A4 page.
10. The resume remains readable at the specified font sizes.

If there is too much content, reduce low-value content and shorten bullet points rather than creating a second page.

Return ONLY the JSON object with the "html" field.
`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });
  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
