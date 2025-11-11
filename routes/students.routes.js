import express from 'express';
const router = express.Router();
import Student from '../models/students.model.js';
import multer from 'multer';
import path from 'path';
import fs, { appendFile } from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
        
    },
    filename: function (req, file, cb) {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})

const limits = { 
    fileSize: 1024 * 1024 * 5
};

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!')), false;
    }
};

const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter,
});


// Get all records
router.get('/', async (req, res) => {
    try {
        const search =  req.query.search || '';
        const query = {
            $or: [
                {first_name: {$regex: search, $options: 'i'}},
                {last_name: {$regex: search, $options: 'i'}},
            ]
        };
        const students = await Student.find(query);
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

// Add new record
router.post('/', upload.single('profile_pic'), async (req, res) => {
    try {
        const student = new Student(req.body);
        if(req.file){
            student.profile_pic = req.file.filename;
        }
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Update existing record
router.put('/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        const existingStudent = await Student.findById(req.params.id);
        if(!existingStudent){
            if(req.file.filename)
            {
                const filePath = path.join('./uploads', req.file.filename);
                fs.unlink(filePath, (err)=>{
                    if(err) console.log('Failed to delete: ', err);
                });
            }
            res.status(404).json({message: 'Student not found.'});
        }
        if(req.file)
        {
            if(existingStudent.profile_pic)
            {
                const filePath = path.join('./uploads', existingStudent.profile_pic);
                fs.unlink(filePath, (err)=>{
                    if(err) console.log('Failed to delete: ', err);
                });
            }
            req.body.profile_pic = req.file.filename;
        }
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

        if(deletedStudent.profile_pic)
        {
            const filePath = path.join('./uploads', deletedStudent.profile_pic);
            fs.unlink(filePath, (err)=>{
                if(err) console.log('Failed to delete: ', err);
            });
        }

        res.status(201).json({ message: 'Student deleted.' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});




// // Get all records
// router.get('/', async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.json(students);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// });

// // Get only one record
// router.get('/:id', async (req, res) => {
//     try {
//         const student = await Student.findById(req.params.id);
//         if(!student) return res.status(404).json({message: 'Student not found.'});
//         res.json(student);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// });

// // Add new record
// router.post('/', async (req, res) => {
//     try {
//         const newStudent = await Student.create(req.body);
//         res.status(201).json(newStudent);
//     } catch (error) {
//         res.status(400).json({message: error.message});
//     }
// });

// // Update existing record
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if(!updatedStudent) return res.status(404).json({message: 'Student not found.'});
//         res.status(201).json(updatedStudent);
//     } catch (error) {
//         res.status(400).json({message: error.message});
//     }
// });

// // Delete existing record
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedStudent = await Student.findByIdAndDelete(req.params.id);
//         if(!deletedStudent) return res.status(404).json({message: 'Student not found.'});
//         res.status(201).json({ message: 'Student deleted.' });
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// });

export default router;