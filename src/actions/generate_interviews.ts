"use server";

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY! });
type InterviewQA = {
    question: string;
    answer: string;
  };

export async function generateInterviews(prompt: string, noOfQuestions: string, makeTechnical: Boolean): Promise<InterviewQA[]> {
  if (!prompt.trim()) return [];

  try {
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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: makeTechnical ? technicalPrompt : basePrompt
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message?.content?.trim();

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
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}
