import OpenAI from "openai";

export async function analyzeJobDescription(
  openai: OpenAI,
  jobDescription: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert ATS (Applicant Tracking System) analyzer and resume optimization specialist. 
        Analyze the job description and extract the following information.
        
        Return your response as a valid JSON object with this structure:
        {
          "requiredSkills": ["skill1", "skill2"],
          "softSkills": ["skill1", "skill2"],
          "responsibilities": ["responsibility1", "responsibility2"],
          "requiredQualifications": ["qualification1", "qualification2"],
          "preferredQualifications": ["qualification1", "qualification2"],
          "keywords": ["keyword1", "keyword2"],
          "actionVerbs": ["verb1", "verb2"],
          "industryTerms": ["term1", "term2"]
        }
        
        Ensure the response is valid JSON that can be parsed.`,
      },
      {
        role: "user",
        content: jobDescription,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
  });

  return JSON.parse(response.choices[0]?.message.content || "{}");
}

export async function calculateATSScore(
  openai: OpenAI,
  resumeContent: any,
  jobDescription: string,
  jdAnalysis: any
) {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are an ATS scoring expert. Compare the resume against the job description.
        
        Return your analysis as a valid JSON object with this structure:
        {
          "score": 0-100 (number),
          "matchedKeywords": ["keyword1", "keyword2"],
          "missingKeywords": ["keyword1", "keyword2"],
          "formattingIssues": ["issue1", "issue2"],
          "suggestions": {
            "priority": ["high priority suggestion 1", "high priority suggestion 2"],
            "general": ["general suggestion 1", "general suggestion 2"],
            "warnings": ["warning 1", "warning 2"]
          },
          "strengthAreas": ["strength1", "strength2"],
          "improvementAreas": ["area1", "area2"]
        }
        
        Be strict about keyword matching - look for exact or very close matches.
        Highlight words/phrases that MUST be added for better ATS scoring.
        The response must be valid JSON.`,
      },
      {
        role: "user",

        content: JSON.stringify({
          resume: resumeContent,
          jobDescription,
          jdAnalysis,
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
  });

  return JSON.parse(response.choices[0]?.message.content || "{}");
}

export async function tailorResume(
  openai: OpenAI,
  resumeContent: any,
  jdAnalysis: any,
  atsAnalysis: any
) {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You are a professional resume writer specializing in ATS optimization.
        Tailor the resume to match the job description while maintaining truthfulness.
        
        Rules:
        1. Incorporate missing keywords naturally
        2. Rewrite bullet points to include relevant action verbs
        3. Quantify achievements where possible
        4. Ensure ATS-friendly formatting
        5. Highlight relevant experience more prominently
        6. Track all changes made for transparency
        
        Return a JSON object with this exact structure:
        {
          "content": {
            "contact": {
              "name": "string",
              "email": "string",
              "phone": "string",
              "location": "string"
            },
            "summary": "professional summary text",
            "summaryOptimized": true/false,
            "skills": [
              {"name": "skill1", "isNew": false},
              {"name": "skill2", "isNew": true}
            ],
            "experience": [
              {
                "title": "Job Title",
                "company": "Company Name",
                "location": "Location",
                "period": "Date Range",
                "bullets": [
                  {"text": "bullet point text", "isOptimized": true/false}
                ]
              }
            ],
            "education": [
              {
                "degree": "Degree Name",
                "institution": "Institution Name",
                "location": "Location",
                "year": "Year",
                "gpa": "GPA (optional)"
              }
            ],
            "certifications": [
              {
                "name": "Certification Name",
                "issuer": "Issuing Organization",
                "date": "Date"
              }
            ]
          },
          "changes": [
            {
              "type": "added/modified/removed",
              "section": "section name",
              "before": "original text (if modified)",
              "after": "new text (if modified)",
              "content": "content (if added/removed)",
              "reason": "explanation for the change"
            }
          ],
          "improvementScore": 0-100 (number),
          "addedKeywords": ["keyword1", "keyword2"]
        }
        
        The response must be valid JSON that can be parsed.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          resume: resumeContent,
          jdAnalysis,
          atsAnalysis,
        }),
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1,
    service_tier: "flex",
  });

  return JSON.parse(response.choices[0]?.message.content || "{}");
}

// Alternative: If you're using a different OpenAI model or the JSON mode is still problematic,
// you can use this version without response_format:

export async function analyzeJobDescriptionAlternative(
  openai: OpenAI,
  jobDescription: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert ATS analyzer. Analyze the job description and extract key information.
        
        IMPORTANT: Return ONLY a valid JSON object, no other text. Structure:
        {
          "requiredSkills": [],
          "softSkills": [],
          "responsibilities": [],
          "requiredQualifications": [],
          "preferredQualifications": [],
          "keywords": [],
          "actionVerbs": [],
          "industryTerms": []
        }`,
      },
      {
        role: "user",
        content: `Analyze this job description and return the results as JSON:\n\n${jobDescription}`,
      },
    ],
    temperature: 1,
  });

  try {
    // Clean the response in case there's extra text
    const content = response.choices[0]?.message.content || "{}";
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    // Return a default structure if parsing fails
    return {
      requiredSkills: [],
      softSkills: [],
      responsibilities: [],
      requiredQualifications: [],
      preferredQualifications: [],
      keywords: [],
      actionVerbs: [],
      industryTerms: [],
    };
  }
}

// Helper function to ensure consistent data structure
export function normalizeATSAnalysis(analysis: any) {
  return {
    score: analysis.score || 0,
    matchedKeywords: Array.isArray(analysis.matchedKeywords)
      ? analysis.matchedKeywords
      : [],
    missingKeywords: Array.isArray(analysis.missingKeywords)
      ? analysis.missingKeywords
      : [],
    formattingIssues: Array.isArray(analysis.formattingIssues)
      ? analysis.formattingIssues
      : [],
    suggestions: {
      priority: analysis.suggestions?.priority || [],
      general: analysis.suggestions?.general || [],
      warnings: analysis.suggestions?.warnings || [],
    },
    strengthAreas: Array.isArray(analysis.strengthAreas)
      ? analysis.strengthAreas
      : [],
    improvementAreas: Array.isArray(analysis.improvementAreas)
      ? analysis.improvementAreas
      : [],
  };
}

export function normalizeTailoredContent(content: any) {
  return {
    content: {
      contact: content.content?.contact || {},
      summary: content.content?.summary || "",
      summaryOptimized: content.content?.summaryOptimized || false,
      skills: Array.isArray(content.content?.skills)
        ? content.content.skills
        : [],
      experience: Array.isArray(content.content?.experience)
        ? content.content.experience
        : [],
      education: Array.isArray(content.content?.education)
        ? content.content.education
        : [],
      certifications: Array.isArray(content.content?.certifications)
        ? content.content.certifications
        : [],
    },
    changes: Array.isArray(content.changes) ? content.changes : [],
    improvementScore: content.improvementScore || 0,
    addedKeywords: Array.isArray(content.addedKeywords)
      ? content.addedKeywords
      : [],
  };
}
