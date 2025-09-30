import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";
const TOKEN_EXPIRES = '24h';

const createToken = (userID) => jwt.sign({id: userID}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES});
 
export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed }); 
        const token =  createToken(user._id); 
          
        res.status(201).json({success: true, token, user: {id: user._id, name: user.name, email: user.email } });

        } catch (err) {
        res.status(500).json({success:false, message: "Server error", error: error.message });
    }
}


//LOGIN FUNCTION
export async function loginUser(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = createToken(user._id);
        res.status(200).json({success: true, token, user: {id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({success:false, message: "Server error", error: error.message });
    }
}

//Get current user
export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({success: true, user });
    } catch (error) {
        res.status(500).json({success:false, message: "Server error", error: error.message });
    }
}



//Update user profile
export async function updateUserProfile(req, res) {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false,message: " Valid Name and Email are required" });
    }
   
    try {
        const exists = await User.findOne({email, _id: { $ne: req.user.id } });
        if (exists) {
            return res.status(404).json({ success: false, message: "Email already exist" });
        }
        const user = await User.findByIdAndUpdate(
           req.user.id,
           { name, email },
           { new: true, runValidators: true, select: "name email" }
        );
        res.json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

//change user password

export async function updateUserPassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    try {
        const user = await User.findById(req.user.id).select("password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}