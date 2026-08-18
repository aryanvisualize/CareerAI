const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewQuestionSchema = z.object({
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
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(interviewQuestionSchema)
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(interviewQuestionSchema)
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
    matchScore: { type: "number" },
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
    title: { type: "string" },
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

const stringField = z.string().trim().optional().default("");
const stringList = z.array(z.string().trim()).optional().default([]);

const resumeDataSchema = z.object({
  name: stringField,
  location: stringField,
  phone: stringField,
  email: stringField,
  linkedin: stringField,
  github: stringField,
  portfolio: stringField,
  summary: stringField,
  skills: z
    .array(
      z.object({
        category: stringField,
        items: stringList,
      }),
    )
    .optional()
    .default([]),
  experience: z
    .array(
      z.object({
        company: stringField,
        role: stringField,
        location: stringField,
        startDate: stringField,
        endDate: stringField,
        bullets: stringList,
      }),
    )
    .optional()
    .default([]),
  projects: z
    .array(
      z.object({
        name: stringField,
        technologies: stringList,
        bullets: stringList,
      }),
    )
    .optional()
    .default([]),
  education: z
    .array(
      z.object({
        degree: stringField,
        institution: stringField,
        location: stringField,
        date: stringField,
        details: stringField,
      }),
    )
    .optional()
    .default([]),
  certifications: stringList,
  achievements: stringList,
});

const resumeResponseSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    location: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    linkedin: { type: "string" },
    github: { type: "string" },
    portfolio: { type: "string" },
    summary: { type: "string" },
    skills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["category", "items"],
      },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: [
          "company",
          "role",
          "location",
          "startDate",
          "endDate",
          "bullets",
        ],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          technologies: { type: "array", items: { type: "string" } },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["name", "technologies", "bullets"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          location: { type: "string" },
          date: { type: "string" },
          details: { type: "string" },
        },
        required: ["degree", "institution", "location", "date", "details"],
      },
    },
    certifications: { type: "array", items: { type: "string" } },
    achievements: { type: "array", items: { type: "string" } },
  },
  required: [
    "name",
    "location",
    "phone",
    "email",
    "linkedin",
    "github",
    "portfolio",
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
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

async function generateStructuredResume({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate a high-quality, professional, ATS-friendly SINGLE-PAGE resume for the candidate using only structured JSON content.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

PRIMARY OBJECTIVE

Create a resume that maximizes the candidate's chances of getting an interview for the target job.

The content MUST be concise enough to fit on exactly one A4 page when rendered by a compact PDF resume template.

Prioritize:
- relevant professional experience
- relevant technical skills
- measurable achievements
- relevant projects
- education
- certifications or achievements only when meaningful for the target role

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

CONTENT QUALITY

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

SINGLE-PAGE CONTENT LIMITS

Keep the response compact:
- summary: 1 to 2 concise sentences
- experience: maximum 3 roles
- experience bullets: 2 to 4 bullets per role
- projects: maximum 2 projects
- project bullets: 1 to 3 bullets per project
- skills: group related skills and avoid repetition
- certifications and achievements: include only high-value items

Do not use placeholder values. If a field is unknown or unsupported by the input, return an empty string or an empty array.

Do NOT generate HTML, CSS, Markdown, PDF instructions, browser instructions, or browser-specific text.

FINAL QUALITY CHECK

Before returning the JSON, internally verify that:
1. The resume is tailored to the target job.
2. The most relevant skills and experience are emphasized.
3. Important achievements are preserved.
4. There is no fabricated information.
5. There is no unnecessary repetition.
6. The resume is ATS friendly.
7. The resume is concise.
8. The content is professional.
9. The resume content is concise enough for ONE A4 page.
10. The resume uses only facts supported by the inputs.

If there is too much content, reduce low-value content and shorten bullet points rather than creating a second page.

Return ONLY a JSON object matching the response schema.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumeResponseSchema,
    },
  });

  return resumeDataSchema.parse(JSON.parse(response.text));
}

module.exports = { generateInterviewReport, generateStructuredResume };
