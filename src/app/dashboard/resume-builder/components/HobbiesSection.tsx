import { useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";

type Hobby = {
    id: number;
    name: string;
};

const initialHobbies: Hobby[] = [
    { id: 1, name: "Cycling" },
    { id: 2, name: "Photography" },
    { id: 3, name: "Chess" },
];

const HobbiesSection = () => {
    const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = () => {
        setInput("");
        setAdding(true);
        setEditingId(null);
    };

    const handleEdit = (hobby: Hobby) => {
        setInput(hobby.name);
        setEditingId(hobby.id);
        setAdding(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (adding) {
            setHobbies([...hobbies, { id: Date.now(), name: input }]);
            setAdding(false);
        } else if (editingId !== null) {
            setHobbies(hobbies.map((h) => (h.id === editingId ? { ...h, name: input } : h)));
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
        setHobbies(hobbies.filter((h) => h.id !== id));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Hobbies</h2>
                <button
                    type="button"
                    aria-label="Add hobby"
                    onClick={handleAdd}
                    className="text-gray-500 hover:text-primary"
                >
                    <FaPlus />
                </button>
            </div>
            <ul className="flex flex-wrap gap-2 mb-2">
                {hobbies.map((hobby) =>
                    editingId === hobby.id ? (
                        <li key={hobby.id}>
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
                        <li key={hobby.id} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                            {hobby.name}
                            <button
                                type="button"
                                aria-label="Edit"
                                onClick={() => handleEdit(hobby)}
                                className="text-gray-500 hover:text-primary ml-1"
                            >
                                <FaPenToSquare />
                            </button>
                            <button
                                type="button"
                                aria-label="Delete"
                                onClick={() => handleDelete(hobby.id)}
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
                        placeholder="Hobby name"
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

export default HobbiesSection;