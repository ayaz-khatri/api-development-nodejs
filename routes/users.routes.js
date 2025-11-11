import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const router = express.Router();
import User from '../models/users.model.js';
dotenv.config();


// Register
router.post('/register', async (req, res) => {
    try {
       const {username, email, password} = req.body;
       const existingUser = await User.findOne({ $or: [{username} , {email}] });
       if(existingUser) return res.status(400).json({message: "Username or email already exists."});
        
       const hashedPassword = await bcrypt.hash(password, 10);

       const user = new User({username, email, password: hashedPassword});
       const savedUser = await user.save();
       res.json(savedUser);

    } catch (error) {
        res.status(500).json({message: error.message});c
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
       const {email, password} = req.body;
       const user = await User.findOne({ email });
       if(!user) return res.status(400). json({message: "User not found."});

       const isMatch = await bcrypt.compare(password, user.password);
       if(!isMatch) return res.status(400).json({message: "Invalid credentials."});

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({token});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
       res.json({message: 'Logged out successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;
