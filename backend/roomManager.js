import Room from './models/Room.js';

const USER_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
];

// 1. Objects Of Rooms In RAM
const rooms = {};

// 2. Dictionary of stopwatches for every room 
const saveTimers = {};

const DEFAULT_CODE = '<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>';

// Adding User In Room 
export async function addUserToRoom(roomId, socketId, username) {
    if (!rooms[roomId]) {
        let initialCode = DEFAULT_CODE;

        try {
            // Checking whether the room was previously saved to the MongoDB
            const savedRoom = await Room.findOne({ roomId });
            if (savedRoom) {
                initialCode = savedRoom.code;
                console.log(`Room Id : ${roomId} Import From MongoDB Sucsses!`);
            }
        } catch (err) {
            console.error('Error Import Room From-MongoDB:', err.message);
        }

        rooms[roomId] = {
            users: [],
            code: initialCode
        };
    }

    // Protection against user duplication
    const existingSocket = rooms[roomId].users.find(u => u.id === socketId);
    if (existingSocket) {
        existingSocket.username = username;
        return rooms[roomId];
    }

    const existingUserByName = rooms[roomId].users.find(u => u.username === username);
    if (existingUserByName) {
        existingUserByName.id = socketId;
        return rooms[roomId];
    }

    const color = USER_COLORS[rooms[roomId].users.length % USER_COLORS.length];
    rooms[roomId].users.push({ id: socketId, username, color });

    return rooms[roomId];
}

// Update Code In Editor With Debounce
export function updateRoomCode(roomId, newCode) {
    if (!rooms[roomId]) return;

    // Instantly Update The Memory Of The RAM 
    rooms[roomId].code = newCode;

    // --- Debounce ---
    if (saveTimers[roomId]) {
        clearTimeout(saveTimers[roomId]);
    }

    saveTimers[roomId] = setTimeout(async () => {
        try {
            await Room.findOneAndUpdate(
                { roomId },
                { code: newCode, updatedAt: new Date() },
                { upsert: true }
            );
            console.log(`[Auto-Save] Room Id :${roomId} Saved in MongoDB Sucsses!`);
        } catch (err) {
            console.error('Error Saving Code To MongoDB:', err.message);
        } finally {
            delete saveTimers[roomId];
        }
    }, 2000);
}

// Removing a User Left
export async function removeUserFromRoom(roomId, socketId) {
    if (!rooms[roomId]) return [];

    rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socketId);

    if (rooms[roomId].users.length === 0) {
        if (saveTimers[roomId]) {
            clearTimeout(saveTimers[roomId]);
            delete saveTimers[roomId];
        }

        try {
            await Room.findOneAndUpdate(
                { roomId },
                { code: rooms[roomId].code, updatedAt: new Date() },
                { upsert: true }
            );
            console.log(`[Final-Save] Room: ${roomId} Emptyed and finally saved in MongoDB.`);
        } catch (err) {
            console.error('Error In Final Saved:', err.message);
        }

        delete rooms[roomId];
        return [];
    }

    return rooms[roomId].users;
}