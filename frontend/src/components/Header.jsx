import { useState } from 'react';
import UserList from './UserList';

export default function Header({ onRun, users = [] }) {
    const [copied, setCopied] = useState(false);

    // פונקציה להעתקת הקישור של החדר ללוח (Clipboard)
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        // אחרי 2 שניות מחזירים את הכפתור למצב רגיל
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="relative z-10 p-4 bg-gray-800 border-b border-gray-700 shadow-md flex justify-between items-center">
            {/* צד שמאל: שם האתר ורשימת המשתמשים המחוברים */}
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold text-white tracking-wide">DevSync</h1>
                <UserList users={users} />
            </div>

            {/* צד ימין: כפתור שיתוף קישור וכפתור הרצת קוד */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleCopyLink}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium py-2 px-4 rounded transition cursor-pointer"
                >
                    {copied ? '✓ Copied!' : 'Copy Room Link 🔗'}
                </button>

                <button
                    onClick={onRun}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition shadow cursor-pointer"
                >
                    Run Code ▶
                </button>
            </div>
        </header>
    );
}