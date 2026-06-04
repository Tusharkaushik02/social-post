const userModel =require("../model/user.model")
const jwt = require("jsonwebtoken");

async function registerUser (req,res){
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({error:"All fields are required"})
    }
    
    const user = await userModel.create({
        username,
        email,
        passwordHash: password
    })
    const token = jwt.sign(
        { id: user._id, username: user.username },
         process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', user, token });
}

module.exports = { registerUser };