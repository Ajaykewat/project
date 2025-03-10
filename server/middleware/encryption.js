import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-fallback-encryption-key";
const IV_LENGTH = 16;

export const encrypt = (data) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (text) => {
  try {
    const [ivHex, encryptedHex] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(decrypted.toString());
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

export const encryptionMiddleware = (req, res, next) => {
  // Original response.json function
  const originalJson = res.json;

  // Override response.json
  res.json = function (data) {
    if (data) {
      const encryptedData = encrypt(data);
      return originalJson.call(this, { encryptedData });
    }
    return originalJson.call(this, data);
  };

  // Decrypt request body if encrypted
  if (req.body?.encryptedData) {
    req.body = decrypt(req.body.encryptedData);
  }

  next();
};
