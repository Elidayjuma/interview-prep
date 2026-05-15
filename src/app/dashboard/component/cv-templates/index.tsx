"use client";
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeData } from './types';
import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';

interface CVTemplateSelectorProps {
    data: ResumeData;
}

const templates = [
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'professional', name: 'Professional', component: ProfessionalTemplate },
    { id: 'minimalist', name: 'Minimalist', component: MinimalistTemplate },
    { id: 'creative', name: 'Creative', component: CreativeTemplate },
    { id: 'executive', name: 'Executive', component: ExecutiveTemplate },
];

const CVTemplateSelector: React.FC<CVTemplateSelectorProps> = ({ data }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
    const [isDownloading, setIsDownloading] = useState(false);
    const cvRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!cvRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cvRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 800,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const ActiveTemplate = selectedTemplate.component;

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Template Selection Tabs */}
            <div className="flex flex-wrap justify-center gap-3 p-2 bg-gray-100/50 rounded-2xl">
                {templates.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            selectedTemplate.id === t.id
                                ? 'bg-primary text-black shadow-lg scale-105'
                                : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
                        }`}
                    >
                        {t.name}
                    </button>
                ))}
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center px-4">
                <h3 className="text-xl font-bold text-gray-900">Preview: {selectedTemplate.name} Style</h3>
                <button
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {isDownloading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    )}
                    {isDownloading ? 'Generating...' : 'Download PDF'}
                </button>
            </div>

            {/* Template Container (for capture) */}
            <div className="overflow-x-auto pb-8 flex justify-center bg-gray-50 rounded-3xl p-4 sm:p-10 border border-gray-100">
                <div ref={cvRef} className="shadow-2xl origin-top transition-transform duration-500">
                    <ActiveTemplate data={data} />
                </div>
            </div>
        </div>
    );
};

export default CVTemplateSelector;
