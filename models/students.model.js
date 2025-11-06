import mongoose from 'mongoose';
const studentSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true
    },
    profile_pic: {
        type: String
    },
});

const Student = mongoose.model('Student', studentSchema);
export default Student;   // export the model for other files to use