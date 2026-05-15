"use server";

import { OpenAI } from "openai";
import { incrementPromptUsage, getPromptUsage, checkAndTrackUnregisteredUsage } from "@/actions/actions";
import { session_data } from "../middleware";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function generateCustomCv(job_description: string, cv: string): Promise<string> {
  if (!job_description.trim()) return "";

  try {
    const session = await session_data();
    const userId = session?.userId ? parseInt(session.userId as string, 10) : undefined;

    if (userId) {
      const usage = await getPromptUsage(userId);
      if (Number.isFinite(usage.promptLimitMonthly as number) && (usage.remaining as number) <= 0) {
        return "ERROR: LIMIT_REACHED";
      }
    } else {
      const guestUsage = await checkAndTrackUnregisteredUsage();
      if (!guestUsage.allowed) {
        return `ERROR: ${guestUsage.reason}`;
      }
    }
  } catch (err) {
    console.error("Usage check failed:", err);
  }
  const basePrompt = `Based on the job description and CV provided, generate a tailored resume in JSON format.
          Job Description: ${job_description}
          User CV: ${cv}
          
          Return ONLY a valid JSON object matching this structure:
          {
            "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "", "portfolio": "", "twitter": "", "careerTitle": "" },
            "summary": "Tailored professional summary...",
            "education": [{ "degree": "", "fieldOfStudy": "", "institution": "", "startDate": "", "endDate": "", "description": "" }],
            "experience": [{ "position": "", "company": "", "location": "", "startDate": "", "endDate": "", "responsibilities": ["", ""] }],
            "skills": ["", ""],
            "tools": ["", ""],
            "hobbies": ["", ""]
          }
          Ensure all content is highly tailored to the job description. Do not include markdown code blocks or any text outside the JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a world-class resume expert that only outputs JSON." },
      { role: "user", content: basePrompt }
    ],
    response_format: { type: "json_object" },
    max_tokens: 5000,
  });

  const content = response.choices[0].message?.content?.trim();

  // Track usage (best-effort)
  try {
    const session = await session_data();
    const userId = session?.userId ? parseInt(session.userId as string, 10) : undefined;
    if (userId) {
      await incrementPromptUsage(userId, 1);
    }
  } catch (error) {
    console.error("Error incrementing prompt usage:", error);
  }

  return content || "";
}
