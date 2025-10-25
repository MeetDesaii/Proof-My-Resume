export enum JobKeywordPriority {
  MUST_HAVE = "MUST_HAVE",
  NICE_TO_HAVE = "NICE_TO_HAVE",
  OPTIONAL = "OPTIONAL",
}
export enum JobKeywordType {
  TECH_TOOL = "TECH_TOOL",
  SOFT_SKILL = "SOFT_SKILL",
  CERTIFICATION = "CERTIFICATION",
  DOMAIN = "DOMAIN",
}

export interface Job {
  title: string;
  description: string;
  keywords: JobKeyword[];
  company: JobCompany;
}

export interface JobCompany {
  // logoUrl:
  name: string;
  domain: string;
}

interface JobKeyword {
  priority: JobKeywordPriority;
  text: string;
  jobMatches: string[];
  type: JobKeywordType;
}
