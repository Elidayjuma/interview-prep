import React from "react";

const features = [
    {
        title: "Smart CV Builder",
        description: "Generate professional CVs instantly, tailored to match specific job requirements and highlight your relevant skills.",
        icon: "📝",
    },
    {
        title: "Cover Letter Generator",
        description: "Create compelling cover letters that showcase your experience and demonstrate why you're the perfect fit.",
        icon: "✉️",
    },
    {
        title: "Jobs Board",
        description: "Access regularly updated job positions and apply easily using our state of the art platform.",
        icon: "🔄",
    },
    {
        title: "Interview Questions",
        description: "Get customized interview questions based on the job description, including technical and behavioral questions.",
        icon: "❓",
    },
    {
        title: "STAR Answer Framework",
        description: "Learn to structure powerful interview responses using the Situation, Task, Action, Result method.",
        icon: "⭐",
    },
    {
        title: "AI-Powered Customization",
        description: "Our advanced AI tailors all content to match your experience level and the specific job requirements.",
        icon: "🤖",
    },
    {
        title: "Quick Generation",
        description: "Create tailored documents and practice materials in minutes, not hours.",
        icon: "⚡",
    },
    {
        title: "Multiple Formats",
        description: "Export your CVs and cover letters in various formats, ready for any application system.",
        icon: "📄",
    },
    {
        title: "Industry Alignment",
        description: "Get content that matches current industry standards and employer expectations.",
        icon: "🎯",
    },

];

const FeatureCards: React.FC = () => (
    <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">What You&apos;ll Get</h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
                    >
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeatureCards;