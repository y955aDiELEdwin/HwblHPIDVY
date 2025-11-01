// 代码生成时间: 2025-11-01 20:15:08
import { randomBytes, scrypt, createCipheriv, createDecipheriv, createHash } from 'crypto';
import { promisify } from 'util';

// Promisify the scrypt function for use with async/await
const scryptAsync = promisify(scrypt);

// Define the CryptoUtility class
class CryptoUtility {
  // Encrypts data with the given key
  async encrypt(data: Buffer, key: Buffer): Promise<Buffer> {
    try {
      // Hash the key
      const keyHash = await scryptAsync(key, 'salt', 32);
      // Generate a random initialization vector (IV)
      const iv = randomBytes(16);
      // Create and start the cipher
      const cipher = createCipheriv('aes-256-cbc', keyHash, iv);
      // Encrypt the data
      let encrypted = cipher.update(data);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      // Return the IV and the encrypted data together
      return Buffer.concat([iv, encrypted]);
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  // Decrypts data with the given key
  async decrypt(encryptedData: Buffer, key: Buffer): Promise<Buffer> {
    try {
      // Extract the IV from the encrypted data
      const iv = encryptedData.slice(0, 16);
      const encrypted = encryptedData.slice(16);
      // Hash the key
      const keyHash = await scryptAsync(key, 'salt', 32);
      // Create and start the decipher
      const decipher = createDecipheriv('aes-256-cbc', keyHash, iv);
      // Decrypt the data
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      // Return the decrypted data
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }
}

// Example usage
(async () => {
  const utility = new CryptoUtility();
  const key = randomBytes(32); // Generate a random key
  const data = Buffer.from('Hello, World!'); // Data to encrypt

  try {
    const encrypted = await utility.encrypt(data, key);
    console.log('Encrypted:', encrypted.toString('hex'));

    const decrypted = await utility.decrypt(encrypted, key);
    console.log('Decrypted:', decrypted.toString());
  } catch (error) {
    console.error(error.message);
  }
})();
