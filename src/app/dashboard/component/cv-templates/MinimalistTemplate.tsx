import React from 'react';
import { TemplateProps } from './types';

const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
    return (
        <div className="bg-white p-16 max-w-[800px] mx-auto shadow-sm min-h-[1100px] text-zinc-800 font-sans">
            {/* Minimal Header */}
            <header className="mb-16">
                <h1 className="text-5xl font-light tracking-tight mb-2 text-zinc-900">{data.personalInfo.fullName}</h1>
                <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-400 font-medium mb-6">{data.personalInfo.careerTitle}</h2>
                <div className="h-px bg-zinc-100 w-full mb-6"></div>
                <div className="flex flex-wrap gap-8 text-[11px] uppercase tracking-widest text-zinc-500 font-medium">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.location}</span>
                </div>
            </header>

            <div className="space-y-12">
                {/* Summary */}
                <section>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 pt-1">About</div>
                        <div className="col-span-9">
                            <p className="text-sm leading-relaxed font-light">{data.summary}</p>
                        </div>
                    </div>
                </section>

                {/* Experience */}
                <section>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 pt-1">Experience</div>
                        <div className="col-span-9 space-y-10">
                            {data.experience.map((exp, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-medium text-lg text-zinc-900">{exp.position}</h4>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-4">{exp.company}</div>
                                    <ul className="space-y-2">
                                        {exp.responsibilities.map((resp, i) => (
                                            <li key={i} className="text-sm font-light leading-relaxed pl-4 border-l border-zinc-100 italic">{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Education */}
                <section>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 pt-1">Education</div>
                        <div className="col-span-9 space-y-6">
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-zinc-900">{edu.degree}</h4>
                                        <div className="text-sm text-zinc-500 font-light">{edu.institution}</div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium">{edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 pt-1">Expertise</div>
                        <div className="col-span-9">
                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                {data.skills.concat(data.tools).map((item, idx) => (
                                    <span key={idx} className="text-xs font-light text-zinc-600">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MinimalistTemplate;
