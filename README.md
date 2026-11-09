# DevSync — Real-Time Collaborative Code Workspace

![DevSync Banner](https://img.shields.io/badge/Status-Live_Production-emerald?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Demo-dev--sync--pink.vercel.app-blue?style=for-the-badge&logo=vercel)](https://dev-sync-pink.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-zinc?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern, high-performance collaborative web editor inspired by Apple and Linear design principles. Write, test, and synchronize HTML/CSS/JavaScript in real-time with isolated shareable rooms, live user presence, floating chat, and resilient cloud persistence.

---

## 🚀 Live Demo

Experience DevSync live across multiple devices:  
👉 **[https://dev-sync-pink.vercel.app/](https://dev-sync-pink.vercel.app/)**

---

## ✨ Key Features

- **⚡ Instant Real-Time Synchronization**: Built on Socket.IO for sub-millisecond code broadcast across all participants in a room.
- **🔒 Isolated Capability Rooms**: Cryptographically secure, unguessable rooms generated using UUID v4 for frictionless collaboration.
- **👥 Live User Presence & Avatars**: Dynamic member tracking with personalized colors, active indicators, and real-time join/leave detection.
- **💬 Floating Real-Time Chat**: macOS-inspired frosted glass popover widget with auto-scroll and sender attribution.
- **🛡️ Sandboxed Live Execution**: Safe code execution inside an isolated iframe with a hijacked, colorized JavaScript console output.
- **💾 Dual-Tier Cloud Persistence**: 
  - **In-Memory (RAM)**: Lightning-fast transient state for connected peers.
  - **Cold Storage (MongoDB Atlas)**: Automatic debounced background saving (2-second idle window) and final flush on room exit.
- **🎨 Refined Developer Aesthetic**: Minimalist dark theme styled with Tailwind CSS, frosted glassmorphism, and responsive micro-interactions.

---

## 🏗️ Architecture & System Design

```
                     ┌────────────────────────────────┐
                     │         Browser Clients        │
                     │  (Desktop, Tablet, Mobile)     │
                     └──────────────┬─────────────────┘
                                    │ WebSockets (Socket.IO)
                                    ▼
                     ┌────────────────────────────────┐
                     │    Node.js / Express Server    │
                     │          (Render.com)          │
                     └──────────────┬─────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              ▼                                           ▼
   ┌──────────────────────┐                    ┌──────────────────────┐
   │ In-Memory Store(RAM) │                    │  MongoDB Atlas Cloud │
   │  - Active Rooms      │                    │  - Debounced Saves   │
   │  - Connected Sockets │                    │  - Cold Room Loading │
   │  - Transient Code    │                    │  - Persistent Docs   │
   └──────────────────────┘                    └──────────────────────┘
```

### The Debounced Persistence Strategy
To prevent high I/O saturation on the database, DevSync decouples typing latency from disk persistence:
1. Every keystroke is immediately committed to the server's **RAM** and broadcasted to room participants.
2. An asynchronous **2-second debounce timer** resets on each keystroke.
3. Upon a typing pause or room vacation, a single atomic `findOneAndUpdate` with `upsert: true` syncs the document state to **MongoDB Atlas**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Editor Engine**: Microsoft Monaco Editor (`@monaco-editor/react`)
- **Styling**: Tailwind CSS v4 (Glassmorphism & Apple-inspired Dark Palette)
- **Routing**: React Router DOM v7
- **Client Networking**: `socket.io-client`
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Real-Time Engine**: Socket.IO
- **Database ODM**: Mongoose 9
- **Cloud Database**: MongoDB Atlas
- **Deployment**: Render

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or free MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/ElonAMR/DevSync.git
cd DevSync
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```

### 3. Configure Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
