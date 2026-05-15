"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { generateCoverLetter } from "@/actions/generate_cover_letter";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const InputForm: React.FC = () => {
    const CHAR_LIMIT = 5000;
    const WARNING_THRESHOLD = 4800;

    const [description, setDescription] = useState<string>("");
    const [coverLetter, setCoverLetter] = useState<string>("");
    const [cv, setCv] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [descWarning, setDescWarning] = useState(false);

    const pdfRef = useRef<HTMLDivElement>(null);

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value.slice(0, CHAR_LIMIT);
        setDescription(input);
        setDescWarning(input.length >= WARNING_THRESHOLD);
    };

    const handleCvChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value.slice(0, CHAR_LIMIT);
        setCv(input);
        setDescWarning(input.length >= WARNING_THRESHOLD);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);


        if (!description.trim()) {
            setError("Please enter the job description.");
            setLoading(false);
            return;
        }

        // Assuming the backend is updated to parse a text prompt into structured data
        const customCoverLetter = await generateCoverLetter(description, cv);
        if (!customCoverLetter) {
            setError("Failed to generate cover letter. Try again.");
        } else if (customCoverLetter.startsWith("ERROR:")) {
            const reason = customCoverLetter.replace("ERROR: ", "");
            if (reason === "GLOBAL_LIMIT_REACHED") {
                setError("The daily limit for guest requests has been reached globally. Please sign in to continue.");
            } else if (reason === "IP_LIMIT_REACHED") {
                setError("You have reached your daily limit of 2 guest requests. Please sign up for a free account to continue.");
            } else if (reason === "LIMIT_REACHED") {
                setError("Your monthly prompt limit has been reached. Please check your billing dashboard to upgrade.");
            } else {
                setError("Usage limit reached or an error occurred. Please sign in.");
            }
        } 
        else {
            setCoverLetter(customCoverLetter);
        }

        setLoading(false);
    };

    const downloadPDF = async () => {
        if (!pdfRef.current) return;

        const canvas = await html2canvas(pdfRef.current, {
            scale: 2, // Higher quality
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let position = 0;

        // If content is longer than one page, slice it
        if (imgHeight <= pdfHeight) {
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        } else {
            while (position < imgHeight) {
                pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
                position += pdfHeight;
                if (position < imgHeight) {
                    pdf.addPage();
                }
            }
        }

        pdf.save("custom_cv.pdf");
    };


    const copyHtmlToClipboard = async () => {
        const el = document.getElementById("cv-content");
        if (!el) return;

        const blob = new Blob([el.innerHTML], { type: "text/html" });
        const data = [new ClipboardItem({ "text/html": blob })];

        try {
            await navigator.clipboard.write(data);
            alert("CV copied with formatting! Paste into Word.");
        } catch (err) {
            console.error("Copy failed", err);
            alert("Failed to copy CV.");
        }
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

                        {/* CV Textarea */}
                        <div className="w-full">
                            <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
                                Paste your CV here
                            </label>
                            <textarea
                                id="cv"
                                value={cv}
                                onChange={handleCvChange}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                placeholder="e.g., Work experience, education, skills..."
                                rows={10}
                                required
                            />
                            <div className="text-xs flex justify-between">
                                <span className="text-gray-500">{cv.length}/{CHAR_LIMIT} characters</span>
                                {descWarning && <span className="text-yellow-600">Approaching limit</span>}
                            </div>
                        </div>

                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                    >
                        {loading ? "Generating Cover Letter..." : "Generate Cover Letter"}
                    </button>
                </form>


            </div>
            {/* Display Generated Cover letter */}
            {coverLetter && (
                <div className="mx-auto max-w-4xl p-4 mt-10">
                    <h3 className="text-xl font-semibold mb-4">Your Cover Letter:</h3>
                    <div
                        ref={pdfRef}
                        id="cv-content"
                        className="bg-white border border-gray-300 rounded-lg p-6 whitespace-pre-wrap text-sm leading-relaxed text-gray-800"

                    >
                        <ReactMarkdown>{coverLetter}</ReactMarkdown>
                    </div>
                    <div className="mt-4 flex justify-center gap-3">
                        <button
                            onClick={downloadPDF}
                            className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Download as PDF
                        </button>
                        <button
                            onClick={copyHtmlToClipboard}
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
