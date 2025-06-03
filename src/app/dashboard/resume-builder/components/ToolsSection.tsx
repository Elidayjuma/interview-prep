import { useEffect, useState } from "react";
import { findToolsByName, addToolToUser, disconnectToolFromUser, returnLogedIUser } from "@/actions/actions";
import { FaPlus, FaTrash } from "react-icons/fa6";

type Tool = { id: number; name: string; };

const ToolsSection = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<Tool[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            let user: any = window.localStorage.getItem("user");
            user = JSON.parse(user);
            setUser(user);
            setTools(user?.tools || []);
        };
        fetchUser();
    }, []);

    // Autocomplete suggestions
    useEffect(() => {
        if (input.length > 0) {
            findToolsByName(input).then(setSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [input]);

    const handleAddTool = async (toolName: string) => {
        if (!user?.id) return;
        const tool = await addToolToUser(user.id, toolName);
        setTools((prev) => [...prev, tool]);
        setInput("");
        setSuggestions([]);
        const updatedUser = await returnLogedIUser();
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const handleDelete = async (id: number) => {
        await disconnectToolFromUser(user.id, id);
        setTools(tools.filter((t) => t.id !== id));
        const updatedUser = await returnLogedIUser();
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Tools & Tech Stack</h2>
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) handleAddTool(input.trim());
                }}
                className="flex gap-2 mb-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Type to search or add tool"
                    autoComplete="off"
                />
                <button type="submit" className="bg-primary text-white px-2 py-1 rounded">
                    <FaPlus />
                </button>
            </form>
            {suggestions.length > 0 && (
                <ul className="border rounded bg-white absolute z-10">
                    {suggestions.map(s => (
                        <li
                            key={s.id}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAddTool(s.name)}
                        >
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}
            <ul className="flex flex-wrap gap-2 mb-2">
                {tools.map(tool => (
                    <li key={tool.id} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                        {tool.name}
                        <button
                            type="button"
                            aria-label="Delete"
                            onClick={() => handleDelete(tool.id)}
                            className="text-gray-500 hover:text-red-500 ml-1"
                        >
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default ToolsSection;