const userModel =require("../model/user.model")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

async function registerUser (req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({error:"All fields are required"})
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
    }
    if(email.length < 5 || !email.includes('@')){
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = await userModel.create({
        username,
        email,
        passwordHash: password
    })
    const token = jwt.sign(
        { id: user._id, username: user.username },
         process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
         res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
    res.status(201).json({ message: 'User registered successfully', user, token });
}

module.exports = { registerUser };