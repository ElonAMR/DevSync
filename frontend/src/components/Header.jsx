export default function Header({ onRun }) {
    return (
        <header className="relative z-10 p-4 bg-gray-800 border-b border-gray-700 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">DevSync</h1>
            <button
                onClick={onRun}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition"
            >
                Run Code ▶
            </button>
        </header>
    );
}