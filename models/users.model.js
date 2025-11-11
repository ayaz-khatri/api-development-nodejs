import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

const User = mongoose.model('User', userSchema);
export default User;   // export the model for other files to use