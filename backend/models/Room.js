import mongoose from 'mongoose';

// הגדרת מבנה הנתונים של חדר בבסיס הנתונים
const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        default: '<h1 style="color: blue;">Hello DevSync</h1>\n<script>\n  console.log("Welcome to DevSync!");\n</script>'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Room', roomSchema);