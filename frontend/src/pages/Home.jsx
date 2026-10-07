import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // מייבא את הפונקציה שמייצרת קוד סודי

export default function Home() {
    const navigate = useNavigate();

    const createNewRoom = () => {
        const roomId = uuidv4(); // מגריל קוד ייחודי, למשל: a1b2c3d4...
        navigate(`/room/${roomId}`); // מנווט את הלקוח לכתובת של החדר החדש!
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-4 text-blue-500">DevSync</h1>
            <p className="text-gray-400 mb-8 text-lg">Real-time collaborative code editor</p>

            <button
                onClick={createNewRoom}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition shadow-lg"
            >
                Create New Room
            </button>
        </div>
    );
}