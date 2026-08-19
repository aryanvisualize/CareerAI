<div align="center">

# 🚀 CareerAI

### 🧬 Generative AI Project — AI-Powered Job Preparation & Resume Intelligence Platform

[![Generative AI](https://img.shields.io/badge/Generative_AI-FF6F61?style=for-the-badge&logo=openai&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![PDFKit](https://img.shields.io/badge/PDFKit-D6001C?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://pdfkit.org/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/aryanvisualize/CareerAI/pulls)
[![GitHub stars](https://img.shields.io/github/stars/aryanvisualize/CareerAI?style=flat-square)](https://github.com/aryanvisualize/CareerAI/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/aryanvisualize/CareerAI?style=flat-square)](https://github.com/aryanvisualize/CareerAI/issues)
[![Last Commit](https://img.shields.io/github/last-commit/aryanvisualize/CareerAI?style=flat-square)](https://github.com/aryanvisualize/CareerAI/commits/main)

[**Live Demo**](#) · [**Report Bug**](https://github.com/aryanvisualize/CareerAI/issues) · [**Request Feature**](https://github.com/aryanvisualize/CareerAI/issues)

</div>

<br>

<div align="center">
<img src="./docs/careerai-preview.png" alt="CareerAI Preview" width="90%">
</div>

<br>

## 📋 Table of Contents

<details open>
<summary>Click to expand/collapse</summary>

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Application Workflow](#-application-workflow)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#️-environment-variables)
- [API Reference](#-api-reference)
- [Security](#️-security-considerations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

</details>

---

## 🌟 Overview

**CareerAI is a Generative AI project** — a production-ready, Full Stack GenAI web application that helps job seekers prepare smarter. It uses **Google Gemini** as its generative intelligence layer to analyze resumes, identify skill gaps against target job descriptions, optimize resumes for ATS systems, and generate personalized AI-powered interview questions — all in one platform.

Built with **React.js, Node.js, Express.js, JWT, Google Gemini AI, and PDFKit**, CareerAI simulates a real-world SaaS product combining secure authentication, document processing, generative AI integration, and dynamic PDF generation.

> **One platform. One resume. One target job. Smarter preparation.**

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Secure Authentication
- User registration and login
- JWT-based authentication
- Secure protected routes
- JWT token blacklisting
- Logout and session invalidation
- Middleware-based authorization

### 📄 Resume Processing
- Upload resumes through the web app
- Parse resume content
- Extract skills, experience, education
- Convert unstructured data into structured JSON

### 🎯 Job Description Analysis
- AI-driven job description parsing
- Extract required skills and qualifications
- Identify important keywords
- Compare job requirements with candidate skills

</td>
<td width="50%" valign="top">

### 🧠 AI-Powered Skill Gap Detection
- Compare resume skills vs. job requirements
- Identify missing or weak skills
- Highlight areas needing improvement
- Actionable preparation recommendations

### 🤖 AI Interview Preparation
- Personalized interview question generation
- Based on resume, JD, skills & gaps
- Technical + behavioral question support

### 📈 ATS-Optimized Resume Generation
- AI-generated, keyword-optimized content
- Job-specific resume versions
- Programmatic PDF generation via PDFKit

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A["🖥️ React Frontend"] -->|REST API| B["⚙️ Node.js + Express.js"]

    B --> C["🔐 Auth<br/>JWT + Blacklist"]
    B --> D["📄 Resume Processing"]
    B --> E["🎯 Job Description Analysis"]

    D --> F["🧠 Gemini AI Engine"]
    E --> F

    F --> G["📊 Skill Gap Analysis"]
    F --> H["🤖 Interview Questions"]
    F --> I["📈 ATS Resume Generation"]

    I --> J["🖨️ PDFKit PDF Engine"]
    J --> K["⬇️ Downloadable PDF Resume"]

    style A fill:#61DAFB,color:#000
    style B fill:#339933,color:#fff
    style F fill:#8E75B2,color:#fff
    style J fill:#40B5A4,color:#fff
    style K fill:#f5a623,color:#000
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, JavaScript, HTML5, CSS3, REST API integration |
| **Backend** | Node.js, Express.js, RESTful APIs, Middleware architecture |
| **Authentication** | JSON Web Token (JWT), Token blacklisting, Protected routes |
| **Artificial Intelligence** | Google Gemini API — resume analysis, skill extraction, JD analysis, interview generation, ATS optimization |
| **PDF Generation** | PDFKit — programmatic, code-driven PDF generation |

---

## 🔄 Application Workflow

```mermaid
sequenceDiagram
    actor User
    participant App as CareerAI App
    participant AI as Gemini AI
    participant PDF as PDFKit

    User->>App: Create account & log in
    User->>App: Upload resume
    App->>AI: Extract skills, education, experience
    User->>App: Paste job description
    App->>AI: Analyze JD (skills, keywords, requirements)
    AI-->>App: Matching & missing skills
    App-->>User: Skill gap report + recommendations
    AI-->>App: Personalized interview questions
    App-->>User: Interview prep set
    AI-->>App: ATS-optimized resume content
    App->>PDF: Generate PDF document
    PDF-->>User: Download tailored resume
```

<details>
<summary><b>📊 Skill Gap Analysis — detail view</b></summary>

```text
   Candidate Skills          Job Requirements
          │                         │
          └───────────┬─────────────┘
                       ▼
                  AI Analysis
                       ▼
        ┌───────────────────────────┐
        │      Matching Skills      │
        │      Missing Skills       │
        │      Recommendations      │
        └───────────────────────────┘
```

</details>

---

## 📂 Project Structure

```text
CareerAI/
│
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── utils/
│       └── App.jsx
│
├── server/                  # Node.js / Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── models/
│   └── server.js
│
├── uploads/                 # Uploaded resume storage
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

> The exact folder structure may vary depending on your implementation.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) & npm
- [Git](https://git-scm.com/)
- A **Gemini API key**
- A supported database (if used by your implementation)

<details>
<summary><b>1️⃣ Clone the repository</b></summary>

```bash
git clone https://github.com/aryanvisualize/CareerAI.git
cd CareerAI
```

</details>

<details>
<summary><b>2️⃣ Install backend dependencies</b></summary>

```bash
cd server
npm install
```

</details>

<details>
<summary><b>3️⃣ Configure environment variables</b></summary>

Create a `.env` file inside `server/` — see [Environment Variables](#️-environment-variables) below.

</details>

<details>
<summary><b>4️⃣ Start the backend</b></summary>

```bash
npm run dev
```

</details>

<details>
<summary><b>5️⃣ Install frontend dependencies</b></summary>

```bash
cd client
npm install
```

</details>

<details>
<summary><b>6️⃣ Start the frontend</b></summary>

```bash
npm run dev
```

The app will be available at the local development URL shown in your terminal.

</details>

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

# Add your database configuration if required
DATABASE_URL=your_database_url
```

> ⚠️ **Never commit your `.env` file or API keys to GitHub.**

---

## 🔌 API Reference

<details>
<summary><b>Expand full endpoint list</b></summary>

```text
/api/auth
    POST /register
    POST /login
    POST /logout

/api/resume
    POST /upload
    POST /analyze
    POST /generate

/api/jobs
    POST /analyze

/api/skills
    POST /gap-analysis

/api/interview
    POST /generate

/api/pdf
    POST /generate
```

> Exact endpoints depend on your implementation.

</details>

---

## 🛡️ Security Considerations

| Consideration | Implementation |
|---|---|
| Authentication | JWT-based, with protected routes |
| Session control | Token blacklisting on logout |
| Secrets management | Environment variables (`.env`) |
| Input validation | Sanitized request payloads |
| File uploads | Controlled, validated upload handling |
| Error handling | Centralized error middleware |
| Logging | No sensitive data in logs |

---

## 📌 Roadmap

- [ ] 🔎 Job search and job recommendations
- [ ] 📊 Resume ATS scoring
- [ ] 💼 LinkedIn profile analysis
- [ ] 🎤 AI voice interview simulation
- [ ] 🗣️ Real-time interview conversations
- [ ] 📈 Interview performance analytics
- [ ] 🧑‍💼 Personalized career roadmap
- [ ] 📚 AI-generated learning plans
- [ ] 🔔 Job application tracking
- [ ] 🌐 Multi-language resume generation
- [ ] ☁️ Cloud file storage
- [ ] 📱 Mobile-responsive improvements
- [ ] 👥 Recruiter/company dashboard

---


## 🎯 Project Goals & Learning Outcomes

CareerAI is a **Generative AI project** built to demonstrate how modern web technologies and GenAI can combine into a practical, production-style application — covering full stack development, REST API design, JWT authorization, generative AI API integration, NLP, prompt engineering, and PDF automation.

```mermaid
flowchart LR
    A[React.js] --> F[Full Stack<br/>Generative AI App]
    B[Node.js] --> F
    C[Express.js] --> F
    D[JWT Auth] --> F
    E[Gemini AI] --> F
    G[PDFKit] --> F
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Aryan**
Full Stack Developer · AI/ML Enthusiast

GitHub: [github.com/aryanvisualize](https://github.com/aryanvisualize) · LinkedIn: [linkedin.com/in/aryan-rastogi-dev](https://www.linkedin.com/in/aryan-rastogi-dev/)

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

**A Generative AI project built with ❤️ using React, Node.js, Express.js, Gemini AI, JWT, and PDFKit.**

</div>