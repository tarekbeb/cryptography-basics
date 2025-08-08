/**
 * This function attempts to solve the Discrete Logarithm Problem (DLP)
 * using a brute-force approach. It is for educational purposes only and
 * is NOT a practical solution for cryptographically secure numbers.
 *
 * The problem: Find the exponent `x` in the equation:
 * (g^x) mod p = y
 *
 * This function works by trying every possible value for `x` until it finds a match.
 *
 * @param g The base number.
 * @param y The result of the modular exponentiation.
 * @param p The modulus (a prime number).
 * @returns The exponent `x` if found, otherwise null.
 */
function solveDiscreteLogarithmBruteForce(g: number, y: number, p: number): number | null {
  console.log(`Attempting to solve for x: (${g}^x) mod ${p} = ${y}`);

  // We'll use BigInt for all calculations to handle the large numbers
  // that would be used in a real-world scenario.
  const gBigInt = BigInt(g);
  const yBigInt = BigInt(y);
  const pBigInt = BigInt(p);

  // The exponent 'x' can range from 1 to p-1. We will check each value.
  for (let x = 1; x < p; x++) {
    const xBigInt = BigInt(x);

    // Compute (g^x) mod p for the current guess of x.
    const result = gBigInt ** xBigInt % pBigInt;

    // If our result matches the target `y`, we've found the solution.
    if (result === yBigInt) {
      console.log(`Success! Found x = ${x}.`);
      return x;
    }
  }

  // If the loop completes without a match, something went wrong.
  console.log("Failed to find a solution.");
  return null;
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

// We'll use the same numbers from our Diffie-Hellman chapter:
// We know that (5^x) mod 23 = 8, and we're trying to find x.
const g = 5;
const y = 8;
const p = 23;

const x = solveDiscreteLogarithmBruteForce(g, y, p);
console.log(`The discrete logarithm for the equation is x = ${x}`);

// --- Note on Scalability ---
// In a real-world scenario, the numbers would be immense. For example,
// `p` might be a prime with hundreds of digits. The loop in this function would
// have to run a number of times equal to the value of `p`, which would take
// millions of years on the fastest supercomputer.
