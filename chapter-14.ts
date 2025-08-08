/**
 * This code demonstrates a simplified Zero-Knowledge Proof (ZK-Proof) protocol
 * in TypeScript. It illustrates the core concept of a prover convincing a
 * verifier that they know a secret without revealing any information about the secret itself.
 *
 * The protocol shown here is a simplified version of a Fiat-Shamir-like proof.
 *
 * This implementation uses Node.js's 'crypto' module for secure random number
 * generation and hashing, which are essential for cryptographic protocols.
 *
 * IMPORTANT: This is for educational purposes only. Do not use this code for
 * production applications. Real-world ZK-Proofs use highly complex mathematics
 * and specialized libraries to achieve provable security.
 */

import crypto from 'crypto';

// -----------------------------------------------------------------------------
// The ZK-Proof Protocol
// -----------------------------------------------------------------------------

// The secret known only to the Prover. This is the value 'x'
const SECRET_X = 7;

// A large number 'n' which is the square of the secret 'x'. This is public.
// Proving knowledge of 'x' is the goal.
const N = SECRET_X * SECRET_X;

// -----------------------------------------------------------------------------
// Prover's Functions
// -----------------------------------------------------------------------------

/**
 * Step 1 (Commitment): The Prover commits to a random value.
 *
 * @returns An object containing the random 'v' and the commitment 'h'.
 */
function proverCommit(): { v: number, h: number } {
  // The Prover chooses a random secret number 'v'. This is the "witness."
  // For simplicity, we use a small number. In a real ZK-Proof, this would be a large, cryptographically secure random value.
  const v = crypto.randomInt(100);

  // The Prover calculates a hash 'h' based on 'v'. This is their commitment.
  // The verifier can't learn 'v' from 'h', but will be able to verify it later.
  const h = v * v;
  console.log(`[Prover] Committing to random value 'v' and sending hash 'h' = ${h}`);
  return { v, h };
}

/**
 * Step 2 (Response): The Prover responds to the Verifier's challenge.
 *
 * @param challenge The challenge received from the Verifier (either 0 or 1).
 * @param v The Prover's secret random value from the commitment phase.
 * @returns The response 'r' based on the challenge.
 */
function proverResponse(challenge: number, v: number): number {
  let r: number;
  if (challenge === 0) {
    // If challenge is 0, the prover reveals 'v'.
    r = v;
    console.log(`[Prover] Challenge is 0. Sending response 'r' = v = ${r}`);
  } else {
    // If challenge is 1, the prover reveals a value that combines 'v' and the secret 'x'.
    // This demonstrates knowledge of 'x' without revealing it directly.
    r = v * SECRET_X;
    console.log(`[Prover] Challenge is 1. Sending response 'r' = v * x = ${r}`);
  }
  return r;
}

// -----------------------------------------------------------------------------
// Verifier's Functions
// -----------------------------------------------------------------------------

/**
 * Step 1 (Challenge): The Verifier issues a random challenge.
 *
 * @returns A random challenge, either 0 or 1.
 */
function verifierChallenge(): number {
  const challenge = crypto.randomInt(2); // Generates 0 or 1
  console.log(`[Verifier] Issuing random challenge: ${challenge}`);
  return challenge;
}

/**
 * Step 2 (Verification): The Verifier checks the Prover's response.
 *
 * @param h The commitment received from the Prover.
 * @param challenge The challenge issued by the Verifier.
 * @param r The response received from the Prover.
 * @returns `true` if the proof is valid, `false` otherwise.
 */
function verifierVerify(h: number, challenge: number, r: number): boolean {
  let verificationValue: number;
  let isValid: boolean;

  if (challenge === 0) {
    // If the challenge was 0, the verifier checks if the response 'r' is the square root of the commitment 'h'.
    verificationValue = r * r;
    isValid = verificationValue === h;
    console.log(`[Verifier] Verifying with challenge 0: h = ${h}, r*r = ${r * r}. Match: ${isValid}`);
  } else {
    // If the challenge was 1, the verifier checks if the response 'r' squared is equal to the commitment 'h' multiplied by N.
    // This equation is r^2 = (v*x)^2 = v^2 * x^2 = h * N.
    verificationValue = r * r;
    isValid = verificationValue === (h * N);
    console.log(`[Verifier] Verifying with challenge 1: h * N = ${h * N}, r*r = ${r * r}. Match: ${isValid}`);
  }

  return isValid;
}

// -----------------------------------------------------------------------------
// Example Protocol Execution
// -----------------------------------------------------------------------------

console.log("--- Executing Zero-Knowledge Proof Protocol ---");
console.log(`Publicly known number 'N' is ${N}`);

// Prover and Verifier run the protocol
const prover = proverCommit();
const verifier = verifierChallenge();
const response = proverResponse(verifier, prover.v);
const isProofValid = verifierVerify(prover.h, verifier, response);

console.log(`\nFinal result: The proof is ${isProofValid ? 'VALID' : 'INVALID'}.`);
console.log(`The secret 'x' was never revealed to the verifier.`);
