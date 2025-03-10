import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-encryption-key';

export const encrypt = (data: any): string => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(decryptedData);
    } catch {
      return decryptedData;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};