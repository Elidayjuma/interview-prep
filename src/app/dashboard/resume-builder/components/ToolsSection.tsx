import { useState } from "react";
import { FaPlus, FaTrash, FaPenToSquare } from "react-icons/fa6";

type Tool = {
    id: number;
    name: string;
};

const initialTools: Tool[] = [
    { id: 1, name: "Tableau" },
    { id: 2, name: "Jupyter Notebook" },
    { id: 3, name: "Git" },
    { id: 4, name: "VS Code" },
];

const ToolsSection = () => {
    const [tools, setTools] = useState<Tool[]>(initialTools);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdd = () => {
        setInput("");
        setAdding(true);
        setEditingId(null);
    };

    const handleEdit = (tool: Tool) => {
        setInput(tool.name);
        setEditingId(tool.id);
        setAdding(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (adding) {
            setTools([...tools, { id: Date.now(), name: input }]);
            setAdding(false);
        } else if (editingId !== null) {
            setTools(tools.map((t) => (t.id === editingId ? { ...t, name: input } : t)));
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
        setTools(tools.filter((t) => t.id !== id));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Tools & Tech Stack</h2>
                <button
                    type="button"
                    aria-label="Add tool"
                    onClick={handleAdd}
                    className="text-gray-500 hover:text-primary"
                >
                    <FaPlus />
                </button>
            </div>
            <ul className="flex flex-wrap gap-2 mb-2">
                {tools.map((tool) =>
                    editingId === tool.id ? (
                        <li key={tool.id}>
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
                        <li key={tool.id} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                            {tool.name}
                            <button
                                type="button"
                                aria-label="Edit"
                                onClick={() => handleEdit(tool)}
                                className="text-gray-500 hover:text-primary ml-1"
                            >
                                <FaPenToSquare />
                            </button>
                            <button
                                type="button"
                                aria-label="Delete"
                                onClick={() => handleDelete(tool.id)}
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
                        placeholder="Tool name"
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

export default ToolsSection;