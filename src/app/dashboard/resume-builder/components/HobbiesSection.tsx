import { useEffect, useState } from "react";
import { findHobbiesByName, addHobbyToUser, disconnectHobbyFromUser, returnLogedIUser } from "@/actions/actions";
import { FaPlus, FaTrash } from "react-icons/fa6";

type Hobby = { id: number; name: string; };

const HobbiesSection = () => {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<Hobby[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            let user: any = window.localStorage.getItem("user");
            user = JSON.parse(user);
            setUser(user);
            setHobbies(user?.Hobby || []);
        };
        fetchUser();
    }, []);

    // Autocomplete suggestions
    useEffect(() => {
        if (input.length > 0) {
            findHobbiesByName(input).then(setSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [input]);

    const handleAddHobby = async (hobbyName: string) => {
        if (!user?.id) return;
        const hobby = await addHobbyToUser(user.id, hobbyName);
        setHobbies((prev) => [...prev, hobby]);
        setInput("");
        setSuggestions([]);
        const updatedUser = await returnLogedIUser();
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const handleDelete = async (id: number) => {
        await disconnectHobbyFromUser(user.id, id);
        setHobbies(hobbies.filter((h) => h.id !== id));
        const updatedUser = await returnLogedIUser();
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <section>
            <div className="flex items-center mb-2 gap-2">
                <h2 className="text-xl font-semibold">Hobbies</h2>
            </div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    if (input.trim()) handleAddHobby(input.trim());
                }}
                className="flex gap-2 mb-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="border rounded px-2 py-1"
                    placeholder="Type to search or add hobby"
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
                            onClick={() => handleAddHobby(s.name)}
                        >
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}
            <ul className="flex flex-wrap gap-2 mb-2">
                {hobbies.map(hobby => (
                    <li key={hobby.id} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                        {hobby.name}
                        <button
                            type="button"
                            aria-label="Delete"
                            onClick={() => handleDelete(hobby.id)}
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

export default HobbiesSection;