import React from 'react';
import { TemplateProps } from './types';

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="bg-white p-12 max-w-[800px] mx-auto shadow-sm min-h-[1100px] text-gray-900 font-serif">
            {/* Centered Header */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
                <div className="text-lg text-gray-600 italic mb-4">{data.personalInfo.careerTitle}</div>
                <div className="flex justify-center gap-4 text-sm border-y border-gray-200 py-3">
                    <span>{data.personalInfo.location}</span>
                    <span>•</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>•</span>
                    <span>{data.personalInfo.email}</span>
                </div>
            </header>

            {/* Summary */}
            <section className="mb-8">
                <h3 className="text-lg font-bold border-b border-gray-800 mb-3 uppercase tracking-widest">Professional Summary</h3>
                <p className="text-sm leading-relaxed">{data.summary}</p>
            </section>

            {/* Experience */}
            <section className="mb-8">
                <h3 className="text-lg font-bold border-b border-gray-800 mb-4 uppercase tracking-widest">Professional Experience</h3>
                <div className="space-y-6">
                    {data.experience.map((exp, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-base">{exp.position}</h4>
                                <span className="text-sm italic">{exp.startDate} — {exp.endDate}</span>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-semibold text-gray-700">{exp.company}</span>
                                <span className="text-sm text-gray-600">{exp.location}</span>
                            </div>
                            <ul className="list-disc list-outside ml-5 space-y-1">
                                {exp.responsibilities.map((resp, i) => (
                                    <li key={i} className="text-sm leading-snug">{resp}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="mb-8">
                <h3 className="text-lg font-bold border-b border-gray-800 mb-4 uppercase tracking-widest">Education</h3>
                <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold">{edu.institution}</h4>
                                <span className="text-sm italic">{edu.startDate} — {edu.endDate}</span>
                            </div>
                            <div className="text-sm font-semibold">{edu.degree} in {edu.fieldOfStudy}</div>
                            {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills & Tools */}
            <section>
                <h3 className="text-lg font-bold border-b border-gray-800 mb-3 uppercase tracking-widest">Technical Skills & Expertise</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                    <p><span className="font-bold">Core Competencies:</span> {data.skills.join(", ")}</p>
                    <p><span className="font-bold">Technologies & Tools:</span> {data.tools.join(", ")}</p>
                </div>
            </section>
        </div>
    );
};

export default ProfessionalTemplate;
