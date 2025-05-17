import React from 'react';

type QuestionCardProps = {
    question: string;
    answer: string;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer }) => {
    return (
        <div className="border rounded-xl p-4 shadow-md bg-white mb-4">
            <h3 className="font-semibold text-lg text-gray-800">{question}</h3>
            <p className="mt-2 text-gray-600">{answer}</p>
        </div>
    );
};

export default QuestionCard;
