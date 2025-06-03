import { useEffect, useState } from "react";
import { FaPenToSquare, FaPlus, FaTrash } from "react-icons/fa6";
import { upsertEducation, deleteEducation, returnLogedIUser } from "@/actions/actions";

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

function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const EducationSection = () => {
    const [education, setEducation] = useState<Education[]>([]);
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
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            let user: any = window.localStorage.getItem("user")
            user = JSON.parse(user)
            setUser(user);
            setEducation(user?.educations || []);
        };
        fetchUser();
    }, []);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("User not found");
            return;
        }
        try {
            const upserted = await upsertEducation({
                ...form,
                userId: user.id,
            });

            if (adding) {
                setEducation([
                    ...education,
                    {
                        ...upserted,
                        startDate: upserted.startDate ? new Date(upserted.startDate).toISOString().slice(0, 10) : "",
                        endDate: upserted.endDate ? new Date(upserted.endDate).toISOString().slice(0, 10) : "",
                        grade: upserted.grade ?? "",
                        description: upserted.description ?? "",
                    }
                ]);
                setAdding(false);
            } else if (editingId !== null) {
                setEducation(
                    education.map((edu) =>
                        edu.id === upserted.id
                            ? {
                                ...upserted,
                                startDate: upserted.startDate ? new Date(upserted.startDate).toISOString().slice(0, 10) : "",
                                endDate: upserted.endDate ? new Date(upserted.endDate).toISOString().slice(0, 10) : "",
                                grade: upserted.grade ?? "",
                                description: upserted.description ?? "",
                            }
                            : edu
                    )
                );
                setEditingId(null);
            }
            const updatedUser = await returnLogedIUser();
            window.localStorage.setItem("user", JSON.stringify(updatedUser));
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
        } catch (error) {
            alert("Failed to save education.");
            console.error(error);
        }
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

    const handleDelete = async (id: number) => {
        try {
            await deleteEducation(id);
            setEducation(education.filter((edu) => edu.id !== id));
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
                {education?.map((edu) =>
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
                                {formatDate(edu.startDate)} - {formatDate(edu.endDate) || "Present"}
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