import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const verifyUser = async (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({success: false, message: "No token provided"})

        const { data: {user}, error} = await supabase.auth.getUser(token);
        if (error || !user) return res.status(401).json({ success: false, message: "Invalid token" })

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error", error);
        return res.status(500).json({ success:false, message: "Authentication error"})
    }
}

export default verifyUser;