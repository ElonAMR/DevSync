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
        <div className="fixed bottom-5 right-5 z-50">

            {isOpen && (
                <div className="w-80 h-[380px] bg-zinc-900/95 border border-zinc-800/80 rounded-2xl flex flex-col mb-3 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-200">

                    <div className="px-4 py-3 bg-zinc-950/80 border-b border-zinc-800/80 flex justify-between items-center select-none">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-200 tracking-tight">Room Chat</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-400 hover:text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-2.5">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs gap-1">
                                <span>💬</span>
                                <span>No messages yet.</span>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="bg-zinc-800/50 border border-zinc-800/80 p-2.5 rounded-xl text-zinc-100 text-xs">
                                    <span style={{ color: msg.color }} className="font-semibold block mb-0.5 tracking-tight">
                                        {msg.sender}
                                    </span>
                                    <span className="text-zinc-300 leading-relaxed break-words">{msg.text}</span>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-2.5 bg-zinc-950/80 border-t border-zinc-800/80 flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 px-3 py-1.5 rounded-lg text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-white hover:bg-zinc-200 text-zinc-950 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                            Send
                        </button>
                    </form>

                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 rounded-full flex items-center justify-center text-lg shadow-2xl backdrop-blur-md transition-all duration-150 active:scale-95 hover:scale-105 cursor-pointer"
                title="Open Chat"
            >
                💬
            </button>

        </div>
    );
}