import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { addUserToRoom, removeUserFromRoom } from './roomManager.js';

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
    // 1. כניסה לחדר
    socket.on('join-room', ({ roomId, username }) => {
        socket.join(roomId);
        socket.roomId = roomId; // שומרים על הסוקט את שם החדר שלו

        // מוסיפים לפנקס ושולחים לכל מי שבחדר את הרשימה המעודכנת
        const updatedUsers = addUserToRoom(roomId, socket.id, username);
        io.to(roomId).emit('room-users', updatedUsers);
    });

    // 2. סנכרון קוד
    socket.on('code-change', (data) => {
        socket.to(data.roomId).emit('receive-code', data.code);
    });

    // 3. יציאה מהחדר
    socket.on('disconnect', () => {
        if (socket.roomId) {
            // מסירים מהפנקס ושולחים למי שנשאר את הרשימה החדשה
            const remainingUsers = removeUserFromRoom(socket.roomId, socket.id);
            io.to(socket.roomId).emit('room-users', remainingUsers);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});