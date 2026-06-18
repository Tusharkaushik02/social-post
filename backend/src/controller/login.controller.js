const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

async function loginUser(req, res) { 
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if(!user){
        return res.status(401).json({ error: 'sign up first' });
    }
    const isMatch =await bcrypt.compare(password,user.passwordHash);

    if(!isMatch){
        return res.status(401).json({ error: 'Invalid credentials' });
    }
   const token = jwt.sign(
           { id: user._id, username: user.username },
            process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
           const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
           res.cookie('token', token, {
               httpOnly: true,
               secure: isProduction,
               sameSite: isProduction ? 'none' : 'lax',
           });
         const userResponse = user.toObject();
         delete userResponse.passwordHash;
         return res.json({ success: true, token, user: userResponse });
}

module.exports = { loginUser };
