const USER_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
];

// פנקס החדרים בזיכרון
const rooms = {};

// קוד ברירת מחדל לחדר חדש שנוצר
const DEFAULT_CODE = '<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>';

// הוספת משתמש לחדר (עם מניעת כפילויות!)
export function addUserToRoom(roomId, socketId, username) {
    // אם החדר עדיין לא קיים - יוצרים אותו עם קוד התחלתי ורשימת משתמשים ריקה
    if (!rooms[roomId]) {
        rooms[roomId] = {
            users: [],
            code: DEFAULT_CODE
        };
    }

    // בדיקת הגנה: האם המשתמש כבר קיים בחדר?
    const existingUser = rooms[roomId].users.find(user => user.id === socketId);
    if (!existingUser) {
        const color = USER_COLORS[rooms[roomId].users.length % USER_COLORS.length];
        rooms[roomId].users.push({ id: socketId, username, color });
    }

    // מחזירים גם את רשימת המשתמשים וגם את הקוד הנוכחי של החדר
    return rooms[roomId];
}

// שמירת קוד מעודכן בחדר
export function updateRoomCode(roomId, newCode) {
    if (rooms[roomId]) {
        rooms[roomId].code = newCode;
    }
}

// הסרת משתמש שעזב
export function removeUserFromRoom(roomId, socketId) {
    if (!rooms[roomId]) return [];

    rooms[roomId].users = rooms[roomId].users.filter(user => user.id !== socketId);

    // אם כולם עזבו - מוחקים את החדר מהזיכרון
    if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
        return [];
    }

    return rooms[roomId].users;
}