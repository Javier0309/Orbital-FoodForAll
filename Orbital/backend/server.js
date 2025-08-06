import express from "express";
import cors from "cors";
import http from 'http';
import {Server} from 'socket.io'
import mongoose from "mongoose";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";
import { createClient } from "@supabase/supabase-js";
import cartRouter from "./routes/cartRoute.js";
import jwt from "jsonwebtoken";
import verifyUser from "./middleware/verifyUser.js";
import signupRouter from "./routes/signupRoute.js";
import busRouter from "./routes/businessRoute.js";
import orderRoute from "./routes/orderRoute.js";
import path from "path";
import userRouter from "./routes/userRoute.js";
import driverRoute from "./routes/driverRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

connectDB();

app.use('/api/food', foodRouter);
app.use('/api/recovery', recoveryRoutes);
// Serve all uploads (including certs and images)
//app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRouter);
app.use('/api/signup', signupRouter);
app.use('/api/business', busRouter);
app.use('/api', driverRoute);
app.use('/api/order', orderRoute);
app.use('/api/user', userRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', reviewRouter);

app.get("/", (req, res) => {
    res.send("API is running!");
});

/*
app.listen(4000, () => {
    console.log("Server running on port 4000");
}); */


//location using socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
    }
})

// Message model
const messageSchema = new mongoose.Schema({
    driverId: String,
    from: String, // 'customer' or 'driver'
    text: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// REST endpoint to fetch message history for a driver
app.get('/api/messages/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        const messages = await Message.find({ driverId }).sort({ timestamp: 1 });
        res.json({ success: true, messages });
    } catch (err) {
        res.json({ success: false, messages: [] });
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Join chat room for a driver
    socket.on('joinChat', ({ driverId }) => {
        socket.join(`chat-${driverId}`);
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ driverId, from, text }) => {
        const msg = await Message.create({ driverId, from, text });
        io.to(`chat-${driverId}`).emit('receiveMessage', {
            from,
            text,
            timestamp: msg.timestamp
        });
    });

    //Handle driver location updates
    socket.on('driverLocationUpdate', ({driverId, orderId, latitude, longitude}) => {
        socket.broadcast.emit(`location-${orderId}`, { latitude, longitude })
    })

    socket.on('disconnect', () =>{
        console.log('Socket disconnected:', socket.id);
    })
})

// now start the unified server
server.listen(port, () => {
    console.log(`HTTP + Socket.IO server running on port ${port}`)
})

