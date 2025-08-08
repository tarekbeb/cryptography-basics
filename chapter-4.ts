import { generateAsymmetricKeyPair, PrivateKey, PublicKey } from './chapter-2';
import { simpleHash } from './chapter-3'
// -----------------------------------------------------------------------------
// Digital Signature Functions
// -----------------------------------------------------------------------------

/**
 * Creates a digital signature for a message.
 * This function hashes the message and then "encrypts" the hash with the sender's private key.
 *
 * @param message The plaintext message to be signed.
 * @param privateKey The sender's private key.
 * @returns The digital signature as a number.
 */
function signMessage(message: string, privateKey: PrivateKey): number {
  // Step 1: Hash the original message.
  const messageHash = simpleHash(message);

  // Step 2: "Encrypt" the hash with the private key.
  // Signature = (hash^d) mod n
  const hashBigInt = BigInt(messageHash);
  const dBigInt = BigInt(privateKey.d);
  const nBigInt = BigInt(privateKey.n);
  const signature = Number(hashBigInt ** dBigInt % nBigInt);

  return signature;
}

/**
 * Verifies a digital signature to ensure a message's integrity and authenticity.
 * This function "decrypts" the signature with the public key and compares the
 * result to a new hash of the message.
 *
 * @param message The original plaintext message.
 * @param signature The digital signature provided by the sender.
 * @param publicKey The sender's public key.
 * @returns true if the signature is valid, false otherwise.
 */
function verifySignature(message: string, signature: number, publicKey: PublicKey): boolean {
  // Step 1: "Decrypt" the signature with the public key to get the original hash.
  // Original hash = (signature^e) mod n
  const signatureBigInt = BigInt(signature);
  const eBigInt = BigInt(publicKey.e);
  const nBigInt = BigInt(publicKey.n);
  const decryptedHash = Number(signatureBigInt ** eBigInt % nBigInt);

  // Step 2: Hash the received message on our side.
  const newMessageHash = simpleHash(message);

  // Step 3: Compare the two hashes.
  return decryptedHash === newMessageHash;
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

// --- Scenario 1: Successful Signing and Verification ---
console.log("--- Scenario 1: Successful Signing and Verification ---");
const [alicePublicKey, alicePrivateKey] = generateAsymmetricKeyPair();
const originalMessage = "Hello Bob, this is Alice.";

const signature = signMessage(originalMessage, alicePrivateKey);
console.log("Original Message:", originalMessage);
console.log("Generated Signature:", signature);

const isVerified = verifySignature(originalMessage, signature, alicePublicKey);
console.log("Is signature valid?", isVerified); // Should be true

// --- Scenario 2: Tampered Message ---
console.log("\n--- Scenario 2: Tampered Message ---");
const tamperedMessage = "Hello Bob, this is Carol."; // A small change
const tamperedVerified = verifySignature(tamperedMessage, signature, alicePublicKey);
console.log("Tampered Message:", tamperedMessage);
console.log("Is signature valid for tampered message?", tamperedVerified); // Should be false
