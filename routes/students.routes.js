import express from 'express';
const router = express.Router();
import Student from '../models/students.model.js';

// Get all records
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get only one record
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).json({message: 'Student not found.'});
        res.json(student);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get only one record
router.get('/:id', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Add new record
router.post('/', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Update existing record
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(!updatedStudent) return res.status(404).json({message: 'Student not found.'});
        res.status(201).json(updatedStudent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete existing record
router.delete('/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if(!deletedStudent) return res.status(404).json({message: 'Student not found.'});
        res.status(201).json({ message: 'Student deleted.' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;