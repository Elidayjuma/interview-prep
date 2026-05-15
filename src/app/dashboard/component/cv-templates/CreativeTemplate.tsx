import React from 'react';
import { TemplateProps } from './types';

const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="bg-white max-w-[800px] mx-auto shadow-sm min-h-[1100px] text-gray-800 font-sans flex overflow-hidden">
            {/* Dark Sidebar */}
            <aside className="w-1/3 bg-[#2D3436] text-white p-8 flex flex-col">
                <div className="mb-10">
                    <div className="w-20 h-20 bg-primary rounded-full mb-6 mx-auto flex items-center justify-center text-black text-3xl font-bold">
                        {data.personalInfo.fullName.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-bold text-center leading-tight mb-2 uppercase tracking-tighter">{data.personalInfo.fullName}</h1>
                    <div className="h-1 w-12 bg-primary mx-auto"></div>
                </div>

                <div className="space-y-8 flex-grow">
                    <section>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Contact</h3>
                        <div className="space-y-3 text-sm font-light text-gray-300">
                            <p className="flex items-center gap-2 overflow-hidden text-ellipsis">📧 {data.personalInfo.email}</p>
                            <p>📞 {data.personalInfo.phone}</p>
                            <p>📍 {data.personalInfo.location}</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, idx) => (
                                <span key={idx} className="text-[10px] bg-white/10 text-white px-2 py-1 rounded">{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Tools</h3>
                        <div className="space-y-2">
                            {data.tools.map((tool, idx) => (
                                <div key={idx} className="text-xs text-gray-300 flex justify-between">
                                    <span>{tool}</span>
                                    <div className="w-12 h-1 bg-gray-600 self-center">
                                        <div className="w-3/4 h-full bg-primary"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-10 bg-white">
                <header className="mb-10">
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">{data.personalInfo.careerTitle}</h2>
                    <p className="text-gray-500 text-lg font-medium leading-relaxed italic">"{data.summary.substring(0, 150)}..."</p>
                </header>

                <div className="space-y-10">
                    {/* Experience */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Experience</h3>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={idx} className="relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{exp.position}</h4>
                                            <div className="text-primary font-bold text-sm uppercase">{exp.company}</div>
                                        </div>
                                        <span className="text-xs font-black text-gray-400">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 space-y-1">
                                        {exp.responsibilities.slice(0, 3).map((resp, i) => (
                                            <li key={i} className="text-sm text-gray-600 leading-relaxed">{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Education</h3>
                            <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>
                        <div className="space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="font-bold text-primary text-sm whitespace-nowrap">{edu.endDate}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{edu.institution}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CreativeTemplate;
