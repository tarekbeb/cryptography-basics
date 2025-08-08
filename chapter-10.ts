/**
 * This code demonstrates a complete, secure symmetric encryption and decryption process
 * using a shared secret key. It includes an Initialization Vector (IV) for
 * uniqueness and a Message Authentication Code (MAC) for integrity and authenticity.
 *
 * This code uses Node.js's built-in 'crypto' module for its functionality.
 *
 * This is for educational purposes. For production use, always use established
 * cryptographic libraries and practices.
 */
import crypto from 'crypto';

// -----------------------------------------------------------------------------
// Key and Parameter Constants
// -----------------------------------------------------------------------------

// A sample 32-byte shared secret, as would be derived from an ECDH exchange.
const SHARED_SECRET_KEY = crypto.randomBytes(32);

// The algorithm for symmetric encryption. 'aes-256-gcm' is a strong, modern choice
// that provides both encryption and authentication in one step (GCM mode).
const SYMMETRIC_ALGORITHM = 'aes-256-gcm';

// -----------------------------------------------------------------------------
// Encryption and Decryption Functions
// -----------------------------------------------------------------------------

/**
 * Encrypts a plaintext message using a shared secret key.
 * This function generates a random IV, encrypts the message, and produces a
 * MAC tag to ensure authenticity and integrity.
 *
 * @param plaintext The message to encrypt.
 * @param sharedKey The shared secret key (e.g., from an ECDH exchange).
 * @returns An object containing the IV, ciphertext, and authentication tag.
 */
function encrypt(plaintext: string, sharedKey: Buffer): { iv: string, ciphertext: string, mac: string } {
  // Step 1: Generate a random Initialization Vector (IV).
  // The IV length is specific to the chosen algorithm (16 bytes for AES).
  const iv = crypto.randomBytes(16);

  // Step 2: Create a cipher instance.
  // The 'auth tag' will be our MAC.
  const cipher = crypto.createCipheriv(SYMMETRIC_ALGORITHM, sharedKey, iv);

  // Step 3: Encrypt the message.
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Step 4: Get the authentication tag (MAC).
  // This tag is created over the ciphertext and IV, ensuring integrity.
  const mac = cipher.getAuthTag().toString('hex');

  return {
    iv: iv.toString('hex'),
    ciphertext: encrypted,
    mac: mac,
  };
}

/**
 * Decrypts a ciphertext message using a shared secret key.
 * The function first verifies the MAC tag. If the tag is invalid, it
 * throws an error, preventing the decryption of a tampered message.
 *
 * @param encryptedData An object containing the IV, ciphertext, and MAC.
 * @param sharedKey The shared secret key.
 * @returns The original plaintext message.
 */
function decrypt(encryptedData: { iv: string, ciphertext: string, mac: string }, sharedKey: Buffer): string {
  try {
    // Step 1: Create a decipher instance.
    const decipher = crypto.createDecipheriv(
      SYMMETRIC_ALGORITHM,
      sharedKey,
      Buffer.from(encryptedData.iv, 'hex')
    );

    // Step 2: Set the authentication tag (MAC) for verification.
    decipher.setAuthTag(Buffer.from(encryptedData.mac, 'hex'));

    // Step 3: Decrypt the message.
    let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // This catch block will trigger if the MAC verification fails.
    console.error("Decryption failed: Message has been tampered with or key is incorrect.");
    throw new Error("Invalid MAC or key.");
  }
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

// The plaintext message to send.
const originalMessage = "Hello, this is a secret message!";

console.log("--- Secure Encryption and Decryption Example ---");
console.log(`Original message: "${originalMessage}"`);

// Alice encrypts the message.
const encryptedMessage = encrypt(originalMessage, SHARED_SECRET_KEY);

console.log("\n--- Encrypted Output (Sent Over the Wire) ---");
console.log(encryptedMessage);

// Bob receives the message and decrypts it.
const decryptedMessage = decrypt(encryptedMessage, SHARED_SECRET_KEY);

console.log("\n--- Decrypted Output ---");
console.log(`Decrypted message: "${decryptedMessage}"`);

// --- Example of a Tampered Message ---
console.log("\n--- Tampering Attempt Example ---");

// Let's simulate a malicious actor changing one character of the ciphertext.
const tamperedData = {
  ...encryptedMessage,
  ciphertext: encryptedMessage.ciphertext.slice(0, -2) + 'ff' // Corrupt the last two hex characters.
};

try {
  // We expect this decryption to fail because the MAC will not match.
  decrypt(tamperedData, SHARED_SECRET_KEY);
} catch (e) {
  console.error("As expected, the decryption failed due to a tampered message.");
}
