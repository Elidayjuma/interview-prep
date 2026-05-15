import React from 'react';
import { TemplateProps } from './types';

const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="bg-[#FBFAFA] p-12 max-w-[800px] mx-auto shadow-sm min-h-[1100px] text-slate-800 font-sans border-t-[12px] border-slate-900">
            {/* Elegant Header */}
            <header className="flex justify-between items-end mb-12 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tighter mb-2">{data.personalInfo.fullName.split(' ')[0]} <span className="text-slate-500 font-light">{data.personalInfo.fullName.split(' ').slice(1).join(' ')}</span></h1>
                    <h2 className="text-xl text-slate-600 font-medium tracking-wide">{data.personalInfo.careerTitle}</h2>
                </div>
                <div className="text-right text-xs space-y-1 font-medium text-slate-500 uppercase tracking-widest">
                    <p>{data.personalInfo.location}</p>
                    <p>{data.personalInfo.phone}</p>
                    <p className="text-slate-900">{data.personalInfo.email}</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="col-span-8 space-y-10">
                    <section>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                            Executive Summary
                            <div className="h-px bg-slate-200 flex-grow"></div>
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-700 font-medium">{data.summary}</p>
                    </section>

                    <section>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            Professional Experience
                            <div className="h-px bg-slate-200 flex-grow"></div>
                        </h3>
                        <div className="space-y-8">
                            {data.experience.map((exp, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{exp.position}</h4>
                                        <span className="text-xs font-bold text-slate-400">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-500 mb-4">{exp.company} | {exp.location}</div>
                                    <ul className="space-y-2">
                                        {exp.responsibilities.map((resp, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                <span className="text-slate-900 font-bold">•</span>
                                                {resp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="col-span-4 space-y-10 border-l border-slate-100 pl-8">
                    <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Competencies</h3>
                        <div className="space-y-2">
                            {data.skills.map((skill, idx) => (
                                <div key={idx} className="text-xs font-bold text-slate-700 py-1 border-b border-slate-50">{skill}</div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Education</h3>
                        <div className="space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={idx}>
                                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-tight">{edu.degree}</h4>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">{edu.institution}</div>
                                    <div className="text-[10px] text-slate-400 font-medium">{edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Digital Footprint</h3>
                        <div className="space-y-2 text-[10px] font-bold text-slate-600">
                            {data.personalInfo.linkedin && <p className="truncate hover:text-slate-900 cursor-pointer">LINKEDIN PROFILE</p>}
                            {data.personalInfo.portfolio && <p className="truncate hover:text-slate-900 cursor-pointer">PORTFOLIO.COM</p>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveTemplate;
