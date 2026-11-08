import { useState } from 'react';
import UserList from './UserList';

export default function Header({ onRun, users = [] }) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="relative z-10 h-14 bg-zinc-950/80 border-b border-zinc-800/80 backdrop-blur-md px-4 flex justify-between items-center select-none">

            {/* צד שמאל: לוגו ורשימת משתתפים */}
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <span className="text-zinc-950 font-black text-xs tracking-tighter">D</span>
                    </div>
                    <span className="font-bold text-sm tracking-tight text-white">DevSync</span>
                </div>

                <div className="h-4 w-[1px] bg-zinc-800" />

                <UserList users={users} />
            </div>

            <div className="flex items-center gap-2.5">
                <button
                    onClick={handleCopyLink}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium py-1.5 px-3 rounded-lg transition-all duration-150 flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                >
                    {copied ? (
                        <>
                            <span className="text-emerald-400">✓</span>
                            <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <span className="text-zinc-400">🔗</span>
                            <span>Share Link</span>
                        </>
                    )}
                </button>

                <button
                    onClick={onRun}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs tracking-wide py-1.5 px-4 rounded-lg shadow-sm shadow-emerald-500/20 active:scale-95 transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                    <span>Run</span>
                    <span className="text-[10px]">▶</span>
                </button>
            </div>

        </header>
    );
}