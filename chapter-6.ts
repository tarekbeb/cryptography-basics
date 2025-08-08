/**
 * This code demonstrates the mathematical principles of modular arithmetic, which is
 * fundamental to modern cryptography.
 *
 * It includes functions for basic modular reduction and modular exponentiation,
 * which is the core "trap door" operation used in protocols like Diffie-Hellman and RSA.
 */

// We'll use BigInt for all calculations to handle the large numbers
// that are used in real-world cryptography without integer overflow.

// -----------------------------------------------------------------------------
// Basic Modular Arithmetic
// -----------------------------------------------------------------------------

/**
 * Performs a basic modular reduction.
 *
 * @param a The number to be divided.
 * @param n The modulus (the number we're dividing by).
 * @returns The remainder of a divided by n.
 */
function modulo(a: number | bigint, n: number | bigint): number {
  const aBigInt = BigInt(a);
  const nBigInt = BigInt(n);
  // The % operator in JavaScript can produce negative results for negative a,
  // so a more robust method is often required for true modular arithmetic.
  // We'll use a simple approach for our positive number examples.
  return Number(aBigInt % nBigInt);
}

// -----------------------------------------------------------------------------
// Modular Exponentiation (The Trap Door Function)
// -----------------------------------------------------------------------------

/**
 * Computes modular exponentiation: (base^exponent) mod modulus.
 * This is the crucial operation that enables the security of protocols like Diffie-Hellman.
 *
 * @param base The base number.
 * @param exponent The exponent.
 * @param modulus The modulus.
 * @returns The result of the modular exponentiation.
 */
function modularExponentiation(base: number | bigint, exponent: number | bigint, modulus: number | bigint): number {
  const baseBigInt = BigInt(base);
  const exponentBigInt = BigInt(exponent);
  const modulusBigInt = BigInt(modulus);

  // BigInt has a built-in modular exponentiation method which is very efficient.
  // We use this to compute (base^exponent) % modulus.
  const result = baseBigInt ** exponentBigInt % modulusBigInt;

  return Number(result);
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

console.log("--- Basic Modular Arithmetic Examples ---");
// Clock analogy: 10 o'clock + 5 hours is 3 o'clock on a 12-hour clock.
const clockTime = modulo(10 + 5, 12);
console.log(`(10 + 5) mod 12 = ${clockTime}`); // Expected: 3

// A more direct example.
const remainderExample = modulo(17, 5);
console.log(`17 mod 5 = ${remainderExample}`); // Expected: 2

console.log("\n--- Modular Exponentiation Example (from Diffie-Hellman) ---");
const base_g = 5;
const exponent_a = 6;
const modulus_p = 23;
const diffieHellmanExample = modularExponentiation(base_g, exponent_a, modulus_p);
console.log(`(${base_g}^${exponent_a}) mod ${modulus_p} = ${diffieHellmanExample}`); // Expected: 8
