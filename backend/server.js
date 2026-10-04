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
    console.log(`משתמש חדש התחבר לאתר! מזהה: ${socket.id}`);

    socket.on('code-change', (newCode) => {
        socket.broadcast.emit('receive-code', newCode);
    });

    socket.on('disconnect', () => {
        console.log(`המשתמש עזב את האתר: ${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`השרת רץ בהצלחה ומאזין על פורט ${PORT}`);
});