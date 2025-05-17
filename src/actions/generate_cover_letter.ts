"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });

export async function generateCoverLetter(job_description: string, cv: string): Promise<string> {
  if (!job_description.trim()) return "";

  try {
    const basePrompt = `Based on the job description and CV below, generate custom cover letter for this job advert.
          Job Description:
          ${job_description}
          CV:
          ${cv}
          Return the cover letter ONLY.
          Do not include any explanation or commentary. `;


    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: basePrompt
        },
      ],
      max_tokens: 5000,
    });

    const content = response.choices[0].message?.content?.trim();

if (!content) return "";


    return content;
  } catch (error) {
    console.error("Error generating questions:", error);
    return "";
  }
}
