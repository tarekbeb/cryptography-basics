/**
 * This code demonstrates a simplified Diffie-Hellman key exchange for educational purposes.
 * It uses a few small numbers to illustrate the core mathematical principles.
 * In a real-world application, the numbers (p, g, a, b) would be much larger.
 * This code is NOT cryptographically secure and should not be used in production.
 */

// We'll use BigInt for all calculations to handle the large numbers
// that are used in real-world cryptography without integer overflow.
// This is a good practice to follow even with our small example numbers.

/**
 * Simulates the entire Diffie-Hellman key exchange process between two parties, Alice and Bob.
 * It shows how they can agree on a shared secret key over an insecure channel.
 *
 * @param p The publicly agreed-upon prime number.
 * @param g The publicly agreed-upon base number.
 * @param a Alice's private secret number.
 * @param b Bob's private secret number.
 * @returns An object containing the final shared secret keys for both Alice and Bob.
 */
function diffieHellmanExchange(p: number, g: number, a: number, b: number) {
  // Convert all numbers to BigInt for secure, large-number math.
  const pBigInt = BigInt(p);
  const gBigInt = BigInt(g);
  const aBigInt = BigInt(a);
  const bBigInt = BigInt(b);

  // --- Step 1: Alice and Bob choose their private secrets (a and b).
  // These are kept hidden.

  // --- Step 2: Alice computes her public key (A).
  // A = (g^a) mod p
  const alicePublicKey = gBigInt ** aBigInt % pBigInt;

  // --- Step 3: Bob computes his public key (B).
  // B = (g^b) mod p
  const bobPublicKey = gBigInt ** bBigInt % pBigInt;

  // --- Step 4: Alice and Bob exchange their public keys (A and B).
  // An eavesdropper can see these keys but cannot easily reverse-engineer
  // the private secrets 'a' or 'b' due to the Discrete Logarithm Problem.

  // --- Step 5: Alice computes the final shared secret (S_alice).
  // S_alice = (B^a) mod p
  // She uses Bob's public key and her own private key.
  const sharedSecretAlice = bobPublicKey ** aBigInt % pBigInt;

  // --- Step 6: Bob computes the final shared secret (S_bob).
  // S_bob = (A^b) mod p
  // He uses Alice's public key and his own private key.
  const sharedSecretBob = alicePublicKey ** bBigInt % pBigInt;

  // Return the results for comparison.
  return {
    alicePublicKey: Number(alicePublicKey),
    bobPublicKey: Number(bobPublicKey),
    sharedSecretAlice: Number(sharedSecretAlice),
    sharedSecretBob: Number(sharedSecretBob),
  };
}

// --- Example Usage ---

// Publicly agreed-upon numbers (known to everyone, including an eavesdropper)
const public_p = 23;
const public_g = 5;

// Private, secret numbers (known only to Alice and Bob, respectively)
const private_a = 6;
const private_b = 15;

console.log("--- Diffie-Hellman Key Exchange Example ---");
console.log(`Public Prime (p): ${public_p}`);
console.log(`Public Base (g): ${public_g}`);
console.log(`Alice's Private Secret (a): ${private_a}`);
console.log(`Bob's Private Secret (b): ${private_b}`);

// Run the exchange process
const result = diffieHellmanExchange(public_p, public_g, private_a, private_b);

console.log("\n--- Exchange Results ---");
console.log(`Alice's Public Key (A): ${result.alicePublicKey}`);
console.log(`Bob's Public Key (B): ${result.bobPublicKey}`);

console.log("\n--- Final Shared Secrets ---");
console.log(`Alice's Shared Secret: ${result.sharedSecretAlice}`);
console.log(`Bob's Shared Secret: ${result.sharedSecretBob}`);

// The check to show that they are the same
console.log(`\nDo the shared secrets match? ${result.sharedSecretAlice === result.sharedSecretBob}`);
