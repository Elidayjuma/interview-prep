import React from 'react';
import { TemplateProps } from './types';

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="bg-white p-8 max-w-[800px] mx-auto shadow-sm min-h-[1100px] text-gray-800 font-sans">
            {/* Header */}
            <header className="border-b-4 border-primary pb-6 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight uppercase">{data.personalInfo.fullName}</h1>
                <h2 className="text-xl text-primary font-semibold mt-1 uppercase tracking-wide">{data.personalInfo.careerTitle}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">📧 {data.personalInfo.email}</span>
                    <span className="flex items-center gap-1">📞 {data.personalInfo.phone}</span>
                    <span className="flex items-center gap-1">📍 {data.personalInfo.location}</span>
                    {data.personalInfo.linkedin && <span className="flex items-center gap-1">🔗 LinkedIn</span>}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Summary */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-100 pb-1 mb-3">Professional Profile</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
                </section>

                {/* Experience */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-100 pb-1 mb-4">Work Experience</h3>
                    <div className="space-y-6">
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="relative pl-4 border-l-2 border-gray-100">
                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900">{exp.position}</h4>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded">{exp.startDate} — {exp.endDate}</span>
                                </div>
                                <div className="text-sm font-semibold text-primary mb-2">{exp.company} | {exp.location}</div>
                                <ul className="list-disc list-outside ml-4 space-y-1">
                                    {exp.responsibilities.map((resp, i) => (
                                        <li key={i} className="text-sm text-gray-700">{resp}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-100 pb-1 mb-4">Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                                <div className="text-sm text-primary font-medium">{edu.fieldOfStudy}</div>
                                <div className="text-sm text-gray-600">{edu.institution}</div>
                                <div className="text-xs text-gray-400 mt-1">{edu.startDate} — {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills & Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-100 pb-1 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, idx) => (
                                <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">{skill}</span>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-100 pb-1 mb-3">Tools & Tech</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.tools.map((tool, idx) => (
                                <span key={idx} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{tool}</span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ModernTemplate;
