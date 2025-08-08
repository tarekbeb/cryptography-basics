/**
 * This code demonstrates the creation of a Merkle Tree and the verification
 * of a Merkle Proof. It is a fundamental data structure for verifying data integrity
 * in a decentralized system.
 *
 * This implementation uses the Node.js 'crypto' module for hashing.
 * The core principles remain the same for other languages and hash functions.
 *
 * This is for educational purposes. For production use, always use established
 * cryptographic libraries and practices.
 */

import crypto from 'crypto';

// -----------------------------------------------------------------------------
// Helper Function: SHA-256 Hashing
// -----------------------------------------------------------------------------

/**
 * Computes the SHA-256 hash of a string.
 *
 * @param data The string to hash.
 * @returns The SHA-256 hash as a hexadecimal string.
 */
function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// -----------------------------------------------------------------------------
// Merkle Tree Construction
// -----------------------------------------------------------------------------

/**
 * Builds a Merkle Tree from an array of data blocks.
 *
 * @param dataBlocks An array of strings, where each string is a data block.
 * @returns The root hash of the Merkle Tree.
 */
function buildMerkleTree(dataBlocks: string[]): { tree: string[][], root: string } {
  if (dataBlocks.length === 0) {
    return { tree: [], root: '' };
  }

  // Step 1: Create the leaf nodes by hashing each data block.
  let currentLevel = dataBlocks.map(block => sha256(block));
  const tree: string[][] = [currentLevel];

  // Step 2: Build the tree layer by layer, hashing pairs of nodes.
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    // If the number of nodes is odd, duplicate the last one.
    if (currentLevel.length % 2 !== 0) {
      currentLevel.push(currentLevel[currentLevel.length - 1]);
    }

    for (let i = 0; i < currentLevel.length; i += 2) {
      const combinedHash = sha256(currentLevel[i] + currentLevel[i + 1]);
      nextLevel.push(combinedHash);
    }
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }

  const root = currentLevel[0];
  console.log("Merkle Tree successfully built.");
  return { tree, root };
}

// -----------------------------------------------------------------------------
// Merkle Proof Verification
// -----------------------------------------------------------------------------

/**
 * Verifies if a given data block is part of a Merkle Tree.
 *
 * @param dataBlock The original data block to verify.
 * @param rootHash The known Merkle Root hash.
 * @param proof An array of hashes needed to recompute the path to the root.
 * @param index The index of the data block in the original list.
 * @returns `true` if the proof is valid, `false` otherwise.
 */
function verifyMerkleProof(dataBlock: string, rootHash: string, proof: string[], index: number): boolean {
  // Step 1: Start by hashing the data block.
  let currentHash = sha256(dataBlock);

  // Step 2: Iterate through the proof hashes, re-hashing as we go.
  for (let i = 0; i < proof.length; i++) {
    const proofHash = proof[i];

    // We determine the sibling's position based on the index.
    // The index shifts with each level of the tree.
    if ((index % 2) === 0) { // If our current hash is on the left
      currentHash = sha256(currentHash + proofHash);
    } else { // If our current hash is on the right
      currentHash = sha256(proofHash + currentHash);
    }

    // Move to the next level of the tree.
    index = Math.floor(index / 2);
  }

  // Step 3: Compare the final computed hash with the Merkle Root.
  return currentHash === rootHash;
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

// Sample data blocks
const transactions = [
  "Alice pays Bob $10",
  "Charlie pays David $25",
  "Eve pays Frank $50",
  "Grace pays Heidi $100",
];

const { tree, root } = buildMerkleTree(transactions);
console.log(`Merkle Root: ${root}\n`);

// --- Proving a transaction (e.g., "Charlie pays David $25") ---
const targetTransaction = "Charlie pays David $25";
const targetIndex = 1;

// The proof consists of the sibling hashes on the path to the root.
// For index 1 (H1), we need H0 and H23.
const merkleProof = [
  sha256(transactions[0]), // Sibling of H1 is H0
  tree[1][1],             // Sibling of H01 is H23
];

const isValid = verifyMerkleProof(targetTransaction, root, merkleProof, targetIndex);
console.log(`Is the transaction valid? ${isValid}\n`);

// --- Proving a tampered transaction (will fail) ---
const tamperedTransaction = "Charlie pays David $1000";
const isTampered = verifyMerkleProof(tamperedTransaction, root, merkleProof, targetIndex);
console.log(`Is the tampered transaction valid? ${isTampered}`);
