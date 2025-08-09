"use server";

import { OpenAI } from "openai";
import { incrementPromptUsage, getPromptUsage } from "@/actions/actions";
import { session_data } from "../middleware";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function generateCustomCv(job_description: string, cv: string): Promise<string> {
  if (!job_description.trim()) return "";

  try {
    // Enforce prompt limits (best-effort)
    try {
      const session = await session_data();
      const userId = session?.userId ? parseInt(session.userId as string, 10) : undefined;
      if (userId) {
        const usage = await getPromptUsage(userId);
        if (Number.isFinite(usage.promptLimitMonthly as number) && (usage.remaining as number) <= 0) {
          return "";
        }
      }
    } catch {}
    const basePrompt = `Based on the job description below and Cv provided, generate custom Cv for this job advert.
          Job Description:
          ${job_description}
          User Cv: ${cv}
          Return the custom CV ONLY.
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
    } catch {}

if (!content) return "";

// // Extract JSON block from Markdown-like formatting
// const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/) || [null, content];

// try {
//   const parsed = JSON.parse(jsonMatch[1].trim());
//   if (Array.isArray(parsed)) return parsed;
// } catch (parseError) {
//   console.error("Failed to parse response:", content);
// }


    return content;
  } catch (error) {
    console.error("Error generating questions:", error);
    return "";
  }
}
