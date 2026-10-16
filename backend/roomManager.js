// פלטת צבעים יפה שנחלק למשתמשים
const USER_COLORS = [
    '#3B82F6', // כחול
    '#10B981', // ירוק
    '#F59E0B', // כתום
    '#EF4444', // אדום
    '#8B5CF6', // סגול
    '#EC4899', // ורוד
    '#14B8A6'  // טורקיז
];

// מחברת החדרים בזיכרון של השרת
const rooms = {};

// 1. פעולת הוספת משתמש לחדר
export function addUserToRoom(roomId, socketId, username) {
    // אם החדר עדיין לא קיים - פותחים חדר חדש
    if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    // הגרלת צבע מתוך הפלטה לפי כמות האנשים
    const color = USER_COLORS[rooms[roomId].length % USER_COLORS.length];

    const newUser = { id: socketId, username, color };
    rooms[roomId].push(newUser);

    // מחזירים את הרשימה המעודכנת של כל מי שבחדר
    return rooms[roomId];
}

// 2. פעולת הסרת משתמש שעזב
export function removeUserFromRoom(roomId, socketId) {
    if (!rooms[roomId]) return [];

    // משאירים בחדר רק את מי שלא התנתק
    rooms[roomId] = rooms[roomId].filter(user => user.id !== socketId);

    // אם החדר התרוקן לגמרי - מוחקים אותו לחלוטין מהזיכרון
    if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        return [];
    }

    // מחזירים את רשימת הנשארים
    return rooms[roomId];
}