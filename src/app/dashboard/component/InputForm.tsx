"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { generateCustomCv } from "@/actions/generate_custom_cv";
import { generateCoverLetter } from "@/actions/generate_cover_letter";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InputForm: React.FC = () => {
    const CHAR_LIMIT = 5000;
    const WARNING_THRESHOLD = 4800;

    const [description, setDescription] = useState<string>("");
    const [customCv, setCustomCv] = useState<string>("");
    const [customCoverLetter, setCustomCoverLetter] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [descWarning, setDescWarning] = useState(false);

    const pdfRef = useRef<HTMLDivElement>(null);

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value.slice(0, CHAR_LIMIT);
        setDescription(input);
        setDescWarning(input.length >= WARNING_THRESHOLD);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!description.trim()) {
                setError("Please enter the job description.");
                return;
            }

            // Always fetch the latest user data
            let user: any = window.localStorage.getItem("user");
            user = JSON.parse(user);

            if (!user) {
                setError("User data not found. Please complete your resume first.");
                return;
            }

            // Shape the user object to look like a CV
            const cvUser = {
                name: user.name,
                email: user.email,
                phone: user.userDetail?.phoneNumber,
                careerTitle: user.userDetail?.careerTitle,
                professionalSummary: user.userDetail?.professionalSummary,
                linkedin: user.userDetail?.linkedinUrl,
                github: user.userDetail?.githubUrl,
                portfolio: user.userDetail?.portfolioUrl,
                twitter: user.userDetail?.twitterUrl,
                education: user.educations?.map((edu: any) => ({
                    institution: edu.institution,
                    degree: edu.degree,
                    fieldOfStudy: edu.fieldOfStudy,
                    startDate: edu.startDate,
                    endDate: edu.endDate,
                    grade: edu.grade,
                    description: edu.description,
                })),
                experience: user.experiences?.map((exp: any) => ({
                    company: exp.company,
                    position: exp.position,
                    startDate: exp.startDate,
                    endDate: exp.endDate,
                    responsibilities: exp.responsibilities,
                    location: exp.location,
                })),
                skills: user.skills?.map((s: any) => s.name),
                tools: user.tools?.map((t: any) => t.name),
                hobbies: user.Hobby?.map((h: any) => h.name),
            };

            const userContext = `
                Name: ${cvUser.name}
                Email: ${cvUser.email}
                Phone: ${cvUser.phone}
                Career Title: ${cvUser.careerTitle}
                Professional Summary: ${cvUser.professionalSummary}
                LinkedIn: ${cvUser.linkedin}
                GitHub: ${cvUser.github}
                Portfolio: ${cvUser.portfolio}
                Twitter: ${cvUser.twitter}
                Education: ${cvUser.education?.map((e: any) => `${e.degree} in ${e.fieldOfStudy} at ${e.institution} (${e.startDate} - ${e.endDate})`).join("; ")}
                Experience: ${cvUser.experience?.map((e: any) => `${e.position} at ${e.company} (${e.startDate} - ${e.endDate})`).join("; ")}
                Skills: ${cvUser.skills?.join(", ")}
                Tools: ${cvUser.tools?.join(", ")}
                Hobbies: ${cvUser.hobbies?.join(", ")}
                `;

            // Pass the shaped user object as the CV context
            const customCvfromActions = await generateCustomCv(description, userContext);
            const customCoverLetterFromActions = await generateCoverLetter(description, userContext);

            if (!customCvfromActions) {
                setError("Failed to generate custom CV. Try again.");
            } else {
                setCustomCv(customCvfromActions);
                setCustomCoverLetter(customCoverLetterFromActions);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyHtmlToClipboard = async (id = "cv-content") => {
        const el = document.getElementById(id);
        if (!el) return;

        const blob = new Blob([el.innerHTML], { type: "text/html" });
        const data = [new ClipboardItem({ "text/html": blob })];

        try {
            await navigator.clipboard.write(data);
            alert("Content copied with formatting! Paste into Word.");
        } catch (err) {
            console.error("Copy failed", err);
            alert("Failed to copy CV.");
        }
    };

    return (
        <div>
            <div className="mx-auto max-w-4xl p-4">
                <form onSubmit={handleSubmit} className="space-y-4 max-w-6xl mx-auto">
                    {/* Job Description Textarea */}
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
                                rows={10}
                                required
                            />
                            <div className="text-xs flex justify-between">
                                <span className="text-gray-500">{description.length}/{CHAR_LIMIT} characters</span>
                                {descWarning && <span className="text-yellow-600">Approaching limit</span>}
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full text-black bg-primary hover:bg-secondary hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                    >
                        {loading ? "Generating Custom CV & Cover letter..." : "Generate Custom CV & Cover Letter"}
                    </button>
                </form>
            </div>

            {/* Custom CV Output */}
            {customCv && (
                <div className="mx-auto max-w-4xl p-4 mt-10">
                    <h3 className="text-xl font-semibold mb-4">Your Custom CV:</h3>
                    <div
                        ref={pdfRef}
                        id="cv-content"
                        className="bg-white border border-gray-300 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-800"

                    >
                        <ReactMarkdown>{customCv}</ReactMarkdown>
                    </div>
                    <div className="mt-4 flex justify-center gap-3">

                        <button
                            onClick={() => copyHtmlToClipboard("cv-content")}
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            )}
            {/* Custom Cover Letter Output */}
            {customCoverLetter && (
                <div className="mx-auto max-w-4xl p-4 mt-10">
                    <h3 className="text-xl font-semibold mb-4">Your Custom Cover Letter:</h3>
                    <div
                        id="cover-letter-content" // <-- set a unique id here
                        className="bg-white border border-gray-300 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-800"
                    >
                        <ReactMarkdown>{customCoverLetter}</ReactMarkdown>
                    </div>
                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            onClick={() => copyHtmlToClipboard("cover-letter-content")}
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default InputForm;
