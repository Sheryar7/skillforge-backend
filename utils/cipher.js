import dotenv from "dotenv";
dotenv.config();
import crypto from 'crypto';
 
const algorithm = 'aes-256-cbc';
// You are using:

// AES = Advanced Encryption Standard 
// 256 = 256-bit key 
// CBC = Cipher Block Chaining

// This is a very strong and widely used encryption method.

// Always 32 bytes using sha256
const key = crypto.createHash('sha256')
    .update(String(process.env.ENCRYPTION_KEY || 'default_passphrase'))
    .digest(); // 32-byte buffer

    console.log("key length:", key.length);
    console.log("Encryption key:", key.toString('hex'));

// Encrypt function
const encrypt = (text) => {
    try {
        const iv = crypto.randomBytes(16); // Fresh IV per encryption
        console.log("Text to encrypt:", text);
        console.log("Encrypt IV:", iv);

        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        };
    } catch (error) {
        console.error("Encryption error:", error);
        throw error;
    }
};

// Decrypt function
const decrypt = (encryptedData) => {
    try {
        const decipher = crypto.createDecipheriv(
            algorithm,
            key,
            Buffer.from(encryptedData.iv, 'hex')
        );
        let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Failed to decrypt data:", error.message);
        throw error;
    }
};

export { encrypt, decrypt };