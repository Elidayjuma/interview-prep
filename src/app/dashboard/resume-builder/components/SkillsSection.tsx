import { useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";

type Skill = {
    id: number;
    name: string;
};

const initialSkills: Skill[] = [
    { id: 1, name: "Power BI" },
    { id: 2, name: "SQL" },
    { id: 3, name: "Excel" },
    { id: 4, name: "Python" },
];

const SkillsSection = () => {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = () => {
        setInput("");
        setAdding(true);
        setEditingId(null);
    };

    const handleEdit = (skill: Skill) => {
        setInput(skill.name);
        setEditingId(skill.id);
        setAdding(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (adding) {
            setSkills([...skills, { id: Date.now(), name: input }]);
            setAdding(false);
        } else if (editingId !== null) {
            setSkills(skills.map((s) => (s.id === editingId ? { ...s, name: input } : s)));
            setEditingId(null);
        }
        setInput("");
    };

    const handleCancel = () => {
        setAdding(false);
        setEditingId(null);
        setInput("");
    };

    const handleDelete = (id: number) => {
        setSkills(skills.filter((s) => s.id !== id));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Skills</h2>
                <button
                    type="button"
                    aria-label="Add skill"
                    onClick={handleAdd}
                    className="text-gray-500 hover:text-primary"
                >
                    <FaPlus />
                </button>
            </div>
            <ul className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) =>
                    editingId === skill.id ? (
                        <li key={skill.id}>
                            <form onSubmit={handleSave} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="border rounded px-2 py-1"
                                    required
                                    autoFocus
                                />
                                <button type="submit" className="bg-primary text-white px-2 py-1 rounded">
                                    Save
                                </button>
                                <button type="button" className="bg-gray-200 px-2 py-1 rounded" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </form>
                        </li>
                    ) : (
                        <li key={skill.id} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                            {skill.name}
                            <button
                                type="button"
                                aria-label="Edit"
                                onClick={() => handleEdit(skill)}
                                className="text-gray-500 hover:text-primary ml-1"
                            >
                                <FaPenToSquare />
                            </button>
                            <button
                                type="button"
                                aria-label="Delete"
                                onClick={() => handleDelete(skill.id)}
                                className="text-gray-500 hover:text-red-500 ml-1"
                            >
                                <FaTrash />
                            </button>
                        </li>
                    )
                )}
            </ul>
            {adding && (
                <form onSubmit={handleSave} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                        autoFocus
                        placeholder="Skill name"
                    />
                    <button type="submit" className="bg-primary text-white px-2 py-1 rounded">
                        Add
                    </button>
                    <button type="button" className="bg-gray-200 px-2 py-1 rounded" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            )}
        </section>
    );
};

export default SkillsSection;