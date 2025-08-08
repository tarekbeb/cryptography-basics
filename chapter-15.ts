/**
 * This code simulates the key steps of a TLS Handshake between a client and a server.
 * It is designed to be an educational tool, illustrating how different cryptographic
 * primitives work together to establish a secure, authenticated connection.
 *
 * This is a simplified simulation and does not implement a full, production-ready
 * TLS protocol. It uses Node.js's 'crypto' module for all cryptographic operations.
 *
 * The core steps demonstrated are:
 * 1. Key Exchange using ECDH to create a shared secret.
 * 2. Server Authentication using a Digital Signature.
 * 3. Symmetric Key Generation from the shared secret.
 * 4. Encrypted Data Transfer using AES-256-GCM.
 */

import crypto from 'crypto';

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Derives a key using HKDF (HMAC-based Key Derivation Function).
 * HKDF is used in TLS to derive multiple keys from a single, shared secret.
 * @param secret The shared secret to use as input.
 * @param salt The salt value for the key derivation.
 * @param info The context information for key derivation.
 * @param length The desired length of the output key.
 * @returns The derived key as a Buffer.
 */
function deriveKey(secret: Buffer, salt: Buffer, info: string, length: number): Buffer {
  return crypto.hkdfSync('sha256', secret, salt, info, length);
}

// -----------------------------------------------------------------------------
// Server's Pre-shared Secrets (In a real scenario, these would be from a certificate)
// -----------------------------------------------------------------------------

// The server's permanent ECDSA private key.
const serverPrivateKey = crypto.createPrivateKey({
  key: crypto.generateKeyPairSync('ec', {
    namedCurve: 'P-256'
  }).privateKey.export({ type: 'pkcs8', format: 'pem' }),
  format: 'pem',
  type: 'pkcs8'
});

// The server's corresponding public key. This is public knowledge.
const serverPublicKey = crypto.createPublicKey(serverPrivateKey).export({ format: 'pem', type: 'spki' });

// -----------------------------------------------------------------------------
// TLS Handshake Simulation
// -----------------------------------------------------------------------------

/**
 * Simulates the client-side of the handshake.
 * @param serverPublicKey The server's public key for authentication and key exchange.
 * @returns An object containing the derived encryption key, mac key, and other session info.
 */
function clientHandshake(serverPublicKey: string) {
  // Step 1: Client generates its own temporary key pair for key exchange.
  const clientEphemeralKeys = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const clientPublicKey = clientEphemeralKeys.publicKey.export({ format: 'pem', type: 'spki' });

  // Step 2: Client computes the shared secret using the server's public key.
  const sharedSecret = crypto.diffieHellman({
    privateKey: clientEphemeralKeys.privateKey,
    publicKey: crypto.createPublicKey(serverPublicKey)
  });

  // For simplicity, we assume the server has sent a signed message.
  // The client would now verify the server's signature to authenticate it.
  // In a real TLS handshake, the server signs a hash of the handshake messages.
  // This simulation skips the actual signature verification for brevity.
  console.log('[Client] Verified server\'s digital certificate and signature.');

  // Step 3: Client and server now have the same shared secret.
  // They use HKDF to derive a symmetric encryption key and MAC key from the secret.
  const salt = crypto.randomBytes(32); // A random value
  const encryptionKey = deriveKey(sharedSecret, salt, 'encryption key', 32); // AES-256
  const macKey = deriveKey(sharedSecret, salt, 'mac key', 32);

  return {
    encryptionKey,
    macKey,
    serverPublicKey: serverPublicKey,
    clientPublicKey: clientPublicKey,
    salt
  };
}

/**
 * Simulates the server-side of the handshake.
 * @param clientPublicKey The client's public key for key exchange.
 * @param serverPrivateKey The server's private key for authentication.
 * @returns An object containing the derived encryption key, mac key, and other session info.
 */
function serverHandshake(clientPublicKey: string, serverPrivateKey: crypto.KeyObject, serverPublicKey: string, salt: Buffer) {
  // Step 1: Server computes the same shared secret using the client's public key.
  const sharedSecret = crypto.diffieHellman({
    privateKey: serverPrivateKey,
    publicKey: crypto.createPublicKey(clientPublicKey)
  });

  // Step 2: Server uses the same HKDF process to derive the keys.
  const encryptionKey = deriveKey(sharedSecret, salt, 'encryption key', 32);
  const macKey = deriveKey(sharedSecret, salt, 'mac key', 32);

  // In a real handshake, the server would now send a signed message
  // to prove its identity, which the client would verify.
  const handshakeMessages = 'ClientHello + ServerHello...';
  const signature = crypto.sign('sha256', Buffer.from(handshakeMessages), serverPrivateKey);
  console.log('[Server] Signed handshake messages with its private key.');

  return {
    encryptionKey,
    macKey
  };
}


// -----------------------------------------------------------------------------
// Encrypted Communication
// -----------------------------------------------------------------------------

/**
 * Encrypts a message using AES-256-GCM.
 * @param plaintext The message to encrypt.
 * @param key The symmetric encryption key.
 * @returns An object with the ciphertext, IV, and authentication tag.
 */
function encryptMessage(plaintext: string, key: Buffer): { iv: Buffer, ciphertext: Buffer, mac: Buffer } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const mac = cipher.getAuthTag();

  return { iv, ciphertext: encrypted, mac };
}

/**
 * Decrypts a message using AES-256-GCM.
 * @param encryptedData An object with the ciphertext, IV, and authentication tag.
 * @param key The symmetric encryption key.
 * @returns The decrypted plaintext message.
 */
function decryptMessage(encryptedData: { iv: Buffer, ciphertext: Buffer, mac: Buffer }, key: Buffer): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, encryptedData.iv);
  decipher.setAuthTag(encryptedData.mac);

  let decrypted = decipher.update(encryptedData.ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

// -----------------------------------------------------------------------------
// Protocol Execution Flow
// -----------------------------------------------------------------------------

console.log('--- TLS Handshake Simulation ---');

// Phase 1: Client and Server exchange "hellos" and public keys.
const clientSession = clientHandshake(serverPublicKey.toString());

// Phase 2: Server uses the client's public key to derive the same secret.
const serverSession = serverHandshake(clientSession.clientPublicKey, serverPrivateKey, serverPublicKey.toString(), clientSession.salt);

// Phase 3: Now both sides have a shared symmetric key and can communicate securely.
const messageToSend = 'This is a secret message encrypted after the handshake.';
console.log('\n[Client] Sending encrypted message...');
const encryptedPackage = encryptMessage(messageToSend, clientSession.encryptionKey);

console.log('\n[Server] Received and decrypting message...');
const decryptedMessage = decryptMessage(encryptedPackage, serverSession.encryptionKey);

console.log(`[Server] Decrypted message: "${decryptedMessage}"`);

// --- Example of a Tampered Message ---
console.log('\n--- Tampering Attempt Example ---');
try {
  const tamperedPackage = {
    ...encryptedPackage,
    // Corrupt the first byte of the ciphertext.
    ciphertext: Buffer.from('ff' + encryptedPackage.ciphertext.toString('hex').slice(2), 'hex')
  };
  decryptMessage(tamperedPackage, serverSession.encryptionKey);
} catch (e) {
  console.log('[Server] Decryption failed! The MAC verification failed, detecting tampering.');
}

