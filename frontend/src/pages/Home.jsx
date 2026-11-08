import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import RoomForm from '../components/RoomForm';

export default function Home() {
    const navigate = useNavigate();
    const savedUsername = localStorage.getItem('devsync_user') || '';

    const handleCreateRoom = (username) => {
        localStorage.setItem('devsync_user', username);
        const roomId = uuidv4();
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 overflow-hidden select-none">

            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-teal-400/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 mb-6 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-medium tracking-tight">DevSync 1.0</span>
                    <span className="text-zinc-600">•</span>
                    <span>Real-time Workspace</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 text-center">
                    Code together, <br />
                    <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
                        in real time.
                    </span>
                </h1>

                <p className="text-zinc-400 text-sm sm:text-base text-center max-w-sm mb-8 leading-relaxed font-normal">
                    Lightweight, collaborative web editor with instant live preview and cloud persistence.
                </p>

                <div className="w-full bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-xl p-7 rounded-2xl shadow-2xl shadow-black/40">
                    <RoomForm initialUsername={savedUsername} onSubmit={handleCreateRoom} />
                </div>

                <p className="text-xs text-zinc-600 mt-8 tracking-wide">
                    Designed for high-speed technical interviews & pairing.
                </p>
            </div>

        </div>
    );
}