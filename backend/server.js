import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';        
import cookieParser from 'cookie-parser';
import userRouters from './routes/userRoutes.js'
import postRouters from './routes/postRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

import {v2 as cloudinary} from "cloudinary";
import {app,server} from "./socket/socket.js";

dotenv.config();
connectDB();
// const app = express(); // this express delete resone is already "express" calling  "socket.js"

// Use a different port number if port 5000 is not available or has permission issues
const PORT = process.env.PORT || 5000 ;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
    
})

//middlewares
app.use(express.json({ limit: "100mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json({ limit: '50mb' })); // Adjust the limit as per your requirement
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(cookieParser());


// Routes
app.use("/api/users", userRouters);
app.use("/api/posts", postRouters);        
app.use("/api/messages", messageRoutes);



// app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`))
