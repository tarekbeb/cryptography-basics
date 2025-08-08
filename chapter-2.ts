/**
 * This section demonstrates generating "mathematically small" cryptographic keys for educational purposes.
 * In a real-world application, keys would be much larger and generated using cryptographically secure
 * random number generators.
 */

// -----------------------------------------------------------------------------
// Symmetric Key Generation & Functions
// -----------------------------------------------------------------------------

/**
 * Generates a small, symmetric key.
 * In a real-world scenario, this would be a cryptographically secure random key,
 * but here we use a simple, predictable value for clarity.
 *
 * @returns A small, symmetric secret key.
 */
function generateSymmetricKey(): string {
  // A simple example key. In practice, this would be a random byte array.
  // We'll use a string for simplicity to represent our shared secret.
  const key = "supersecretkey123";
  console.log(`Generated Symmetric Key: "${key}"`);
  return key;
}

/**
 * Encrypts a string message using a simple XOR cipher with a symmetric key.
 * This is for educational purposes and is not cryptographically secure.
 *
 * @param message The plaintext message to encrypt.
 * @param key The symmetric key.
 * @returns The encrypted message as a string.
 */
function encryptSymmetric(message: string, key: string): string {
  let ciphertext = "";
  for (let i = 0; i < message.length; i++) {
    const messageChar = message.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    ciphertext += String.fromCharCode(messageChar ^ keyChar);
  }
  return ciphertext;
}

/**
 * Decrypts a string message using the same simple XOR cipher with a symmetric key.
 *
 * @param ciphertext The encrypted message.
 * @param key The symmetric key.
 * @returns The decrypted plaintext message.
 */
function decryptSymmetric(ciphertext: string, key: string): string {
  // The XOR operation is its own inverse, so decryption is the same as encryption.
  return encryptSymmetric(ciphertext, key);
}

// -----------------------------------------------------------------------------
// Asymmetric Key Generation & Functions
// -----------------------------------------------------------------------------

// We'll use a very simple, illustrative model for asymmetric keys based on our
// trap door function example of prime numbers. This is NOT how real RSA works,
// but it captures the core public/private key relationship.

/**
 * A simple model for a public key.
 */
export interface PublicKey {
  e: number; // The public exponent (part of the public key).
  n: number; // The modulus (part of the public key, product of two large primes).
}

/**
 * A simple model for a private key.
 */
export interface PrivateKey {
  d: number; // The private exponent (part of the private key).
  n: number; // The modulus (the same 'n' as the public key).
}

/**
 * Generates an asymmetric key pair.
 * For this educational example, we'll use small numbers to demonstrate the principle
 * of a public and private key relationship.
 *
 * @returns An array containing a PublicKey and a PrivateKey.
 */
export function generateAsymmetricKeyPair(): [PublicKey, PrivateKey] {
  // Step 1: Choose two small, prime numbers (p and q).
  const p = 17;
  const q = 19;

  // Step 2: Compute the modulus, n. This is the product of p and q.
  // This 'n' is shared between both the public and private keys.
  const n = p * q; // n = 323

  // Step 3: Compute Euler's totient function, phi(n) = (p-1)(q-1).
  // This value is critical for the private key calculation.
  const phi_n = (p - 1) * (q - 1); // phi_n = 16 * 18 = 288

  // Step 4: Choose an integer 'e' such that 1 < e < phi(n) and e is co-prime to phi(n).
  // 'e' becomes our public exponent.
  // Co-prime means the greatest common divisor of 'e' and 'phi_n' is 1.
  const e = 13; // 13 is co-prime with 288.

  // Step 5: Compute 'd', the private exponent.
  // 'd' is the modular multiplicative inverse of 'e' modulo 'phi_n'.
  // This means (d * e) % phi_n === 1.
  // For this small example, we can find 'd' by trial and error.
  // (221 * 13) % 288 === 1
  const d = 221;

  // The public key contains the public components 'e' and 'n'.
  const publicKey: PublicKey = { e, n };

  // The private key contains the private components 'd' and 'n'.
  // Note that 'p' and 'q' are the "trap door" secrets that are kept hidden!
  const privateKey: PrivateKey = { d, n };

  console.log("Generated Asymmetric Key Pair:");
  console.log("  Public Key:", publicKey);
  console.log("  Private Key:", privateKey);

  return [publicKey, privateKey];
}

/**
 * Encrypts a single number using a simplified RSA-like algorithm.
 *
 * @param message The number to encrypt.
 * @param publicKey The public key containing 'e' and 'n'.
 * @returns The encrypted ciphertext number.
 */
function encryptAsymmetric(message: number, publicKey: PublicKey): number {
  // Encrypted message = (message^e) mod n
  // We use BigInt to avoid overflow with large numbers during exponentiation.
  const msgBigInt = BigInt(message);
  const eBigInt = BigInt(publicKey.e);
  const nBigInt = BigInt(publicKey.n);
  return Number(msgBigInt ** eBigInt % nBigInt);
}

/**
 * Decrypts a single number using a simplified RSA-like algorithm.
 *
 * @param ciphertext The encrypted number.
 * @param privateKey The private key containing 'd' and 'n'.
 * @returns The decrypted plaintext number.
 */
function decryptAsymmetric(ciphertext: number, privateKey: PrivateKey): number {
  // Decrypted message = (ciphertext^d) mod n
  const cipherBigInt = BigInt(ciphertext);
  const dBigInt = BigInt(privateKey.d);
  const nBigInt = BigInt(privateKey.n);
  return Number(cipherBigInt ** dBigInt % nBigInt);
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

console.log("--- Symmetric Key Example ---");
const symmetricKey = generateSymmetricKey();
const symmetricMessage = "Hello World!";
const symmetricCiphertext = encryptSymmetric(symmetricMessage, symmetricKey);
const symmetricDecrypted = decryptSymmetric(symmetricCiphertext, symmetricKey);

console.log(`Original: "${symmetricMessage}"`);
console.log(`Encrypted: "${symmetricCiphertext}"`);
console.log(`Decrypted: "${symmetricDecrypted}"`);

console.log("\n--- Asymmetric Key Example ---");
const [publicKey, privateKey] = generateAsymmetricKeyPair();
const asymmetricMessage = 100;
const asymmetricCiphertext = encryptAsymmetric(asymmetricMessage, publicKey);
const asymmetricDecrypted = decryptAsymmetric(asymmetricCiphertext, privateKey);

console.log(`Original: ${asymmetricMessage}`);
console.log(`Encrypted: ${asymmetricCiphertext}`);
console.log(`Decrypted: ${asymmetricDecrypted}`);
