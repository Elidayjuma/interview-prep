import { useEffect, useState } from "react";
import { findSkillsByName, addSkillToUser, disconnectSkillFromUser, returnLogedIUser } from "@/actions/actions";
import { FaPlus, FaTrash } from "react-icons/fa6";

type Skill = { id: number; name: string; };

const SkillsSection = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<Skill[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            let user: any = window.localStorage.getItem("user");
            user = JSON.parse(user);
            setUser(user);
            setSkills(user?.skills || []);
        };
        fetchUser();
    }, []);

    // Autocomplete suggestions
    useEffect(() => {
        if (input.length > 0) {
            findSkillsByName(input).then(setSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [input]);

    const handleAddSkill = async (skillName: string) => {
        if (!user?.id) return;
        const skill = await addSkillToUser(user.id, skillName);
        setSkills((prev) => [...prev, skill]);
        setInput("");
        setSuggestions([]);
        const updatedUser = await returnLogedIUser();
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const handleDelete = async (id: number) => {
        await disconnectSkillFromUser(user.id, id);
        setSkills(skills.filter((s) => s.id !== id));
        const updatedUser = await returnLogedIUser();
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Skills</h2>
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) handleAddSkill(input.trim());
                }}
                className="flex gap-2 mb-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Type to search or add skill"
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
                            onClick={() => handleAddSkill(s.name)}
                        >
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}
            <ul className="flex flex-wrap gap-2 mb-2">
                {skills.map(skill => (
                    <li key={skill.id} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                        {skill.name}
                        <button
                            type="button"
                            aria-label="Delete"
                            onClick={() => handleDelete(skill.id)}
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

export default SkillsSection;