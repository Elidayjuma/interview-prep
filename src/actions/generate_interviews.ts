"use server";

import { OpenAI } from "openai";
import { incrementPromptUsage, getPromptUsage, checkAndTrackUnregisteredUsage } from "@/actions/actions";
import { session_data } from "../middleware";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });
type InterviewQA = {
  question: string;
  answer: string;
};

export async function generateInterviews(prompt: string, noOfQuestions: string, makeTechnical: Boolean): Promise<any> {
  if (!prompt.trim()) return [];

  try {
    const session = await session_data();
    const userId = session?.userId ? parseInt(session.userId as string, 10) : undefined;

    if (userId) {
      const usage = await getPromptUsage(userId);
      if (Number.isFinite(usage.promptLimitMonthly as number) && (usage.remaining as number) <= 0) {
        return { error: "LIMIT_REACHED" };
      }
    } else {
      const guestUsage = await checkAndTrackUnregisteredUsage();
      if (!guestUsage.allowed) {
        return { error: guestUsage.reason };
      }
    }
  } catch (err) {
    console.error("Usage check failed:", err);
  }
  const basePrompt = `Based on the job description below, generate ${noOfQuestions} interview questions and answers.
          Job Description:
          ${prompt}
          Return ONLY a JSON array like:
          [
            {"question": "...", "answer": "..."},
            ...
          ]

          Do not include any explanation or commentary. Wrap the JSON in triple backticks with 'json' (e.g., \`\`\`json).`;

  const technicalPrompt = `Make the questions more technical. ` + basePrompt;


  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: makeTechnical ? technicalPrompt : basePrompt
      },
    ],
    max_tokens: 1000,
  });

  const content = response.choices[0].message?.content?.trim();

  // Track usage (best-effort)
  try {
    const session = await session_data();
    const userId = session?.userId ? parseInt(session.userId as string, 10) : undefined;
    if (userId) {
      await incrementPromptUsage(userId, 1);
    }
  } catch { }

  if (!content) return [];

  // Extract JSON block from Markdown-like formatting
  const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/) || [null, content];

  try {
    const parsed = JSON.parse(jsonMatch[1].trim());
    if (Array.isArray(parsed)) return parsed;
  } catch (parseError) {
    console.error("Failed to parse response:", content);
  }


  return [];
}
