import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { addUserToRoom, removeUserFromRoom, updateRoomCode } from './roomManager.js';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // כניסה לחדר
    socket.on('join-room', ({ roomId, username }) => {
        socket.join(roomId);
        socket.roomId = roomId;
        const roomData = addUserToRoom(roomId, socket.id, username);
        // 1. שולחים לכולם בחדר את רשימת המשתמשים המעודכנת
        io.to(roomId).emit('room-users', roomData.users);
        // 2. שולחים למשתמש החדש בלבד (ספציפית לו!) את הקוד המעודכן ביותר שקיים כרגע בחדר
        socket.emit('init-code', roomData.code);
    });
    // סנכרון קוד
    socket.on('code-change', (data) => {
        // מעדכנים את הקוד בפנקס של השרת
        updateRoomCode(data.roomId, data.code);

        // משדרים לשאר האנשים בחדר
        socket.to(data.roomId).emit('receive-code', data.code);
    });
    // עזיבה
    socket.on('disconnect', () => {
        if (socket.roomId) {
            const remainingUsers = removeUserFromRoom(socket.roomId, socket.id);
            io.to(socket.roomId).emit('room-users', remainingUsers);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});