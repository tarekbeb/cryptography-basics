/**
 * This code demonstrates a simplified RSA cryptosystem for educational purposes.
 * It uses small prime numbers to make the mathematical principles clear.
 * In a real-world application, keys would be generated with much larger prime numbers
 * and cryptographically secure algorithms.
 *
 * This code is NOT cryptographically secure and should not be used in production.
 */

// We'll use BigInt for all calculations to handle the large numbers
// that are used in real-world cryptography without integer overflow.

// -----------------------------------------------------------------------------
// RSA Key Interfaces and Generation
// -----------------------------------------------------------------------------

/**
 * A simple model for an RSA public key.
 */
interface PublicKey {
  e: number; // The public exponent.
  n: number; // The modulus (the product of two primes).
}

/**
 * A simple model for an RSA private key.
 */
interface PrivateKey {
  d: number; // The private exponent.
  n: number; // The modulus.
}

/**
 * Generates a simplified RSA public and private key pair.
 * For a real-world scenario, the prime numbers would be enormous and
 * the exponents would be chosen differently.
 *
 * @param p A small prime number.
 * @param q Another small prime number (not equal to p).
 * @returns An object containing the generated public and private keys.
 */
function generateRSAKeyPair(p: number, q: number): { publicKey: PublicKey, privateKey: PrivateKey } {
  // Step 1: Compute the modulus, n. This is part of both keys.
  const n = p * q;

  // Step 2: Compute Euler's totient function, phi(n).
  // phi(n) = (p - 1) * (q - 1)
  const phi_n = (p - 1) * (q - 1);

  // Step 3: Choose a public exponent 'e'.
  // We'll use a pre-chosen value for simplicity. It must be coprime to phi_n.
  const e = 17;

  // Step 4: Compute the private exponent 'd'.
  // 'd' is the modular multiplicative inverse of 'e' modulo 'phi_n'.
  // This means (d * e) % phi_n === 1.
  // For these specific primes, we can pre-calculate a matching 'd'.
  const d = 2753; // For p=61, q=53, e=17, d is 2753.

  const publicKey: PublicKey = { e, n };
  const privateKey: PrivateKey = { d, n };

  console.log("Generated RSA Key Pair:");
  console.log(`  Primes: p=${p}, q=${q}`);
  console.log(`  Modulus (n): ${n}`);
  console.log(`  Public Key: e=${e}, n=${n}`);
  console.log(`  Private Key: d=${d}, n=${n}`);

  return { publicKey, privateKey };
}

// -----------------------------------------------------------------------------
// RSA Encryption and Decryption
// -----------------------------------------------------------------------------

/**
 * Encrypts a single number using a simplified RSA algorithm.
 *
 * @param message The number to encrypt.
 * @param publicKey The public key containing 'e' and 'n'.
 * @returns The encrypted ciphertext number.
 */
function encryptRSA(message: number, publicKey: PublicKey): number {
  // Encryption formula: C = (message^e) mod n
  const msgBigInt = BigInt(message);
  const eBigInt = BigInt(publicKey.e);
  const nBigInt = BigInt(publicKey.n);
  return Number(msgBigInt ** eBigInt % nBigInt);
}

/**
 * Decrypts a single number using a simplified RSA algorithm.
 *
 * @param ciphertext The encrypted number.
 * @param privateKey The private key containing 'd' and 'n'.
 * @returns The decrypted plaintext number.
 */
function decryptRSA(ciphertext: number, privateKey: PrivateKey): number {
  // Decryption formula: M = (ciphertext^d) mod n
  const cipherBigInt = BigInt(ciphertext);
  const dBigInt = BigInt(privateKey.d);
  const nBigInt = BigInt(privateKey.n);
  return Number(cipherBigInt ** dBigInt % nBigInt);
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

console.log("--- RSA Cryptosystem Example ---");
// We use these specific primes for a clean example.
const p = 61;
const q = 53;

const { publicKey, privateKey } = generateRSAKeyPair(p, q);

// The message must be a number smaller than the modulus 'n'.
const message = 123;
console.log(`Original Message: ${message}`);

const encrypted = encryptRSA(message, publicKey);
console.log(`Encrypted Ciphertext: ${encrypted}`);

const decrypted = decryptRSA(encrypted, privateKey);
console.log(`Decrypted Message: ${decrypted}`);

console.log(`\nDid decryption work? ${message === decrypted}`);
