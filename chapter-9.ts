/**
 * This code demonstrates a simplified Elliptic Curve Diffie-Hellman (ECDH) key exchange
 * for educational purposes. It uses a very simple elliptic curve over a small prime field.
 *
 * This code is NOT cryptographically secure and should not be used in production.
 */

// We will use a simple elliptic curve equation of the form:
// y^2 = x^3 + ax + b (mod p)
// For our example, we'll use the curve: y^2 = x^3 + x + 1 (mod 23)

// -----------------------------------------------------------------------------
// Elliptic Curve Parameters
// -----------------------------------------------------------------------------

// We define a point on the curve with x and y coordinates.
interface Point {
  x: number | null;
  y: number | null;
}

// The parameters of our elliptic curve y^2 = x^3 + ax + b (mod p).
const p = 23; // The prime modulus.
const a = 1;  // The coefficient 'a'.
const b = 1;  // The coefficient 'b'.
const G: Point = { x: 1, y: 7 }; // The public base point 'G'.

// The point at infinity, which is the identity element in our point addition.
const O: Point = { x: null, y: null };

// -----------------------------------------------------------------------------
// Elliptic Curve Operations
// -----------------------------------------------------------------------------

/**
 * Calculates the modular inverse of a number 'n' modulo 'p'.
 * This is a helper function needed for point addition. It finds 'x' such that (n * x) % p = 1.
 *
 * @param n The number to find the inverse for.
 * @param p The modulus.
 * @returns The modular inverse.
 */
function modularInverse(n: number, p: number): number {
  n = ((n % p) + p) % p;
  for (let x = 1; x < p; x++) {
    if ((n * x) % p === 1) {
      return x;
    }
  }
  return 0; // Should not happen with valid inputs.
}

/**
 * Adds two points 'P' and 'Q' on the elliptic curve.
 * This is the core "point addition" operation.
 *
 * @param P The first point.
 * @param Q The second point.
 * @returns The resulting point R = P + Q.
 */
function addPoints(P: Point, Q: Point): Point {
  // If one of the points is the point at infinity, the result is the other point.
  if (P.x === null) return Q;
  if (Q.x === null) return P;

  let slope;

  // Case 1: P and Q are the same point (P + P).
  if (P.x === Q.x && P.y === Q.y) {
    // The slope is calculated using the formula: (3x^2 + a) * (2y)^-1 (mod p)
    const numerator = (3 * P.x * P.x + a);
    const denominator = (2 * P.y);
    slope = (numerator * modularInverse(denominator, p)) % p;
  }
  // Case 2: P and Q are different points.
  else {
    // The slope is calculated using the formula: (y2 - y1) * (x2 - x1)^-1 (mod p)
    const numerator = (Q.y! - P.y!);
    const denominator = (Q.x! - P.x!);
    slope = (numerator * modularInverse(denominator, p)) % p;
  }

  // Calculate the new point's coordinates (R).
  const xR = (slope * slope - P.x! - Q.x!) % p;
  const yR = (slope * (P.x! - xR) - P.y!) % p;

  // Ensure results are positive.
  const finalX = ((xR % p) + p) % p;
  const finalY = ((yR % p) + p) % p;

  return { x: finalX, y: finalY };
}

/**
 * Performs scalar multiplication: P added to itself 'k' times.
 * This is the heart of generating a public key from a private key.
 *
 * @param k The private secret number (scalar).
 * @param P The point to multiply.
 * @returns The resulting public key point.
 */
function scalarMultiply(k: number, P: Point): Point {
  let result: Point = O; // Start with the point at infinity.
  let addend: Point = P;

  // This is a simplified "double-and-add" algorithm.
  while (k > 0) {
    if (k % 2 === 1) {
      result = addPoints(result, addend);
    }
    addend = addPoints(addend, addend);
    k = Math.floor(k / 2);
  }

  return result;
}

// -----------------------------------------------------------------------------
// ECDH Exchange Simulation
// -----------------------------------------------------------------------------

console.log("--- Elliptic Curve Diffie-Hellman Exchange Example ---");
console.log(`Publicly agreed curve: y^2 = x^3 + ${a}x + ${b} (mod ${p})`);
console.log(`Public base point G: (${G.x}, ${G.y})`);

// --- Alice's Side ---
const private_a = 6; // Alice's secret number.
const public_A = scalarMultiply(private_a, G); // Alice's public point.
console.log(`\nAlice's private key (a): ${private_a}`);
console.log(`Alice's public key (A): (${public_A.x}, ${public_A.y})`);

// --- Bob's Side ---
const private_b = 15; // Bob's secret number.
const public_B = scalarMultiply(private_b, G); // Bob's public point.
console.log(`\nBob's private key (b): ${private_b}`);
console.log(`Bob's public key (B): (${public_B.x}, ${public_B.y})`);

// --- The Shared Secret Calculation ---
// Both Alice and Bob can now compute the same shared secret point.
const sharedSecretAlice = scalarMultiply(private_a, public_B); // Alice computes a*B.
const sharedSecretBob = scalarMultiply(private_b, public_A);  // Bob computes b*A.

console.log("\n--- Final Shared Secrets ---");
console.log(`Alice's Shared Secret (aB): (${sharedSecretAlice.x}, ${sharedSecretAlice.y})`);
console.log(`Bob's Shared Secret (bA): (${sharedSecretBob.x}, ${sharedSecretBob.y})`);

console.log(`\nDo the shared secrets match? ${sharedSecretAlice.x === sharedSecretBob.x && sharedSecretAlice.y === sharedSecretBob.y}`);
