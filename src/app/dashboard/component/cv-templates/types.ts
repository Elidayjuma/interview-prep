export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    careerTitle: string;
}

export interface Education {
    degree: string;
    fieldOfStudy: string;
    institution: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export interface Experience {
    position: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
}

export interface ResumeData {
    personalInfo: PersonalInfo;
    summary: string;
    education: Education[];
    experience: Experience[];
    skills: string[];
    tools: string[];
    hobbies: string[];
}

export interface TemplateProps {
    data: ResumeData;
}
