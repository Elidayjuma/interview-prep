import { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";

// Dummy initial user detail data (replace with real data from API/db)
const initialUserDetail = {
    careerTitle: "Senior Data Analyst",
    professionalSummary:
        "Experienced Data Analyst with 5+ years in the tech industry. Skilled in Power BI, SQL, and Excel. Passionate about transforming data into actionable insights.",
    phoneNumber: "+254 700 123456",
    linkedinUrl: "https://linkedin.com/in/example",
    githubUrl: "https://github.com/example",
    portfolioUrl: "https://portfolio.example.com",
    twitterUrl: "https://twitter.com/example",
};

const ProffessionalSummarySection = () => {
    const [editing, setEditing] = useState(false);
    const [userDetail, setUserDetail] = useState(initialUserDetail);
    const [form, setForm] = useState(initialUserDetail);

    const handleEdit = () => {
        setForm(userDetail);
        setEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUserDetail(form);
        setEditing(false);
        // Here you would also update the backend via an API call
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Professional Summary</h2>
                {!editing && (
                    <button
                        type="button"
                        aria-label="Edit summary"
                        onClick={handleEdit}
                        className="text-gray-500 hover:text-primary"
                    >
                        <FaPenToSquare />
                    </button>
                )}
            </div>
            {editing ? (
                <form onSubmit={handleSave} className="space-y-2">
                    <input
                        type="text"
                        name="careerTitle"
                        value={form.careerTitle || ""}
                        onChange={handleChange}
                        placeholder="Career Title (optional)"
                        className="w-full border rounded p-2"
                    />
                    <textarea
                        name="professionalSummary"
                        className="w-full border rounded p-2"
                        rows={4}
                        value={form.professionalSummary || ""}
                        onChange={handleChange}
                        placeholder="Professional Summary"
                        required
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber || ""}
                        onChange={handleChange}
                        placeholder="Phone Number (optional)"
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="url"
                        name="linkedinUrl"
                        value={form.linkedinUrl || ""}
                        onChange={handleChange}
                        placeholder="LinkedIn URL (optional)"
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="url"
                        name="githubUrl"
                        value={form.githubUrl || ""}
                        onChange={handleChange}
                        placeholder="GitHub URL (optional)"
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="url"
                        name="portfolioUrl"
                        value={form.portfolioUrl || ""}
                        onChange={handleChange}
                        placeholder="Portfolio URL (optional)"
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="url"
                        name="twitterUrl"
                        value={form.twitterUrl || ""}
                        onChange={handleChange}
                        placeholder="Twitter URL (optional)"
                        className="w-full border rounded p-2"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-primary text-white px-3 py-1 rounded"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="bg-gray-200 px-3 py-1 rounded"
                            onClick={() => setEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    {userDetail.careerTitle && (
                        <p className="font-semibold">{userDetail.careerTitle}</p>
                    )}
                    <p>{userDetail.professionalSummary}</p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {userDetail.phoneNumber && <div>📞 {userDetail.phoneNumber}</div>}
                        {userDetail.linkedinUrl && (
                            <div>
                                <a href={userDetail.linkedinUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                    LinkedIn
                                </a>
                            </div>
                        )}
                        {userDetail.githubUrl && (
                            <div>
                                <a href={userDetail.githubUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                    GitHub
                                </a>
                            </div>
                        )}
                        {userDetail.portfolioUrl && (
                            <div>
                                <a href={userDetail.portfolioUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                    Portfolio
                                </a>
                            </div>
                        )}
                        {userDetail.twitterUrl && (
                            <div>
                                <a href={userDetail.twitterUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                    Twitter
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProffessionalSummarySection;