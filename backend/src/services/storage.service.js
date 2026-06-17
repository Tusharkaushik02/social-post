const ImageKit = require('@imagekit/nodejs');
const dotenv = require('dotenv');

dotenv.config();

const IMAGEKIT_TIMEOUT_MS = 10000;

function hasImageKitConfig() {
    return Boolean(
        process.env.IMAGEKIT_PUBLIC_KEY &&
        process.env.IMAGEKIT_PRIVATE_KEY &&
        process.env.IMAGEKIT_URL_ENDPOINT
    );
}

function createImageKitClient() {
    return new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
}

function toDataUrl(buffer, mimeType) {
    return `data:${mimeType || 'image/png'};base64,${buffer.toString('base64')}`;
}

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Image upload timed out')), ms)
        )
    ]);
}

async function uploadImage(buffer, mimeType) {
    if (!hasImageKitConfig()) {
        console.warn('[storage.uploadImage] ImageKit is not configured; using local data URL fallback.');
        return toDataUrl(buffer, mimeType);
    }

    const imageKit = createImageKitClient();
    const result = await withTimeout(
        imageKit.files.upload({
            file: buffer.toString('base64'),
            fileName: `post_${Date.now()}.png`
        }),
        IMAGEKIT_TIMEOUT_MS
    );
    return result.url; // Return the URL of the uploaded image
}

module.exports = {
    uploadImage
};
