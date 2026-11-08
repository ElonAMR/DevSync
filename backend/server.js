import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { addUserToRoom, removeUserFromRoom, updateRoomCode } from './roomManager.js';

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    //join room 
    socket.on('join-room', async ({ roomId, username }) => {
        socket.join(roomId);
        socket.roomId = roomId;
        const roomData = await addUserToRoom(roomId, socket.id, username);
        io.to(roomId).emit('room-users', roomData.users);
        socket.emit('init-code', roomData.code);
    });
    //async code
    socket.on('code-change', (data) => {
        updateRoomCode(data.roomId, data.code);
        socket.to(data.roomId).emit('receive-code', data.code);
    });
    //send chat message
    socket.on('send-message', (data) => {
        io.to(data.roomId).emit('receive-message', data);
    });
    //disconnect from room (asyncawait)
    socket.on('disconnect', async () => {
        if (socket.roomId) {
            const remainingUsers = await removeUserFromRoom(socket.roomId, socket.id);
            io.to(socket.roomId).emit('room-users', remainingUsers);
        }
    });
});

const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devsync';
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connect To MongoDB Sucsses!');
    })
    .catch((err) => {
        console.error('Error Connect To MongoDB:', err.message);
    });

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});