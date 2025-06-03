import { useEffect, useState } from "react";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";
import { upsertExperience, deleteExperience, returnLogedIUser } from "@/actions/actions";


type Experience = {
    id: number;
    company: string;
    position: string;
    startDate: string; // ISO string for input type="date"
    endDate?: string;
    responsibilities: string[]; // Array of strings for roles/outcomes
    location?: string;
};

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


const ExperienceSection = () => {
    const [experience, setExperience] = useState<Experience[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const [form, setForm] = useState<Experience>({
        id: 0,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        responsibilities: [""],
        location: ""
    });
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            let user: any = window.localStorage.getItem("user")
            user = JSON.parse(user)
            setUser(user);
            setExperience(user?.experiences || []);
        };
        fetchUser();
    }, []);

    const handleEdit = (exp: Experience) => {
        setForm({ ...exp, responsibilities: [...exp.responsibilities] });
        setEditingId(exp.id);
        setAdding(false);
    };

    const handleAdd = () => {
        setForm({
            id: Date.now(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            responsibilities: [""],
            location: ""
        });
        setEditingId(null);
        setAdding(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleResponsibilityChange = (idx: number, value: string) => {
        const updated = [...form.responsibilities];
        updated[idx] = value;
        setForm({ ...form, responsibilities: updated });
    };

    const handleAddResponsibility = () => {
        setForm({ ...form, responsibilities: [...form.responsibilities, ""] });
    };

    const handleRemoveResponsibility = (idx: number) => {
        const updated = form.responsibilities.filter((_, i) => i !== idx);
        setForm({ ...form, responsibilities: updated });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("User not found");
            return;
        }
        try {
            const upserted: any = await upsertExperience({
                ...form,
                userId: user.id,
                // Prisma expects responsibilities as JSON, so pass as array
                responsibilities: form.responsibilities,
                startDate: form.startDate,
                endDate: form.endDate || undefined,
            });
            if (adding) {
                setExperience([
                    ...experience,
                    {
                        ...upserted,
                        startDate: upserted.startDate ? new Date(upserted.startDate).toISOString().slice(0, 10) : "",
                        endDate: upserted.endDate ? new Date(upserted.endDate).toISOString().slice(0, 10) : "",
                        responsibilities: Array.isArray(upserted.responsibilities)
                            ? upserted.responsibilities.filter((r: any): r is string => typeof r === "string" && r !== null)
                            : [],
                        location: upserted.location ?? undefined
                    },
                ]);
                setAdding(false);
            } else if (editingId !== null) {
                setExperience(
                    experience.map((exp) =>
                        exp.id === upserted.id
                            ? {
                                ...upserted,
                                startDate: upserted.startDate
                                    ? new Date(upserted.startDate).toISOString().slice(0, 10)
                                    : "",
                                endDate: upserted.endDate
                                    ? new Date(upserted.endDate).toISOString().slice(0, 10)
                                    : "",
                                responsibilities: Array.isArray(upserted.responsibilities)
                                    ? upserted.responsibilities.filter((r: any): r is string => typeof r === "string" && r !== null)
                                    : [],
                                location: upserted.location ?? undefined
                            }
                            : exp
                    )
                );
                setEditingId(null);
            }
            const updatedUser = await returnLogedIUser();
            window.localStorage.setItem("user", JSON.stringify(updatedUser));
            setForm({
                id: 0,
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                responsibilities: [""],
                location: "",
            });
        } catch (error) {
            alert("Failed to save experience.");
            console.error(error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setAdding(false);
        setForm({
            id: 0,
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            responsibilities: [""],
            location: ""
        });
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteExperience(id);
            setExperience(experience.filter((exp) => exp.id !== id));
            const updatedUser = await returnLogedIUser();
            window.localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            alert("Failed to delete education.");
            console.error(error);
        }
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Experience</h2>
                <button
                    type="button"
                    aria-label="Add experience"
                    onClick={handleAdd}
                    className="text-gray-500 hover:text-primary"
                >
                    <FaPlus />
                </button>
            </div>
            <ul className="mb-4">
                {experience.map((exp) =>
                    editingId === exp.id ? (
                        <li key={exp.id} className="mb-2">
                            <form onSubmit={handleSave} className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    name="position"
                                    value={form.position}
                                    onChange={handleChange}
                                    placeholder="Position"
                                    className="border rounded px-2 py-1"
                                    required
                                />
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    placeholder="Company"
                                    className="border rounded px-2 py-1"
                                    required
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Location (optional)"
                                    className="border rounded px-2 py-1"
                                />
                                <div className="flex gap-2">
                                    <div>
                                        <label className="block text-xs">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={form.startDate}
                                            onChange={handleChange}
                                            className="border rounded px-2 py-1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs">End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={form.endDate || ""}
                                            onChange={handleChange}
                                            className="border rounded px-2 py-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">Responsibilities / Achievements</label>
                                    {form.responsibilities.map((resp, idx) => (
                                        <div key={idx} className="flex gap-2 mb-1">
                                            <input
                                                type="text"
                                                value={resp}
                                                onChange={(e) => handleResponsibilityChange(idx, e.target.value)}
                                                placeholder={`Responsibility #${idx + 1}`}
                                                className="border rounded px-2 py-1 flex-1"
                                                required
                                            />
                                            {form.responsibilities.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="text-red-500"
                                                    onClick={() => handleRemoveResponsibility(idx)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="text-primary text-xs mt-1"
                                        onClick={handleAddResponsibility}
                                    >
                                        + Add Responsibility
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-primary text-white px-3 py-1 rounded">
                                        Save
                                    </button>
                                    <button type="button" className="bg-gray-200 px-3 py-1 rounded" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </li>
                    ) : (
                        <li key={exp.id} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <span>
                                <strong>{exp.position}</strong> at {exp.company} ({formatDate(exp.startDate)} - {formatDate(exp.endDate) || "Present"})
                                {exp.location && <> | {exp.location}</>}
                                <p><strong>Roles:</strong></p>
                                <ul className="list-disc ml-6">
                                    {exp.responsibilities.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    aria-label="Edit"
                                    onClick={() => handleEdit(exp)}
                                    className="text-gray-500 hover:text-primary"
                                >
                                    <FaPenToSquare />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Delete"
                                    onClick={() => handleDelete(exp.id)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    )
                )}
            </ul>
            {adding && (
                <form onSubmit={handleSave} className="flex flex-col gap-2 mb-2">
                    <input
                        type="text"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        placeholder="Position"
                        className="border rounded px-2 py-1"
                        required
                    />
                    <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company"
                        className="border rounded px-2 py-1"
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Location (optional)"
                        className="border rounded px-2 py-1"
                    />
                    <div className="flex gap-2">
                        <div>
                            <label className="block text-xs">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate || ""}
                                onChange={handleChange}
                                className="border rounded px-2 py-1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs mb-1">Responsibilities / Achievements</label>
                        {form.responsibilities.map((resp, idx) => (
                            <div key={idx} className="flex gap-2 mb-1">
                                <input
                                    type="text"
                                    value={resp}
                                    onChange={(e) => handleResponsibilityChange(idx, e.target.value)}
                                    placeholder={`Responsibility #${idx + 1}`}
                                    className="border rounded px-2 py-1 flex-1"
                                    required
                                />
                                {form.responsibilities.length > 1 && (
                                    <button
                                        type="button"
                                        className="text-red-500"
                                        onClick={() => handleRemoveResponsibility(idx)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="text-primary text-xs mt-1"
                            onClick={handleAddResponsibility}
                        >
                            + Add Responsibility
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-primary text-white px-3 py-1 rounded">
                            Add
                        </button>
                        <button type="button" className="bg-gray-200 px-3 py-1 rounded" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default ExperienceSection;