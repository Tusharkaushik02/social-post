const ImageKit = require('@imagekit/nodejs');
const dotenv = require('dotenv');

dotenv.config();

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadImage(buffer) {
    console.log(buffer);
    const result = await imageKit.files.upload({
        file: buffer.toString('base64'), // Convert buffer to base64 string
        fileName: `post_${Date.now()}.png`
    });
    return result.url; // Return the URL of the uploaded image
}

module.exports = {
    uploadImage
};