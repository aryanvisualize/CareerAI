const PDFDocument = require("pdfkit");

const PAGE_MARGINS = {
  top: 36,
  bottom: 36,
  left: 42,
  right: 42,
};

const COLORS = {
  text: "#111827",
  muted: "#4b5563",
  accent: "#1f4e79",
  rule: "#d1d5db",
};

const FIT_PROFILES = [
  {
    nameSize: 20,
    contactSize: 8.4,
    headingSize: 10.5,
    bodySize: 9,
    smallSize: 8.2,
    lineGap: 1.2,
    sectionGap: 7,
    itemGap: 4,
    bulletGap: 1.5,
    summaryChars: 460,
    skillGroups: 7,
    skillItems: 10,
    experienceItems: 3,
    experienceBullets: 4,
    projectItems: 2,
    projectBullets: 3,
    educationItems: 2,
    certifications: 4,
    achievements: 4,
    bulletChars: 185,
  },
  {
    nameSize: 19,
    contactSize: 8.1,
    headingSize: 10,
    bodySize: 8.7,
    smallSize: 8,
    lineGap: 0.9,
    sectionGap: 5.5,
    itemGap: 3,
    bulletGap: 1,
    summaryChars: 360,
    skillGroups: 6,
    skillItems: 8,
    experienceItems: 3,
    experienceBullets: 3,
    projectItems: 2,
    projectBullets: 2,
    educationItems: 2,
    certifications: 3,
    achievements: 3,
    bulletChars: 155,
  },
  {
    nameSize: 18,
    contactSize: 7.9,
    headingSize: 9.7,
    bodySize: 8.5,
    smallSize: 7.8,
    lineGap: 0.7,
    sectionGap: 4.5,
    itemGap: 2.5,
    bulletGap: 0.8,
    summaryChars: 300,
    skillGroups: 5,
    skillItems: 7,
    experienceItems: 2,
    experienceBullets: 3,
    projectItems: 1,
    projectBullets: 2,
    educationItems: 1,
    certifications: 2,
    achievements: 2,
    bulletChars: 130,
  },
  {
    nameSize: 18,
    contactSize: 7.8,
    headingSize: 9.5,
    bodySize: 8.3,
    smallSize: 7.6,
    lineGap: 0.5,
    sectionGap: 4,
    itemGap: 2,
    bulletGap: 0.6,
    summaryChars: 240,
    skillGroups: 4,
    skillItems: 6,
    experienceItems: 2,
    experienceBullets: 2,
    projectItems: 1,
    projectBullets: 1,
    educationItems: 1,
    certifications: 1,
    achievements: 0,
    bulletChars: 110,
  },
];

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(cleanText).filter(Boolean);
}

function truncateText(value, maxChars) {
  const text = cleanText(value);

  if (!maxChars || text.length <= maxChars) {
    return text;
  }

  const trimmed = text.slice(0, maxChars).replace(/\s+\S*$/, "").trim();

  return `${trimmed || text.slice(0, maxChars).trim()}...`;
}

function normalizeResumeData(resumeData) {
  return {
    name: cleanText(resumeData?.name) || "Resume",
    location: cleanText(resumeData?.location),
    phone: cleanText(resumeData?.phone),
    email: cleanText(resumeData?.email),
    linkedin: cleanText(resumeData?.linkedin),
    github: cleanText(resumeData?.github),
    portfolio: cleanText(resumeData?.portfolio),
    summary: cleanText(resumeData?.summary),
    skills: Array.isArray(resumeData?.skills)
      ? resumeData.skills
          .map((skillGroup) => ({
            category: cleanText(skillGroup?.category),
            items: cleanList(skillGroup?.items),
          }))
          .filter((skillGroup) => skillGroup.category || skillGroup.items.length)
      : [],
    experience: Array.isArray(resumeData?.experience)
      ? resumeData.experience
          .map((item) => ({
            company: cleanText(item?.company),
            role: cleanText(item?.role),
            location: cleanText(item?.location),
            startDate: cleanText(item?.startDate),
            endDate: cleanText(item?.endDate),
            bullets: cleanList(item?.bullets),
          }))
          .filter(
            (item) => item.company || item.role || item.bullets.length > 0,
          )
      : [],
    projects: Array.isArray(resumeData?.projects)
      ? resumeData.projects
          .map((item) => ({
            name: cleanText(item?.name),
            technologies: cleanList(item?.technologies),
            bullets: cleanList(item?.bullets),
          }))
          .filter((item) => item.name || item.bullets.length > 0)
      : [],
    education: Array.isArray(resumeData?.education)
      ? resumeData.education
          .map((item) => ({
            degree: cleanText(item?.degree),
            institution: cleanText(item?.institution),
            location: cleanText(item?.location),
            date: cleanText(item?.date),
            details: cleanText(item?.details),
          }))
          .filter(
            (item) =>
              item.degree ||
              item.institution ||
              item.location ||
              item.date ||
              item.details,
          )
      : [],
    certifications: cleanList(resumeData?.certifications),
    achievements: cleanList(resumeData?.achievements),
  };
}

function compactResumeData(resumeData, profile) {
  const data = normalizeResumeData(resumeData);

  return {
    ...data,
    summary: truncateText(data.summary, profile.summaryChars),
    skills: data.skills.slice(0, profile.skillGroups).map((skillGroup) => ({
      category: truncateText(skillGroup.category, 36),
      items: skillGroup.items
        .slice(0, profile.skillItems)
        .map((item) => truncateText(item, 34)),
    })),
    experience: data.experience
      .slice(0, profile.experienceItems)
      .map((item) => ({
        ...item,
        company: truncateText(item.company, 56),
        role: truncateText(item.role, 56),
        location: truncateText(item.location, 32),
        startDate: truncateText(item.startDate, 18),
        endDate: truncateText(item.endDate, 18),
        bullets: item.bullets
          .slice(0, profile.experienceBullets)
          .map((bullet) => truncateText(bullet, profile.bulletChars)),
      })),
    projects: data.projects.slice(0, profile.projectItems).map((item) => ({
      ...item,
      name: truncateText(item.name, 64),
      technologies: item.technologies
        .slice(0, 8)
        .map((technology) => truncateText(technology, 28)),
      bullets: item.bullets
        .slice(0, profile.projectBullets)
        .map((bullet) => truncateText(bullet, profile.bulletChars)),
    })),
    education: data.education.slice(0, profile.educationItems).map((item) => ({
      ...item,
      degree: truncateText(item.degree, 70),
      institution: truncateText(item.institution, 70),
      location: truncateText(item.location, 32),
      date: truncateText(item.date, 24),
      details: truncateText(item.details, 120),
    })),
    certifications: data.certifications
      .slice(0, profile.certifications)
      .map((item) => truncateText(item, profile.bulletChars)),
    achievements: data.achievements
      .slice(0, profile.achievements)
      .map((item) => truncateText(item, profile.bulletChars)),
  };
}

function createContext(doc, profile, measureOnly) {
  return {
    doc,
    profile,
    measureOnly,
    left: doc.page.margins.left,
    right: doc.page.width - doc.page.margins.right,
    top: doc.page.margins.top,
    bottom: doc.page.height - doc.page.margins.bottom,
    y: doc.page.margins.top,
  };
}

function textHeight(ctx, text, options) {
  const width = options.width || ctx.right - ctx.left - (options.indent || 0);

  ctx.doc.font(options.font).fontSize(options.size);

  return ctx.doc.heightOfString(text, {
    width,
    align: options.align || "left",
    lineGap: options.lineGap || 0,
  });
}

function addText(ctx, text, options) {
  const value = cleanText(text);

  if (!value) {
    return 0;
  }

  const indent = options.indent || 0;
  const x = ctx.left + indent;
  const width = options.width || ctx.right - ctx.left - indent;
  const height = textHeight(ctx, value, { ...options, width });

  if (!ctx.measureOnly && ctx.y + height <= ctx.bottom) {
    ctx.doc
      .font(options.font)
      .fontSize(options.size)
      .fillColor(options.color || COLORS.text)
      .text(value, x, ctx.y, {
        width,
        align: options.align || "left",
        lineGap: options.lineGap || 0,
      });
  }

  ctx.y += height;
  return height;
}

function addGap(ctx, amount) {
  ctx.y += amount;
}

function addRule(ctx, gap = 4) {
  if (!ctx.measureOnly) {
    ctx.doc
      .moveTo(ctx.left, ctx.y)
      .lineTo(ctx.right, ctx.y)
      .lineWidth(0.5)
      .strokeColor(COLORS.rule)
      .stroke();
  }

  ctx.y += gap;
}

function addSectionTitle(ctx, title) {
  addGap(ctx, ctx.profile.sectionGap);
  addText(ctx, title.toUpperCase(), {
    font: "Helvetica-Bold",
    size: ctx.profile.headingSize,
    color: COLORS.accent,
    lineGap: 0,
  });
  addRule(ctx, 4);
}

function addBullet(ctx, text) {
  addText(ctx, `- ${text}`, {
    font: "Helvetica",
    size: ctx.profile.bodySize,
    color: COLORS.text,
    indent: 8,
    lineGap: ctx.profile.lineGap,
  });
  addGap(ctx, ctx.profile.bulletGap);
}

function hasContactInfo(data) {
  return [
    data.location,
    data.phone,
    data.email,
    data.linkedin,
    data.github,
    data.portfolio,
  ].some(Boolean);
}

function renderHeader(ctx, data) {
  addText(ctx, data.name || "Resume", {
    font: "Helvetica-Bold",
    size: ctx.profile.nameSize,
    color: COLORS.text,
    align: "center",
    lineGap: 0,
  });

  if (hasContactInfo(data)) {
    addGap(ctx, 2);
    addText(
      ctx,
      [
        data.location,
        data.phone,
        data.email,
        data.linkedin,
        data.github,
        data.portfolio,
      ]
        .filter(Boolean)
        .join(" | "),
      {
        font: "Helvetica",
        size: ctx.profile.contactSize,
        color: COLORS.muted,
        align: "center",
        lineGap: 0.5,
      },
    );
  }

  addGap(ctx, 6);
  addRule(ctx, 3);
}

function renderSummary(ctx, data) {
  if (!data.summary) {
    return;
  }

  addSectionTitle(ctx, "Summary");
  addText(ctx, data.summary, {
    font: "Helvetica",
    size: ctx.profile.bodySize,
    color: COLORS.text,
    lineGap: ctx.profile.lineGap,
  });
}

function renderSkills(ctx, data) {
  if (!data.skills.length) {
    return;
  }

  addSectionTitle(ctx, "Technical Skills");

  data.skills.forEach((skillGroup) => {
    const items = skillGroup.items.join(", ");
    const line = skillGroup.category
      ? `${skillGroup.category}: ${items}`
      : items;

    addText(ctx, line, {
      font: "Helvetica",
      size: ctx.profile.bodySize,
      color: COLORS.text,
      lineGap: ctx.profile.lineGap,
    });
    addGap(ctx, 1.3);
  });
}

function renderExperience(ctx, data) {
  if (!data.experience.length) {
    return;
  }

  addSectionTitle(ctx, "Experience");

  data.experience.forEach((item) => {
    const roleCompany = [item.role, item.company].filter(Boolean).join(", ");
    const dateLocation = [
      item.location,
      [item.startDate, item.endDate].filter(Boolean).join(" - "),
    ]
      .filter(Boolean)
      .join(" | ");

    addText(ctx, roleCompany, {
      font: "Helvetica-Bold",
      size: ctx.profile.bodySize,
      color: COLORS.text,
      lineGap: 0,
    });

    addText(ctx, dateLocation, {
      font: "Helvetica-Oblique",
      size: ctx.profile.smallSize,
      color: COLORS.muted,
      lineGap: 0,
    });

    item.bullets.forEach((bullet) => addBullet(ctx, bullet));
    addGap(ctx, ctx.profile.itemGap);
  });
}

function renderProjects(ctx, data) {
  if (!data.projects.length) {
    return;
  }

  addSectionTitle(ctx, "Projects");

  data.projects.forEach((item) => {
    const title = item.technologies.length
      ? `${item.name} | ${item.technologies.join(", ")}`
      : item.name;

    addText(ctx, title, {
      font: "Helvetica-Bold",
      size: ctx.profile.bodySize,
      color: COLORS.text,
      lineGap: 0,
    });

    item.bullets.forEach((bullet) => addBullet(ctx, bullet));
    addGap(ctx, ctx.profile.itemGap);
  });
}

function renderEducation(ctx, data) {
  if (!data.education.length) {
    return;
  }

  addSectionTitle(ctx, "Education");

  data.education.forEach((item) => {
    const degreeInstitution = [item.degree, item.institution]
      .filter(Boolean)
      .join(", ");
    const meta = [item.location, item.date].filter(Boolean).join(" | ");

    addText(ctx, degreeInstitution, {
      font: "Helvetica-Bold",
      size: ctx.profile.bodySize,
      color: COLORS.text,
      lineGap: 0,
    });

    addText(ctx, meta, {
      font: "Helvetica-Oblique",
      size: ctx.profile.smallSize,
      color: COLORS.muted,
      lineGap: 0,
    });

    addText(ctx, item.details, {
      font: "Helvetica",
      size: ctx.profile.bodySize,
      color: COLORS.text,
      lineGap: ctx.profile.lineGap,
    });
    addGap(ctx, ctx.profile.itemGap);
  });
}

function renderListSection(ctx, title, items) {
  if (!items.length) {
    return;
  }

  addSectionTitle(ctx, title);
  items.forEach((item) => addBullet(ctx, item));
}

function renderResumeContent(doc, data, profile, measureOnly = false) {
  const ctx = createContext(doc, profile, measureOnly);

  renderHeader(ctx, data);
  renderSummary(ctx, data);
  renderSkills(ctx, data);
  renderExperience(ctx, data);
  renderProjects(ctx, data);
  renderEducation(ctx, data);
  renderListSection(ctx, "Certifications", data.certifications);
  renderListSection(ctx, "Achievements", data.achievements);

  return ctx;
}

function measureResumeHeight(data, profile) {
  const doc = new PDFDocument({
    size: "A4",
    margins: PAGE_MARGINS,
    autoFirstPage: true,
  });

  const ctx = renderResumeContent(doc, data, profile, true);
  doc.end();

  return ctx.y - ctx.top;
}

function chooseFittedResumeData(resumeData) {
  const measureDoc = new PDFDocument({
    size: "A4",
    margins: PAGE_MARGINS,
    autoFirstPage: true,
  });
  const availableHeight =
    measureDoc.page.height - PAGE_MARGINS.top - PAGE_MARGINS.bottom;
  measureDoc.end();

  for (const profile of FIT_PROFILES) {
    const data = compactResumeData(resumeData, profile);
    const measuredHeight = measureResumeHeight(data, profile);

    if (measuredHeight <= availableHeight) {
      return { data, profile, compacted: profile !== FIT_PROFILES[0] };
    }
  }

  return {
    data: compactResumeData(resumeData, FIT_PROFILES[FIT_PROFILES.length - 1]),
    profile: FIT_PROFILES[FIT_PROFILES.length - 1],
    compacted: true,
  };
}

async function generateResumePdf(resumeData) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let failed = false;

    const doc = new PDFDocument({
      size: "A4",
      margins: PAGE_MARGINS,
      bufferPages: true,
      autoFirstPage: false,
    });

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("error", (error) => {
      failed = true;
      reject(error);
    });
    doc.on("end", () => {
      if (!failed) {
        resolve(Buffer.concat(chunks));
      }
    });

    try {
      const { data, profile, compacted } = chooseFittedResumeData(resumeData);

      if (compacted) {
        console.log("Resume content compacted to fit one A4 page.");
      }

      doc.addPage({
        size: "A4",
        margins: PAGE_MARGINS,
      });
      doc.info.Title = `${data.name || "Resume"} - Resume`;
      doc.info.Author = data.name || "CareerAI";
      doc.info.Subject = "CareerAI generated resume";

      renderResumeContent(doc, data, profile, false);

      if (doc.bufferedPageRange().count > 1) {
        throw new Error("PDF layout exceeded one page.");
      }

      doc.end();
    } catch (error) {
      failed = true;
      reject(error);
      try {
        doc.end();
      } catch {
        // Ignore cleanup errors after the primary rendering error.
      }
    }
  });
}

module.exports = { generateResumePdf };
