import Room from './models/Room.js'; // מייבאים את מודל החדר ב-MongoDB

const USER_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
];

// 1. פנקס החדרים בזיכרון המהיר (RAM)
const rooms = {};

// 2. מילון של שעוני עצר לכל חדר (עבור ה-Debounce)
const saveTimers = {};

const DEFAULT_CODE = '<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>';

// הוספת משתמש לחדר (בודק קודם ב-MongoDB אם החדר קיים בענן!)
export async function addUserToRoom(roomId, socketId, username) {
    // אם החדר עדיין לא קיים בזיכרון ה-RAM (למשל המשתמש הראשון שנכנס היום)
    if (!rooms[roomId]) {
        let initialCode = DEFAULT_CODE;

        try {
            // מחפשים האם החדר נשמר בעבר בענן ב-MongoDB
            const savedRoom = await Room.findOne({ roomId });
            if (savedRoom) {
                initialCode = savedRoom.code; // שולפים את הקוד השמור מהענן!
                console.log(`קוד החדר ${roomId} נטען בהצלחה מ-MongoDB!`);
            }
        } catch (err) {
            console.error('שגיאה בשליפת חדר מ-MongoDB:', err.message);
        }

        rooms[roomId] = {
            users: [],
            code: initialCode
        };
    }

    // הגנה מפני שכפול משתמשים
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

// עדכון קוד בעורך עם מנגנון Debounce (שמירה שקטה ל-MongoDB אחרי 2 שניות של שקט)
export function updateRoomCode(roomId, newCode) {
    if (!rooms[roomId]) return;

    // מעדכנים מיד את זיכרון ה-RAM (עבור שאר המשתמשים בחדר)
    rooms[roomId].code = newCode;

    // --- מנגנון ה-Debounce ---
    // 1. אם כבר פועל שעון עצר שממתין – מבטלים ומאפסים אותו!
    if (saveTimers[roomId]) {
        clearTimeout(saveTimers[roomId]);
    }

    // 2. מפעילים שעון עצר חדש ל-2 שניות
    saveTimers[roomId] = setTimeout(async () => {
        try {
            // כותבים ל-MongoDB (upsert מעדכן או יוצר אם לא קיים)
            await Room.findOneAndUpdate(
                { roomId },
                { code: newCode, updatedAt: new Date() },
                { upsert: true }
            );
            console.log(`[Auto-Save] קוד החדר ${roomId} נשמר בהצלחה ב-MongoDB בענן!`);
        } catch (err) {
            console.error('שגיאה בשמירת קוד ל-MongoDB:', err.message);
        } finally {
            delete saveTimers[roomId]; // מנקים את מזהה הטיימר
        }
    }, 2000); // 2000 מילי-שניות = 2 שניות
}

// הסרת משתמש בעזיבה (ורשת ביטחון: שמירה סופית ל-DB אם החדר מתרוקן)
export async function removeUserFromRoom(roomId, socketId) {
    if (!rooms[roomId]) return [];

    rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socketId);

    // אם החדר התרוקן לחלוטין (האחרון עזב)
    if (rooms[roomId].users.length === 0) {
        // רשת ביטחון: אם היה שעון שממתין, נבטל אותו ונשמור מיד ל-DB
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
            console.log(`[Final-Save] החדר ${roomId} התרוקן ונשמר סופית ב-MongoDB.`);
        } catch (err) {
            console.error('שגיאה בשמירה סופית:', err.message);
        }

        delete rooms[roomId]; // מנקים את ה-RAM
        return [];
    }

    return rooms[roomId].users;
}