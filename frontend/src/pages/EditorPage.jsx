import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import CodeEditor from '../components/CodeEditor';
import PreviewWindow from '../components/PreviewWindow';
import RoomForm from '../components/RoomForm';
import ChatWidget from '../components/ChatWidget';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function EditorPage() {
    const { roomId } = useParams();

    const [username, setUsername] = useState(localStorage.getItem('devsync_user') || '');
    const [editorCode, setEditorCode] = useState('<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>');
    const [executedCode, setExecutedCode] = useState(editorCode);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!username) return;

        socket.emit('join-room', { roomId, username });

        socket.on('receive-code', (newCode) => {
            setEditorCode(newCode);
        });

        socket.on('init-code', (initialCode) => {
            setEditorCode(initialCode);
            setExecutedCode(initialCode);
        });

        socket.on('room-users', (roomUsers) => {
            setUsers(roomUsers);
        });

        return () => {
            socket.off('receive-code');
            socket.off('init-code');
            socket.off('room-users');
        };
    }, [roomId, username]);

    const handleRun = () => {
        setExecutedCode(editorCode);
    };

    const handleEditorChange = (newValue) => {
        setEditorCode(newValue);
        socket.emit('code-change', { roomId, code: newValue });
    };

    if (!username) {
        return (
            <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 overflow-hidden select-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-teal-400/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 mb-6 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-medium tracking-tight">Collaboration Invite</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 text-center">
                        Join Session
                    </h1>
                    <p className="text-zinc-400 text-sm text-center mb-8">
                        Enter your name to collaborate in this workspace.
                    </p>

                    <div className="w-full bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-xl p-7 rounded-2xl shadow-2xl">
                        <RoomForm
                            onSubmit={(name) => {
                                localStorage.setItem('devsync_user', name);
                                setUsername(name);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const currentUser = users.find((u) => u.username === username);

    return (
        <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden select-none">
            <Header onRun={handleRun} users={users} />

            <div className="flex-1 flex flex-row overflow-hidden">
                <div className="w-1/2 border-r border-zinc-800/80 h-full overflow-hidden bg-[#1e1e1e]">
                    <CodeEditor code={editorCode} onChange={handleEditorChange} />
                </div>

                <div className="w-1/2 h-full overflow-hidden">
                    <PreviewWindow executedCode={executedCode} />
                </div>
            </div>

            <ChatWidget socket={socket} roomId={roomId} currentUser={currentUser} />
        </div>
    );
}