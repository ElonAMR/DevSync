import { useState } from 'react';

export default function RoomForm({ initialUsername = '', onSubmit }) {
    const [username, setUsername] = useState(initialUsername);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim()) {
            alert('Please enter your name');
            return;
        }
        onSubmit(username.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
                    Your Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="please enter your name"
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 shadow-inner"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold py-3 px-6 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-white/5 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
            >
                <span>Create Workspace</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
        </form>
    );
}