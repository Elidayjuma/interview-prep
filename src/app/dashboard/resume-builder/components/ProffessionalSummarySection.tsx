import { useEffect, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { upsertUserDetail, returnLogedIUser } from "@/actions/actions";

// Dummy initial user detail data (replace with real data from API/db)
const initialUserDetail = {
    careerTitle: "",
    professionalSummary: "",
    phoneNumber: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    twitterUrl: "",
};

const ProffessionalSummarySection = () => {
    const [editing, setEditing] = useState(false);
    const [userDetail, setUserDetail] = useState(initialUserDetail);
    const [form, setForm] = useState(initialUserDetail);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            // setPageLoading(true);
            let user: any = window.localStorage.getItem("user")
            user = JSON.parse(user)
            setUser(user);
            setUserDetail(user?.userDetail || initialUserDetail);
        };
        fetchUser();
    }, []);

    const handleEdit = () => {
        setForm(userDetail);
        setEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("User not found");
            return;
        }
        try {
            await upsertUserDetail({
                userId: user.id,
                ...form,
            });
            setUserDetail(form);
            const updatedUser = await returnLogedIUser();
            window.localStorage.setItem("user", JSON.stringify(updatedUser));
            setEditing(false);
        } catch (error) {
            // handle error (e.g., show a message)
            console.error(error);
        }
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