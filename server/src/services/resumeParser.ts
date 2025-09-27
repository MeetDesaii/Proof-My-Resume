import pdfParse from "pdf-parse";
import mammoth from "mammoth";

interface ParsedResume {
  rawText: string;
  contact: ContactInfo;
  summary?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  projects?: Project[];
  languages?: string[];
  sections: { [key: string]: string };
}

interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface Experience {
  title: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
  description?: string;
}

interface Education {
  degree: string;
  institution: string;
  location?: string;
  year: string;
  gpa?: string;
  coursework?: string[];
}

interface Project {
  name: string;
  description: string;
  technologies?: string[];
  link?: string;
}

// Comprehensive list of technical skills for better detection
const TECH_SKILLS = [
  // Programming Languages
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Scala",
  "PHP",
  "Perl",
  "R",
  "MATLAB",
  "Julia",
  "Dart",
  "Elixir",
  "Clojure",
  "Haskell",
  "Lua",
  "Objective-C",
  "Visual Basic",
  "Assembly",
  "COBOL",
  "Fortran",
  "Pascal",

  // Frontend
  "React",
  "React Native",
  "Angular",
  "Vue",
  "Vue.js",
  "Next.js",
  "Nuxt.js",
  "Gatsby",
  "Svelte",
  "Ember",
  "Backbone",
  "jQuery",
  "Bootstrap",
  "Tailwind CSS",
  "Material-UI",
  "Ant Design",
  "Chakra UI",
  "Styled Components",
  "Sass",
  "SCSS",
  "Less",
  "PostCSS",
  "Webpack",
  "Parcel",
  "Rollup",
  "Vite",
  "Babel",
  "ESLint",
  "Prettier",

  // Backend
  "Node.js",
  "Express",
  "Express.js",
  "Fastify",
  "Koa",
  "NestJS",
  "Django",
  "Flask",
  "FastAPI",
  "Spring",
  "Spring Boot",
  "Ruby on Rails",
  "Laravel",
  "ASP.NET",
  ".NET Core",
  "Gin",
  "Echo",
  "Fiber",
  "Phoenix",
  "Actix",
  "Rocket",

  // Databases
  "SQL",
  "NoSQL",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Firebase",
  "Firestore",
  "Supabase",
  "Oracle",
  "SQL Server",
  "SQLite",
  "MariaDB",
  "CouchDB",
  "Neo4j",
  "Elasticsearch",
  "InfluxDB",
  "TimescaleDB",
  "Prisma",
  "TypeORM",
  "Sequelize",
  "Mongoose",
  "SQLAlchemy",

  // Cloud & DevOps
  "AWS",
  "Azure",
  "GCP",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "CI/CD",
  "GitHub Actions",
  "GitLab CI",
  "CircleCI",
  "Travis CI",
  "Terraform",
  "Ansible",
  "CloudFormation",
  "Pulumi",
  "Vagrant",
  "Chef",
  "Puppet",
  "Nginx",
  "Apache",
  "IIS",
  "Linux",
  "Unix",
  "Windows Server",
  "VMware",
  "Hyper-V",
  "OpenStack",

  // Tools & Others
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",
  "Mercurial",
  "Jira",
  "Confluence",
  "REST",
  "GraphQL",
  "gRPC",
  "WebSockets",
  "OAuth",
  "JWT",
  "SAML",
  "OpenAPI",
  "Swagger",
  "Postman",
  "Insomnia",
  "Charles Proxy",
  "Wireshark",
  "Chrome DevTools",

  // Data Science & ML
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Jupyter",
  "Spark",
  "Hadoop",
  "Kafka",
  "Airflow",
  "MLflow",
  "Kubeflow",
  "SageMaker",
  "BigQuery",
  "Databricks",
  "Tableau",
  "Power BI",
  "Looker",
  "Grafana",
  "Prometheus",

  // Mobile
  "iOS",
  "Android",
  "Flutter",
  "React Native",
  "Xamarin",
  "Ionic",
  "Cordova",
  "SwiftUI",
  "Jetpack Compose",
  "Expo",

  // Testing
  "Jest",
  "Mocha",
  "Chai",
  "Jasmine",
  "Karma",
  "Cypress",
  "Playwright",
  "Puppeteer",
  "Selenium",
  "TestNG",
  "JUnit",
  "PyTest",
  "RSpec",
  "Cucumber",
  "Postman",
  "Newman",
  "React Testing Library",
  "Enzyme",

  // Agile & Methodologies
  "Agile",
  "Scrum",
  "Kanban",
  "Waterfall",
  "Lean",
  "Six Sigma",
  "DevOps",
  "CI/CD",
  "TDD",
  "BDD",
  "DDD",
  "Microservices",
  "Serverless",
  "Event-Driven",
  "RESTful",
];

export async function parseResume(
  buffer: Buffer,
  mimeType: string
): Promise<ParsedResume> {
  let rawText = "";

  try {
    // Extract text based on file type
    if (mimeType === "application/pdf") {
      const pdfData = await pdfParse(buffer, {
        max: 0, // No page limit
        // Preserve formatting
        pagerender: (pageData: any) => {
          const renderOptions = {
            normalizeWhitespace: false,
            disableCombineTextItems: false,
          };
          return pageData
            .getTextContent(renderOptions)
            .then((textContent: any) => {
              let text = "";
              for (const item of textContent.items) {
                text += item.str;
                // Add space or newline based on position
                if (item.hasEOL) {
                  text += "\n";
                } else {
                  text += " ";
                }
              }
              return text;
            });
        },
      });
      rawText = pdfData.text;
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;

      // Also try to get formatted text for better structure
      const htmlResult = await mammoth.convertToHtml({ buffer });
      // Remove HTML tags but keep structure
      const structuredText = htmlResult.value
        .replace(/<\/p>/g, "\n\n")
        .replace(/<\/li>/g, "\n")
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      // Use structured text if it's more complete
      if (structuredText.length > rawText.length) {
        rawText = structuredText;
      }
    }

    // Clean up the text
    rawText = cleanText(rawText);

    // Parse the resume into structured sections
    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Detect sections
    const sections = detectSections(lines);

    // Extract structured information
    const contact = extractContactInfo(rawText, sections);
    const summary = extractSummary(sections);
    const skills = extractSkills(rawText, sections);
    const experience = extractExperience(sections);
    const education = extractEducation(sections);
    const certifications = extractCertifications(sections);
    const projects = extractProjects(sections);
    const languages = extractLanguages(sections);

    return {
      rawText,
      contact,
      summary,
      skills,
      experience,
      education,
      certifications,
      projects,
      languages,
      sections,
    };
  } catch (error) {
    console.error("Error parsing resume:", error);
    // Return a basic structure even if parsing fails
    return {
      rawText,
      contact: extractContactInfo(rawText, {}),
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      sections: { fullText: rawText },
    };
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n") // Normalize line endings
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ") // Replace tabs with spaces
    .replace(/\u00A0/g, " ") // Replace non-breaking spaces
    .replace(/\s+/g, " ") // Multiple spaces to single
    .replace(/\n{3,}/g, "\n\n") // Limit consecutive newlines
    .replace(/^\s+|\s+$/gm, "") // Trim each line
    .trim();
}

function detectSections(lines: string[]): { [key: string]: string } {
  const sections: { [key: string]: string } = {};
  const sectionHeaders = {
    summary: /^(summary|objective|profile|about|overview|introduction)/i,
    experience:
      /^(experience|employment|work\s*history|professional\s*experience|career)/i,
    education: /^(education|academic|qualifications?|studies)/i,
    skills:
      /^(skills|technical\s*skills|competencies|expertise|technologies|proficiencies)/i,
    projects: /^(projects?|portfolio|work\s*samples?)/i,
    certifications: /^(certifications?|certificates?|licenses?|credentials?)/i,
    languages: /^(languages?|language\s*skills?)/i,
    awards: /^(awards?|honors?|achievements?|accomplishments?)/i,
    publications: /^(publications?|papers?|articles?)/i,
    references: /^(references?|referees?)/i,
  };

  let currentSection = "header";
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let foundSection = false;

    // Check if this line is a section header
    for (const [section, pattern] of Object.entries(sectionHeaders)) {
      if (pattern.test(line)) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join("\n").trim();
        }
        currentSection = section;
        currentContent = [];
        foundSection = true;
        break;
      }
    }

    // If not a section header, add to current section
    if (!foundSection && line.length > 0) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}

function extractContactInfo(
  text: string,
  sections: { [key: string]: string }
): ContactInfo {
  const contact: ContactInfo = {};

  // Look in header section first, then full text
  const searchText =
    sections.header || text.substring(0, Math.min(1000, text.length));

  // Extract name (usually first non-empty line or largest text)
  const lines = searchText.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > 0) {
    // First line is often the name
    const potentialName = lines[0].trim();
    // Check if it looks like a name (not an email or phone)
    if (
      !potentialName.includes("@") &&
      !potentialName.match(/\d{3,}/) &&
      potentialName.length < 50
    ) {
      contact.name = potentialName;
    }
  }

  // Extract email
  const emailMatch = searchText.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
  );
  if (emailMatch) {
    contact.email = emailMatch[1].toLowerCase();
  }

  // Extract phone (multiple formats)
  const phonePatterns = [
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /(\+\d{1,3}\s?)?\d{10,}/,
    /(\d{3}[-.\s]\d{3}[-.\s]\d{4})/,
  ];

  for (const pattern of phonePatterns) {
    const phoneMatch = searchText.match(pattern);
    if (phoneMatch) {
      contact.phone = phoneMatch[0].trim();
      break;
    }
  }

  // Extract LinkedIn
  const linkedinMatch = searchText.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedinMatch) {
    contact.linkedin = `https://www.linkedin.com/in/${linkedinMatch[1]}`;
  }

  // Extract GitHub
  const githubMatch = searchText.match(/github\.com\/([a-zA-Z0-9-]+)/i);
  if (githubMatch) {
    contact.github = `https://github.com/${githubMatch[1]}`;
  }

  // Extract location (city, state pattern)
  const locationMatch = searchText.match(
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2})\b/
  );
  if (locationMatch) {
    contact.location = `${locationMatch[1]}, ${locationMatch[2]}`;
  } else {
    // Try to find location keywords
    const locationKeywords =
      /(New York|Los Angeles|Chicago|Houston|Phoenix|Philadelphia|San Antonio|San Diego|Dallas|San Jose|Austin|San Francisco|Seattle|Denver|Boston|Washington|Portland|Miami|Atlanta)/i;
    const cityMatch = searchText.match(locationKeywords);
    if (cityMatch) {
      contact.location = cityMatch[0];
    }
  }

  // Extract portfolio/website
  const websiteMatch = searchText.match(
    /(?:portfolio|website)[:\s]*(https?:\/\/[^\s]+)/i
  );
  if (websiteMatch) {
    contact.portfolio = websiteMatch[1];
  }

  return contact;
}

function extractSummary(sections: {
  [key: string]: string;
}): string | undefined {
  // Look for summary in detected sections
  if (sections.summary) {
    return sections.summary;
  }

  // Sometimes summary is in the header section after contact info
  if (sections.header) {
    const lines = sections.header.split("\n");
    // Skip first few lines (likely contact info)
    for (let i = 2; i < Math.min(10, lines.length); i++) {
      if (lines[i].length > 50) {
        // Likely a summary paragraph
        return lines
          .slice(i, i + 5)
          .join(" ")
          .trim();
      }
    }
  }

  return undefined;
}

function extractSkills(
  text: string,
  sections: { [key: string]: string }
): string[] {
  const skills = new Set<string>();

  // First try to extract from skills section
  if (sections.skills) {
    const skillsText = sections.skills;

    // Split by common delimiters
    const possibleSkills = skillsText.split(/[,;|\n•·▪◦‣⁃]/);
    possibleSkills.forEach((skill) => {
      const cleaned = skill.trim().replace(/^[-•·▪◦‣⁃]\s*/, "");
      if (cleaned.length > 1 && cleaned.length < 50) {
        skills.add(cleaned);
      }
    });
  }

  // Also search for known technical skills in the entire text
  TECH_SKILLS.forEach((skill) => {
    const regex = new RegExp(
      `\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi"
    );
    if (regex.test(text)) {
      skills.add(skill);
    }
  });

  // Look for programming languages pattern
  const langPattern = /\b(C\+\+|C#|F#|C)\b/g;
  const matches = text.match(langPattern);
  if (matches) {
    matches.forEach((match) => skills.add(match));
  }

  return Array.from(skills).filter((skill) => skill.length > 1);
}

function extractExperience(sections: { [key: string]: string }): Experience[] {
  const experiences: Experience[] = [];

  if (!sections.experience) return experiences;

  const lines = sections.experience.split("\n");
  let currentExperience: Partial<Experience> | null = null;
  let bullets: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Check if this is a job title line (usually contains certain keywords or patterns)
    const titlePattern =
      /^([^|•·▪◦‣⁃]+?)(?:\s*[-|—]\s*(.+?))?(?:\s*[-|—]\s*(.+?))?$/;
    const datePattern =
      /\b(\d{4}|\d{1,2}\/\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;

    if (
      !line.startsWith("•") &&
      !line.startsWith("-") &&
      !line.startsWith("*") &&
      !line.startsWith("·") &&
      (datePattern.test(line) || i === 0 || (i > 0 && bullets.length > 0))
    ) {
      // Save previous experience if exists
      if (currentExperience && currentExperience.title) {
        currentExperience.bullets = bullets;
        experiences.push(currentExperience as Experience);
        bullets = [];
      }

      // Parse new experience
      currentExperience = {};

      // Try to extract title, company, and date from this and next lines
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";

      // Common patterns:
      // Title | Company | Date
      // Title at Company
      // Company - Title - Date

      if (line.includes("|")) {
        const parts = line.split("|").map((p) => p.trim());
        currentExperience.title = parts[0];
        currentExperience.company = parts[1] || "";
        currentExperience.period = parts[2] || "";
      } else if (line.includes(" at ")) {
        const parts = line.split(" at ");
        currentExperience.title = parts[0].trim();
        currentExperience.company = parts[1]?.trim() || "";
      } else {
        // Assume first line is title, look for company and date in next lines
        currentExperience.title = line;

        if (
          nextLine &&
          !nextLine.startsWith("•") &&
          !nextLine.startsWith("-")
        ) {
          currentExperience.company = nextLine;
          i++; // Skip next line

          // Check for date in the line after company
          if (i + 1 < lines.length) {
            const dateLine = lines[i + 1].trim();
            if (datePattern.test(dateLine)) {
              currentExperience.period = dateLine;
              i++;
            }
          }
        }
      }

      // Extract date from any of the fields if not already found
      if (!currentExperience.period) {
        const fullText = `${currentExperience.title} ${currentExperience.company}`;
        const dateMatch =
          fullText.match(/(\d{4})\s*[-–]\s*(\d{4}|Present|Current)/i) ||
          fullText.match(
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i
          );
        if (dateMatch) {
          currentExperience.period = dateMatch[0];
        }
      }
    } else if (
      line.match(/^[•·▪◦‣⁃*-]\s*.+/) ||
      line.match(/^\s*[•·▪◦‣⁃*-]\s*.+/)
    ) {
      // This is a bullet point
      const bullet = line.replace(/^[•·▪◦‣⁃*-]\s*/, "").trim();
      if (bullet) {
        bullets.push(bullet);
      }
    } else if (currentExperience && bullets.length === 0) {
      // This might be a description paragraph
      if (!currentExperience.company && !datePattern.test(line)) {
        currentExperience.company = line;
      } else if (!currentExperience.period && datePattern.test(line)) {
        currentExperience.period = line;
      } else {
        // Add as a bullet point
        bullets.push(line);
      }
    } else {
      // Add to current bullets
      bullets.push(line);
    }
  }

  // Save last experience
  if (currentExperience && currentExperience.title) {
    currentExperience.bullets = bullets;
    experiences.push(currentExperience as Experience);
  }

  // Clean up experiences
  return experiences.map((exp) => ({
    title: exp.title || "Position",
    company: exp.company || "Company",
    location: exp.location || "",
    period: exp.period || "",
    bullets: exp.bullets || [],
    description: exp.description,
  }));
}

function extractEducation(sections: { [key: string]: string }): Education[] {
  const educationList: Education[] = [];

  if (!sections.education) return educationList;

  const lines = sections.education.split("\n");
  let currentEducation: Partial<Education> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    // Check for degree keywords
    const degreePattern =
      /(Bachelor|B\.[A-Z]|BS|BA|Master|M\.[A-Z]|MS|MA|MBA|PhD|Ph\.D|Doctor|Associate|High School|Diploma)/i;
    const yearPattern = /\b(19\d{2}|20\d{2})\b/;
    const gpaPattern = /GPA[:\s]*([0-9.]+)/i;

    if (degreePattern.test(line) || yearPattern.test(line)) {
      // Save previous education if exists
      if (currentEducation && currentEducation.degree) {
        educationList.push(currentEducation as Education);
      }

      currentEducation = {};

      // Try to parse degree and institution
      if (line.includes("|")) {
        const parts = line.split("|").map((p) => p.trim());
        currentEducation.degree = parts[0];
        currentEducation.institution = parts[1] || "";
        currentEducation.year = parts[2] || "";
      } else if (line.includes(",")) {
        const parts = line.split(",").map((p) => p.trim());
        currentEducation.degree = parts[0];
        currentEducation.institution = parts[1] || "";
      } else {
        currentEducation.degree = line;
      }

      // Extract year
      const yearMatch = line.match(yearPattern);
      if (yearMatch && !currentEducation.year) {
        currentEducation.year = yearMatch[0];
      }

      // Extract GPA
      const gpaMatch = line.match(gpaPattern);
      if (gpaMatch) {
        currentEducation.gpa = gpaMatch[1];
      }
    } else if (currentEducation && !currentEducation.institution) {
      // This might be the institution
      currentEducation.institution = line;

      // Check for year in this line too
      const yearMatch = line.match(yearPattern);
      if (yearMatch && !currentEducation.year) {
        currentEducation.year = yearMatch[0];
      }
    } else if (currentEducation) {
      // Check for GPA or coursework
      const gpaMatch = line.match(gpaPattern);
      if (gpaMatch) {
        currentEducation.gpa = gpaMatch[1];
      } else if (
        line.toLowerCase().includes("coursework") ||
        line.toLowerCase().includes("relevant courses")
      ) {
        // Next lines might be coursework
        const coursework: string[] = [];
        for (let j = i + 1; j < lines.length && j < i + 5; j++) {
          const courseLine = lines[j].trim();
          if (courseLine && !degreePattern.test(courseLine)) {
            coursework.push(courseLine);
          } else {
            break;
          }
        }
        if (coursework.length > 0) {
          currentEducation.coursework = coursework;
          i += coursework.length; // Skip processed lines
        }
      }
    }
  }

  // Save last education
  if (currentEducation && currentEducation.degree) {
    educationList.push(currentEducation as Education);
  }

  return educationList.map((edu) => ({
    degree: edu.degree || "",
    institution: edu.institution || "",
    location: edu.location || "",
    year: edu.year || "",
    gpa: edu.gpa,
    coursework: edu.coursework,
  }));
}

function extractCertifications(sections: { [key: string]: string }): string[] {
  const certifications: string[] = [];

  if (sections.certifications) {
    const lines = sections.certifications.split("\n");
    lines.forEach((line) => {
      const cleaned = line.trim().replace(/^[•·▪◦‣⁃*-]\s*/, "");
      if (cleaned.length > 5) {
        certifications.push(cleaned);
      }
    });
  }

  // Also look for common certification patterns in full text
  if (sections.header || sections.summary) {
    const certText = (sections.header || "") + " " + (sections.summary || "");
    const certPatterns = [
      /Certified\s+[A-Z][A-Za-z\s]+/g,
      /[A-Z]{2,}[+]?\s*Certified/g,
      /[A-Z]{2,}[+]?\s*Certification/g,
      /AWS\s+[A-Za-z\s]+/g,
      /Microsoft\s+[A-Za-z\s]+/g,
      /Google\s+[A-Za-z\s]+/g,
      /Cisco\s+[A-Z]{3,}/g,
    ];

    certPatterns.forEach((pattern) => {
      const matches = certText.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          if (!certifications.includes(match.trim())) {
            certifications.push(match.trim());
          }
        });
      }
    });
  }

  return certifications;
}

function extractProjects(sections: { [key: string]: string }): Project[] {
  const projects: Project[] = [];

  if (!sections.projects) return projects;

  const lines = sections.projects.split("\n");
  let currentProject: Partial<Project> | null = null;
  let description = "";

  for (const line of lines) {
    const cleaned = line.trim();

    if (!cleaned) continue;

    // Check if this is a project title (usually not a bullet point)
    if (
      !cleaned.startsWith("•") &&
      !cleaned.startsWith("-") &&
      !cleaned.startsWith("*") &&
      cleaned.length > 5
    ) {
      // Save previous project
      if (currentProject && currentProject.name) {
        currentProject.description = description.trim();
        projects.push(currentProject as Project);
        description = "";
      }

      currentProject = {
        name: cleaned,
      };
    } else if (currentProject) {
      // Add to description
      const bullet = cleaned.replace(/^[•·▪◦‣⁃*-]\s*/, "");
      description += bullet + " ";

      // Try to extract technologies
      if (
        cleaned.toLowerCase().includes("technolog") ||
        cleaned.toLowerCase().includes("stack") ||
        cleaned.toLowerCase().includes("built with")
      ) {
        const techPart = cleaned.split(/[:|]/)[1] || cleaned;
        currentProject.technologies = techPart
          .split(/[,;]/)
          .map((t) => t.trim());
      }

      // Try to extract link
      const linkMatch = cleaned.match(/https?:\/\/[^\s]+/);
      if (linkMatch) {
        currentProject.link = linkMatch[0];
      }
    }
  }

  // Save last project
  if (currentProject && currentProject.name) {
    currentProject.description = description.trim();
    projects.push(currentProject as Project);
  }

  return projects;
}

function extractLanguages(sections: { [key: string]: string }): string[] {
  const languages: string[] = [];

  if (sections.languages) {
    const lines = sections.languages.split(/[,;|\n•·▪◦‣⁃]/);
    lines.forEach((line) => {
      const cleaned = line.trim();
      if (cleaned.length > 2 && cleaned.length < 50) {
        languages.push(cleaned);
      }
    });
  }

  return languages;
}

// Export a function to get a simple text representation for AI processing
export function getResumeTextForAI(parsedResume: ParsedResume): string {
  let text = "";

  // Contact
  if (parsedResume.contact.name) {
    text += `Name: ${parsedResume.contact.name}\n`;
  }
  if (parsedResume.contact.email) {
    text += `Email: ${parsedResume.contact.email}\n`;
  }
  if (parsedResume.contact.phone) {
    text += `Phone: ${parsedResume.contact.phone}\n`;
  }
  if (parsedResume.contact.location) {
    text += `Location: ${parsedResume.contact.location}\n`;
  }

  text += "\n";

  // Summary
  if (parsedResume.summary) {
    text += `SUMMARY:\n${parsedResume.summary}\n\n`;
  }

  // Skills
  if (parsedResume.skills.length > 0) {
    text += `SKILLS:\n${parsedResume.skills.join(", ")}\n\n`;
  }

  // Experience
  if (parsedResume.experience.length > 0) {
    text += "EXPERIENCE:\n";
    parsedResume.experience.forEach((exp) => {
      text += `${exp.title} at ${exp.company} (${exp.period})\n`;
      exp.bullets.forEach((bullet) => {
        text += `• ${bullet}\n`;
      });
      text += "\n";
    });
  }

  // Education
  if (parsedResume.education.length > 0) {
    text += "EDUCATION:\n";
    parsedResume.education.forEach((edu) => {
      text += `${edu.degree} from ${edu.institution} (${edu.year})`;
      if (edu.gpa) {
        text += ` - GPA: ${edu.gpa}`;
      }
      text += "\n";
    });
    text += "\n";
  }

  // Projects
  if (parsedResume.projects && parsedResume.projects.length > 0) {
    text += "PROJECTS:\n";
    parsedResume.projects.forEach((project) => {
      text += `${project.name}\n`;
      text += `${project.description}\n`;
      if (project.technologies) {
        text += `Technologies: ${project.technologies.join(", ")}\n`;
      }
      text += "\n";
    });
  }

  // Certifications
  if (parsedResume.certifications.length > 0) {
    text += `CERTIFICATIONS:\n${parsedResume.certifications.join("\n")}\n\n`;
  }

  return text;
}
