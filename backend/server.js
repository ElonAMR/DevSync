import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

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
    console.log(`a new user has connected to the site! id: ${socket.id}`);

    // 1. כשהמשתמש מבקש להיכנס לחדר הספציפי
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`user id: ${socket.id} joined room: ${roomId}`);
    });

    // 2. כשהמשתמש מקליד, הוא שולח לנו חבילה (data) שכוללת גם את הקוד וגם את שם החדר
    socket.on('code-change', (data) => {
        socket.to(data.roomId).emit('receive-code', data.code);
    });

    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`השרת רץ בהצלחה ומאזין על פורט ${PORT}`);
});