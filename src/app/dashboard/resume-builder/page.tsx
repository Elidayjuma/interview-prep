"use client";
import { useState } from "react";
import DashLayout from "@/components/Layouts/DashLayout";
import ResumeSummarySection from "./components/ProffessionalSummarySection";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import SkillsSection from "./components/SkillsSection";
import ToolsSection from "./components/ToolsSection";
import HobbiesSection from "./components/HobbiesSection";
import ResumePreviewSection from "./components/ResumePreviewSection";

export default function ResumeBuilder() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: "Preview", component: <ResumePreviewSection onGoToSummary={() => setActiveTab(1)} /> },
        { label: "Summary", component: <ResumeSummarySection /> },
        { label: "Education", component: <EducationSection /> },
        { label: "Experience", component: <ExperienceSection /> },
        { label: "Tools", component: <ToolsSection /> },
        { label: "Skills", component: <SkillsSection /> },
        { label: "Hobbies", component: <HobbiesSection /> },
    ];

    return (
        <DashLayout>
            <div className="max-w-4xl mx-auto py-8 px-2 sm:px-4">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Resume Builder (We start here)</h2>
                <div className="mb-6 flex flex-wrap sm:flex-nowrap justify-center gap-2 overflow-x-auto">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.label}
                            className={`px-3 py-2 sm:px-4 rounded-t text-sm sm:text-base whitespace-nowrap ${activeTab === idx
                                ? "bg-primary text-black"
                                : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="bg-white p-4 sm:p-6 rounded shadow">{tabs[activeTab].component}</div>
            </div>
        </DashLayout>
    );
}