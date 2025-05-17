import { FaQuestionCircle, FaLightbulb, FaClock } from "react-icons/fa";

const FeatureCards = () => {
    const features = [
        {
            icon: <FaQuestionCircle className="text-blue-600 text-xl" />,
            title: "Realistic Questions",
            description: "Get interview questions that mirror what top companies actually ask."
        },
        {
            icon: <FaLightbulb className="text-green-600 text-xl" />,
            title: "Smart Sample Answers",
            description: "See how to frame your responses with clarity, confidence, and impact."
        },
        {
            icon: <FaClock className="text-red-600 text-xl" />,
            title: "Prep in Minutes",
            description: "Generate a tailored Q&A set instantly—no endless Googling needed."
        },
    ];



    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-10">
            {features.map((feature, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        {feature.icon}
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 text-center">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeatureCards;
