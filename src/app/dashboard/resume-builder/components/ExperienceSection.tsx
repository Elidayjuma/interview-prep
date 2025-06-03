import { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";

type Experience = {
    id: number;
    company: string;
    position: string;
    startDate: string; // ISO string for input type="date"
    endDate?: string;
    responsibilities: string[]; // Array of strings for roles/outcomes
    location?: string;
};

const initialExperience: Experience[] = [
    {
        id: 1,
        company: "TechCorp",
        position: "Data Analyst",
        startDate: "2021-01-01",
        endDate: "",
        responsibilities: [
            "Developed dashboards in Power BI for sales and marketing teams.",
            "Automated reporting processes, reducing manual work by 30%."
        ],
        location: "Nairobi, Kenya"
    },
    {
        id: 2,
        company: "DataWorks",
        position: "Junior Analyst",
        startDate: "2019-01-01",
        endDate: "2021-01-01",
        responsibilities: [
            "Supported data cleaning and ETL operations for client projects."
        ],
        location: "Remote"
    }
];

const ExperienceSection = () => {
    const [experience, setExperience] = useState<Experience[]>(initialExperience);
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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (adding) {
            setExperience([...experience, form]);
            setAdding(false);
        } else if (editingId !== null) {
            setExperience(
                experience.map((exp) => (exp.id === editingId ? form : exp))
            );
            setEditingId(null);
        }
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

    const handleDelete = (id: number) => {
        setExperience(experience.filter((exp) => exp.id !== id));
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
                                <strong>{exp.position}</strong> at {exp.company} ({exp.startDate} - {exp.endDate || "Present"})
                                {exp.location && <> | {exp.location}</>}
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