
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import userModel from '../models/userModel.js'
import transporter from '../config/nodeMailer.js'


export const register = async (req, res) => {

    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(404).send({ success: false, message: "Missing Details" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "user already exist" });
        const hashedPassword = await bcrypt.hash(password, 10); //encrypt the password, to store password in the database
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save(); // save user in the database - userModel
        //generate one token for authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
        })
        //sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Greater Stack 🎉",
            html: `
                   <h2>Welcome 🎉</h2>
                   <p>Your account has been created successfully.</p>
                   <p><b>Email:</b> ${email}</p>`
        };
        await transporter.sendMail(mailOptions);
        // const info = await transporter.sendMail(mailOptions);
        // console.log("Email sent:", info);
        return res.status(201).json({ success: true, msg: "User Created Successfully" })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.send({ success: false, message: "email and password are required" });
    try {
        const user = await userModel.findOne({ email })
        if (!user) { return res.json({ success: false, message: "Invalid Email" }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
        })
        res.status(200).json({ success: true, msg: "User Successfully Login" })

    }
    catch (err) {
        console.error("Login & Password Invalid")
        res.status(500).send({ success: false, message: err.message })
    }

}
// jwt.sign() creates a secure, signed token that proves the user is logged in

// User enters email + password
// Backend checks DB
// Compares password using bcrypt
// If correct → create JWT
// Store JWT in cookie 🍪
// Send success response

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        return res.json({ success: true, message: "Successfully logout" })
    }
    catch (err) {
        return res.status(500).send({ success: false, message: err.message })
    }

}

// User clicks logout
// Backend clears cookie 🍪
// Token removed
// User becomes unauthenticated


// Send Verification OTP to user Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
        return res.json({ success: false, message: "User not found" });
         }
        if (user.isAccountVerified) {
            return res.json({ success: false, msg: "Account Already Verified" })
        }
        const otp = String(Math.floor(10000 + Math.random() * 900000)) // returns 6 digit random number
        user.verifyOtp = otp;
        user.verifyOtpExpireaAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        //sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            html: `
                   <h2>Welcome 🎉</h2>
                   <p><b>Your Email OTP:</b> ${otp}</p>`
        };
        await transporter.sendMail(mailOptions);
        return res.status(201).json({ success: true, msg: "Verification OTP Sent on Email" })

    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}

//verify email
export const verifyEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const {otp } = req.body
        if (!userId || !otp) {
        return res.json({ success: false, message: "please login and try again" })
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if(user.verifyOtp == "" || user.verifyOtp != otp){
             return res.json({ success: false, message: "Invalid OTP" })
        }
        if(user.verifyOtpExpireaAt < Date.now()) {
            return res.json({ success: false, message: "OTP Already Expired" })
        }
        //Mark user as verified
        user.isAccountVerified = true;
        //Clear OTP
        user.verifyOtp = '';
        user.verifyOtpExpireaAt = 0;
        //save  
        await user.save();
        return res.status(200).json({ success: true, msg: "Email Verified Successfully" })

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

}


//check if user isAuthenticated

export const isAuthenticated = async(req,res) =>{
    try{
        res.json({ success: true})
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

//send password reset otp

export const resetOtp = async(req,res) =>{ 
       const{email} = req.body
       if(!email) {
       return res.json({success:false, message:"email is required"})
       }
      try{
        const user = await userModel.findOne({email});
        if(!user){
         return res.json({success:false, message:"user not found"})
        }
        const otp = String(Math.floor(10000 + Math.random() * 900000)) // returns 6 digit random number
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        //sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            html: `
                   <h2>Welcome 🎉</h2>
                   <p><b>Your Email OTP:</b> ${otp}</p>`
        };
        await transporter.sendMail(mailOptions);
        return res.status(201).json({ success: true, msg: "Reset OTP Sent on Email" }) 
 }
 catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}


// verify the otp and rest the password
export const newPassword = async (req, res) => { 
     const { email, otp , newpassword } = req.body
     if (!email || !otp || !newpassword) {
        return res.json({ success: false, message: "please provide email , otp, newpassword" })
        }   
     try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if(user.resetOtp == "" || user.resetOtp != otp){
             return res.json({ success: false, message: "Invalid OTP" })
        }
        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Already Expired" })
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10); //encrypt the password, to store password in the database
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.status(200).json({ success: true, msg: "Reset Password Successfully" })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

}