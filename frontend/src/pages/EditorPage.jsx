import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import CodeEditor from '../components/CodeEditor';
import PreviewWindow from '../components/PreviewWindow';
import RoomForm from '../components/RoomForm';
import { io } from 'socket.io-client';
import ChatWidget from '../components/ChatWidget';

const socket = io('http://localhost:3000');

export default function EditorPage() {

    const { roomId } = useParams();

    const [username, setUsername] = useState(localStorage.getItem('devsync_user') || '');

    const [editorCode, setEditorCode] = useState('<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>');
    const [executedCode, setExecutedCode] = useState(editorCode);

    // תא זיכרון חדש לשמירת רשימת המשתתפים בחדר
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!username) return;

        socket.emit('join-room', { roomId, username });

        socket.on('receive-code', (newCode) => {
            setEditorCode(newCode);
        });

        socket.on('room-users', (roomUsers) => {
            setUsers(roomUsers);
        });
        socket.on('init-code', (initialCode) => {
            setEditorCode(initialCode);
            setExecutedCode(initialCode);
        });

        return () => {
            socket.off('receive-code');
            socket.off('room-users');
            socket.off('init-code');
        };
    }, [roomId, username]);

    const handleRun = () => {
        setExecutedCode(editorCode);
    };

    const handleEditorChange = (newValue) => {
        setEditorCode(newValue);
        socket.emit('code-change', { roomId: roomId, code: newValue });
    };

    if (!username) {
        return (
            <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
                <h1 className="text-3xl font-bold mb-4 text-blue-500">Join Room</h1>
                <p className="text-gray-400 mb-6">Enter your name to join this collaboration session</p>
                <RoomForm
                    onSubmit={(name) => {
                        localStorage.setItem('devsync_user', name);
                        setUsername(name);
                    }}
                />
            </div>
        );
    }

    const currentUser = users.find((u) => u.username === username);

    return (
        <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
            <Header onRun={handleRun} users={users} roomId={roomId} />
            <div className="flex-1 flex flex-row">
                <div className="w-1/2 border-r border-gray-700">
                    <CodeEditor code={editorCode} onChange={handleEditorChange} />
                </div>
                <div className="w-1/2">
                    <PreviewWindow executedCode={executedCode} />
                </div>
            </div>
            <ChatWidget socket={socket} roomId={roomId} currentUser={currentUser} />
        </div>
    );
}