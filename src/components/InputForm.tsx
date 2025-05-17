"use client";

import React, { useState, ChangeEvent } from "react";
import { generateInterviews } from "@/actions/generate_interviews";
import QuestionCard from "./QuestionCard";

type InterviewQA = {
    question: string;
    answer: string;
};

const InputForm: React.FC = () => {
    const CHAR_LIMIT = 2000;
    const WARNING_THRESHOLD = 1800;

    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [noOfQuestions, setNoOfQuestions] = useState<string>("");
    const [makeTechnical, setMakeTechnical] = useState(false);
    const [questions, setQuestions] = useState<InterviewQA[]>([]);
    const [descWarning, setDescWarning] = useState(false);

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value.slice(0, CHAR_LIMIT);
        setDescription(input);
        setDescWarning(input.length >= WARNING_THRESHOLD);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        setQuestions([]); // Clear previous questions

        if (!description.trim()) {
            setError("Please enter a job description.");
            setLoading(false);
            return;
        }

        // Assuming the backend is updated to parse a text prompt into structured data
        const interviewQuestions = await generateInterviews(description, noOfQuestions || "5", makeTechnical);
        if (!interviewQuestions) {
            setError("Failed to generate intreview questions. Try again.");
        } else {
            setQuestions(interviewQuestions);
        }

        setLoading(false);
    };

    return (
        <div>
            <div className="mx-auto max-w-4xl p-4">
                <form onSubmit={handleSubmit} className="space-y-4 max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-col gap-4">
                        <div className="w-full">
                            <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
                                Paste the job description here
                            </label>
                            <textarea
                                id="job-description"
                                value={description}
                                onChange={handleDescriptionChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., Proficiency in Power BI, SQL, and Excel..."
                                rows={15}
                                required
                            />
                            <div className="text-xs flex justify-between">
                                <span className="text-gray-500">{description.length}/{CHAR_LIMIT} characters</span>
                                {descWarning && <span className="text-yellow-600">Approaching limit</span>}
                            </div>
                        </div>

                        <div className="w-full">
                            <label htmlFor="questions-number" className="block text-sm font-medium text-gray-700 mb-1">
                                Input the number of questions to generate
                            </label>
                            <input
                                type="number"
                                id="questions-number"
                                min={1}
                                value={noOfQuestions}
                                max={20}
                                placeholder="e.g., 10 "
                                onChange={(e) => setNoOfQuestions(e.target.value)}
                                defaultValue={5}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="technical" className="flex items-center text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    id="technical"
                                    checked={makeTechnical}
                                    onChange={(e) => setMakeTechnical(e.target.checked)}
                                    className="mr-2"
                                />
                                Check this box if you want to make the questions more technical
                            </label>
                        </div>

                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                    >
                        {loading ? "Generating Interview Prep..." : "Generate Interview Prep"}
                    </button>
                </form>


            </div>
            {/* Display Generated Questions */}
            {questions.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>
                    <div className="grid grid-rows-1">
                        {questions.map((q, index) => (
                            <QuestionCard key={index} question={q.question} answer={q.answer} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputForm;
