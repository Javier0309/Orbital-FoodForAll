import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import recoveryRoutes from "./routes/recoveryRoutes.js";
import { createClient } from "@supabase/supabase-js";
import cartRouter from "./routes/cartRoute.js";

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
app.use('/images', express.static('uploads'));
app.use('/api/cart',cartRouter)

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});