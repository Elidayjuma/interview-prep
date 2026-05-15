"use server";

import { OpenAI } from "openai";
import { incrementPromptUsage, getPromptUsage, checkAndTrackUnregisteredUsage } from "@/actions/actions";
import { session_data } from "../middleware";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function generateCoverLetter(job_description: string, cv: string): Promise<string> {
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
  const basePrompt = `Based on the job description and CV below, generate custom cover letter for this job advert.
          Job Description:
          ${job_description}
          CV:
          ${cv}
          Return the cover letter ONLY.
          Do not include any explanation or commentary. `;


  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: basePrompt
      },
    ],
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

  if (!content) return "";

  return content;
}
