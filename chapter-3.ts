/**
 * A simple, non-cryptographic hash function for educational purposes.
 * This function demonstrates key hashing principles like a fixed-size output
 * and the "avalanche effect," where a small change in input drastically
 * changes the output.
 *
 * This function should NOT be used for any security-related application.
 *
 * @param input The string to be hashed.
 * @returns A number representing the hash.
 */
export const simpleHash = (input: string): number => {
  // We'll use a number to represent our fixed-size hash.
  // In a real hash function like SHA-256, the output is a fixed-size bit string.
  let hash = 0;

  // We'll use a prime number as a multiplier to help spread the values
  // and introduce more complexity into the calculation.
  const prime = 31;

  // This loop iterates through each character of the input string.
  for (let i = 0; i < input.length; i++) {
    // Get the character code (a number) for the current character.
    const charCode = input.charCodeAt(i);

    // This is the core mathematical "mixing" operation.
    // 1. We multiply the current hash value by our prime number.
    // 2. We add the character code.
    // 3. The `| 0` is a bitwise OR with 0, which effectively converts the result
    //    to a 32-bit integer. This is a simple way to simulate a fixed-size
    //    output and to introduce an overflow/wrapping effect.
    hash = (hash * prime + charCode) | 0;
  }

  // To ensure the output is always a non-negative number, we can use a bitwise
  // trick to remove the sign bit. This step isn't strictly necessary for the
  // core principle but is a good practice for this kind of function.
  return hash >>> 0;
};

// --- Example Usage ---

const message1 = "Hello, world!";
const hash1 = simpleHash(message1);
console.log(`Hash for "${message1}": ${hash1}`);
// Expected output: a fixed number.

const message2 = "hello, world!"; // Note the lowercase 'h'
const hash2 = simpleHash(message2);
console.log(`Hash for "${message2}": ${hash2}`);
// Expected output: a completely different number due to the "avalanche effect."

const message3 = "Hello, world!"; // Same as message1
const hash3 = simpleHash(message3);
console.log(`Hash for "${message3}": ${hash3}`);
// Expected output: the same number as hash1, demonstrating it is deterministic.
