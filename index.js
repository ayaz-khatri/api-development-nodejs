import express from 'express';    
import connectDB from './config/database.js'; 
import StudentRoutes from './routes/students.routes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import auth from './middlewares/auth.js'
import UserRoutes from './routes/users.routes.js';
import rateLimit from 'express-rate-limit';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();       

/* --------------------------- Database connection -------------------------- */
connectDB();


/* ------------------------------- Middlewares ------------------------------ */
app.set("view engine", "ejs");                  // set the view engine to ejs
app.use(express.json());                        // this allows us to send data to server in JSON format
app.use(express.urlencoded({extended: false})); // this allows us to send form-data
app.use(express.static('public'));              // set the default folder for static files to public
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,        // 15 minutes
    max: 5,
    message: 'Too many requests from this IP, please try again later.' 
});

/* --------------------------------- Routes --------------------------------- */
app.use(cors()); 
app.use(limiter);

app.use('/api/users', UserRoutes);

app.use(auth);
app.use('/api/students', StudentRoutes);


/* ------------------------------ Start the App ----------------------------- */
app.listen(process.env.PORT, () => {   
    console.log('App is up and running on port 3000');
});