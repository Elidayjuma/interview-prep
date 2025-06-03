import { useState } from "react";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";

type Education = {
    id: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string; // ISO string for input type="date"
    endDate?: string;  // ISO string for input type="date"
    grade?: string;
    description?: string;
};

const initialEducation: Education[] = [
    {
        id: 1,
        institution: "University of Nairobi",
        degree: "BSc Computer Science",
        fieldOfStudy: "Computer Science",
        startDate: "2015-09-01",
        endDate: "2019-06-30",
        grade: "First Class",
        description: "Focused on software engineering and data analysis.",
    },
    {
        id: 2,
        institution: "Coursera",
        degree: "Diploma in Data Analytics",
        fieldOfStudy: "Data Analytics",
        startDate: "2020-01-01",
        endDate: "2020-12-31",
        grade: "Distinction",
        description: "Completed online with a focus on Power BI and SQL.",
    },
];

const EducationSection = () => {
    const [education, setEducation] = useState<Education[]>(initialEducation);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<Education>({
        id: 0,
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
    });
    const [adding, setAdding] = useState(false);

    const handleEdit = (edu: Education) => {
        setForm(edu);
        setEditingId(edu.id);
        setAdding(false);
    };

    const handleAdd = () => {
        setForm({
            id: Date.now(),
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            grade: "",
            description: "",
        });
        setEditingId(null);
        setAdding(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (adding) {
            setEducation([...education, form]);
            setAdding(false);
        } else if (editingId !== null) {
            setEducation(
                education.map((edu) => (edu.id === editingId ? form : edu))
            );
            setEditingId(null);
        }
        setForm({
            id: 0,
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            grade: "",
            description: "",
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setAdding(false);
        setForm({
            id: 0,
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            grade: "",
            description: "",
        });
    };

    const handleDelete = (id: number) => {
        setEducation(education.filter((edu) => edu.id !== id));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Education</h2>
                <button
                    type="button"
                    aria-label="Add education"
                    onClick={handleAdd}
                    className="text-gray-500 hover:text-primary"
                >
                    <FaPlus />
                </button>
            </div>
            <ul className="mb-4">
                {education.map((edu) =>
                    editingId === edu.id ? (
                        <li key={edu.id} className="mb-2">
                            <form onSubmit={handleSave} className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    name="degree"
                                    value={form.degree}
                                    onChange={handleChange}
                                    placeholder="Degree"
                                    className="border rounded px-2 py-1"
                                    required
                                />
                                <input
                                    type="text"
                                    name="institution"
                                    value={form.institution}
                                    onChange={handleChange}
                                    placeholder="Institution"
                                    className="border rounded px-2 py-1"
                                    required
                                />
                                <input
                                    type="text"
                                    name="fieldOfStudy"
                                    value={form.fieldOfStudy}
                                    onChange={handleChange}
                                    placeholder="Field of Study"
                                    className="border rounded px-2 py-1"
                                    required
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
                                <input
                                    type="text"
                                    name="grade"
                                    value={form.grade}
                                    onChange={handleChange}
                                    placeholder="Grade (optional)"
                                    className="border rounded px-2 py-1"
                                />
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Description (optional)"
                                    className="border rounded px-2 py-1"
                                    rows={2}
                                />
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
                        <li key={edu.id} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <span>
                                <strong>{edu.degree}</strong>, {edu.institution} ({edu.fieldOfStudy})<br />
                                {edu.startDate} - {edu.endDate || "Present"}
                                {edu.grade && <> | Grade: {edu.grade}</>}
                                {edu.description && <><br />{edu.description}</>}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    aria-label="Edit"
                                    onClick={() => handleEdit(edu)}
                                    className="text-gray-500 hover:text-primary"
                                >
                                    <FaPenToSquare />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Delete"
                                    onClick={() => handleDelete(edu.id)}
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
                        name="degree"
                        value={form.degree}
                        onChange={handleChange}
                        placeholder="Degree"
                        className="border rounded px-2 py-1"
                        required
                    />
                    <input
                        type="text"
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        placeholder="Institution"
                        className="border rounded px-2 py-1"
                        required
                    />
                    <input
                        type="text"
                        name="fieldOfStudy"
                        value={form.fieldOfStudy}
                        onChange={handleChange}
                        placeholder="Field of Study"
                        className="border rounded px-2 py-1"
                        required
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
                    <input
                        type="text"
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        placeholder="Grade (optional)"
                        className="border rounded px-2 py-1"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description (optional)"
                        className="border rounded px-2 py-1"
                        rows={2}
                    />
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

export default EducationSection;