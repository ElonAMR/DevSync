import { useState, useEffect } from 'react';
import Header from '../components/Header'; // שים לב לנקודותיים שמוציאות אותנו תיקייה אחת החוצה
import CodeEditor from '../components/CodeEditor';
import PreviewWindow from '../components/PreviewWindow';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function EditorPage() {
    const [editorCode, setEditorCode] = useState('<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>');
    const [executedCode, setExecutedCode] = useState(editorCode);

    useEffect(() => {
        socket.on('receive-code', (newCode) => {
            setEditorCode(newCode);
        });
        return () => {
            socket.off('receive-code');
        };
    }, []);

    const handleRun = () => {
        setExecutedCode(editorCode);
    };

    const handleEditorChange = (newValue) => {
        setEditorCode(newValue);
        socket.emit('code-change', newValue);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
            <Header onRun={handleRun} />
            <div className="flex-1 flex flex-row">
                <div className="w-1/2 border-r border-gray-700">
                    <CodeEditor code={editorCode} onChange={handleEditorChange} />
                </div>
                <div className="w-1/2">
                    <PreviewWindow executedCode={executedCode} />
                </div>
            </div>
        </div>
    );
}