const userModel = require("../model/user.model");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleOAuth(req,res){
    try{
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
    }


    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google Client ID is not configured on the server' });
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        payload = ticket.getPayload();
    } catch (verifyError) {
        console.error("Google ID Token verification failed:", verifyError.message);
        return res.status(401).json({ error: 'Invalid Google ID token' });
    }

let user = await userModel.findOne({
    email: payload.email
});

if (user) {

    if (!user.googleId) {

        user.googleId = payload.sub;

    }

    if (!user.avatarUrl && payload.picture) {

        user.avatarUrl = payload.picture;

    }

    await user.save();

} else {
    const usernameBase = payload.email.split('@')[0];
    let username = usernameBase;
    let counter = 1;

    while (await userModel.findOne({ username }).select('_id').lean()) {
        username = `${usernameBase}${counter}`;
        counter++;
    }

    user = await userModel.create({
        username,
        email: payload.email,
        displayname: payload.name || '',
        avatarUrl: payload.picture || '',
        provider: 'google',
        googleId: payload.sub
    });
}

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
         return res.json({ success: true, token, user: userResponse });
    }catch(error){
        console.error("Google OAuth error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { googleOAuth };
