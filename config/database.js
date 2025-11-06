import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// database connection
const connectDB = () => { 
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {console.log("Database Connected.")})
    .catch( err => { console.log(err);
})};

export default connectDB;