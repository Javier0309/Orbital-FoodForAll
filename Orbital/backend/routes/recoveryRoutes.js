import express from "express";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// In-memory OTP store (for demo; use DB/Redis in production)
const otpStore = {}; // { email: { otp: "1234", expires: timestamp } }

// Supabase client (service role key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Never expose this to frontend!
);

// 1. Send Recovery Email (generate OTP)
router.post("/send_recovery_email", async (req, res) => {
  const { recipient_email } = req.body;
  if (!recipient_email)
    return res.status(400).json({ success: false, message: "Email is required" });

  const OTP = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[recipient_email] = { otp: OTP, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipient_email,
    subject: 'Your Password Reset OTP',
    text: `Your OTP code is: ${OTP}. It is valid for 10 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP email." });
  }
});

// 2. Verify OTP and, if correct, trigger Supabase password reset email
router.post("/verify_otp", async (req, res) => {
    const email = req.body.email || req.body.recipient_email;
    const { otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Missing fields" });
  
    const record = otpStore[email];
    if (record && record.otp === otp && Date.now() < record.expires) {
      delete otpStore[email];
      res.json({ success: true, message: "OTP verified." });
    } else {
      res.json({ success: false, message: "Invalid or expired OTP." });
    }
  });
  
  export default router;