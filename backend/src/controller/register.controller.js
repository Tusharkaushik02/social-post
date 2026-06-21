const userModel =require("../model/user.model")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

async function registerUser (req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({error:"All fields are required"})
    }
    const existingUser = await userModel.findOne({ email });
    const existingUsername =await userModel.findOne({ username });
    if (existingUsername) {
        return res.status(409).json({ error: 'Username already in use' });
    }
    if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
    }
    if(email.length < 5 || !email.includes('@')){
        return res.status(400).json({ error: 'Invalid email format' });
    }
    const hashedPassword= await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        passwordHash: hashedPassword
    })
    const token = jwt.sign(
        { id: user._id, username: user.username },
         process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
        const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
        const secure = isProduction && !isLocalhost;
        res.cookie('token', token, {
            httpOnly: true,
            secure,
            sameSite: secure ? 'none' : 'lax',
        });
    const userResponse = user.toObject();
    delete userResponse.passwordHash;
    res.status(201).json({ success: true, message: 'User registered successfully', user: userResponse, token });
}

module.exports = { registerUser };
