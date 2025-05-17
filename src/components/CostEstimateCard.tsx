import React from "react";

export type EstimateObject = {
    breakdown: Record<string, string | number> | null;
    cost: number;
    currency: string;
};

const CostEstimateCard = ({
    estimate,
    onBack,
}: {
    estimate: EstimateObject;
    onBack: () => void;
}) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 mt-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Cost Estimate</h2>

            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Breakdown:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    {estimate.breakdown &&
                        Object.entries(estimate.breakdown).map(([key, value]) => (
                            <li key={key}>
                                <span className="font-medium text-gray-700 capitalize">
                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
                                </span>{" "}
                                {value} {estimate.currency}
                            </li>
                        ))}
                </ul>
            </div>

            <div className="text-xl font-bold text-gray-800 mb-4">
                Total: {estimate.cost?.toLocaleString()} {estimate.currency}
            </div>

            <button
                onClick={onBack}
                className="mt-4 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
            >
                Back
            </button>
        </div>
    );
};

export default CostEstimateCard;
