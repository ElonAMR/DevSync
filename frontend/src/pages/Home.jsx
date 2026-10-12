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
        <div className="h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4 text-blue-500">DevSync</h1>
            <p className="text-gray-400 mb-8 text-lg text-center">Real-time collaborative code editor</p>

            <RoomForm initialUsername={savedUsername} onSubmit={handleCreateRoom} />
        </div>
    );
}