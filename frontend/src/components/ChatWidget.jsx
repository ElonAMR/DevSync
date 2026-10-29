import { useState, useEffect, useRef } from 'react';

export default function ChatWidget({ socket, roomId, currentUser }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    useEffect(() => {
        socket.on('receive-message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => socket.off('receive-message');
    }, [socket]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        socket.emit('send-message', {
            roomId,
            sender: currentUser?.username || 'Guest',
            color: currentUser?.color || '#3B82F6',
            text: text.trim()
        });

        setText('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="w-80 h-96 bg-gray-800 border border-gray-700 rounded-xl flex flex-col mb-3 shadow-2xl">

                    <div className="p-3 bg-gray-900 border-b border-gray-700 flex justify-between items-center text-white font-bold">
                        <span>💬 Room Chat</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
                        {messages.map((msg, index) => (
                            <div key={index} className="bg-gray-700 p-2 rounded text-white text-sm">
                                <span style={{ color: msg.color }} className="font-bold text-xs block mb-1">
                                    {msg.sender}:
                                </span>
                                <span>{msg.text}</span>
                            </div>
                        ))}

                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-2 bg-gray-900 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 text-sm focus:outline-none"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold cursor-pointer">
                            Send
                        </button>
                    </form>

                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer"
            >
                💬
            </button>
        </div>
    );
}