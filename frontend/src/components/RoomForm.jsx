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
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Elon"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition shadow-lg mt-2 cursor-pointer"
            >
                Create New Room
            </button>
        </form>
    );
}