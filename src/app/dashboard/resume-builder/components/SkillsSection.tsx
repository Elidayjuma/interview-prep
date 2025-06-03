import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";
import { upsertSkill, deleteSkill, returnLogedIUser } from "@/actions/actions";

type Skill = {
    id: number;
    name: string;
};


const SkillsSection = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [adding, setAdding] = useState(false);

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            let user: any = window.localStorage.getItem("user")
            user = JSON.parse(user)
            setUser(user);
            setSkills(user?.skills || []);
        };
        fetchUser();
    }, []);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (adding) {
                const upserted = await upsertSkill({ name: input });
                setSkills([...skills, upserted]);
                setAdding(false);
            } else if (editingId !== null) {
                const upserted = await upsertSkill({ id: editingId, name: input });
                setSkills(skills.map((s) => (s.id === editingId ? upserted : s)));
                setEditingId(null);
            }
            setInput("");
            // Optionally update user in localStorage
            const updatedUser = await returnLogedIUser();
            window.localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            alert("Failed to save skill.");
            console.error(error);
        }
    };

    const handleCancel = () => {
        setAdding(false);
        setEditingId(null);
        setInput("");
    };


    const handleDelete = async (id: number) => {
        try {
            await deleteSkill(id);
            setSkills(skills.filter((s) => s.id !== id));
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