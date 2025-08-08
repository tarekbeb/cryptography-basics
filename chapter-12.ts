/**
 * This code demonstrates a simplified calculation of Shannon Entropy for a given string.
 *
 * Shannon Entropy quantifies the amount of uncertainty or randomness in a set of data.
 * The result is measured in "bits per character." A higher value indicates
 * more randomness, while a lower value indicates more predictability.
 *
 * This implementation assumes a simple character-based source for clarity.
 */

/**
 * Calculates the Shannon Entropy of a string.
 *
 * @param data The input string to calculate entropy for.
 * @returns The entropy value in bits per character.
 */
function calculateShannonEntropy(data: string): number {
  if (data.length === 0) {
    return 0;
  }

  // Step 1: Count the frequency of each character in the string.
  const frequencies = new Map<string, number>();
  for (const char of data) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  const totalLength = data.length;
  let entropy = 0;

  // Step 2: Calculate the entropy using the formula:
  // H(X) = - Σ [ P(xi) * log2(P(xi)) ]
  // Where P(xi) is the probability of character xi.
  for (const frequency of frequencies.values()) {
    const probability = frequency / totalLength;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

// Example 1: A highly predictable string (low entropy)
const predictableString = "AAAAAAAAAAAAAAAAAAAA";
const predictableEntropy = calculateShannonEntropy(predictableString);
console.log(`String: "${predictableString}"`);
console.log(`Entropy: ${predictableEntropy.toFixed(3)} bits/character\n`);
// Interpretation: Since there is only one character, there is no uncertainty.

// Example 2: A less predictable string (higher entropy)
const randomString = "abcdefghijklmnopqrstuvwxyz";
const randomEntropy = calculateShannonEntropy(randomString);
console.log(`String: "${randomString}"`);
console.log(`Entropy: ${randomEntropy.toFixed(3)} bits/character\n`);
// Interpretation: All characters appear once, maximizing the entropy.

// Example 3: A mixed string
const mixedString = "Hello, world!";
const mixedEntropy = calculateShannonEntropy(mixedString);
console.log(`String: "${mixedString}"`);
console.log(`Entropy: ${mixedEntropy.toFixed(3)} bits/character\n`);
// Interpretation: The entropy is somewhere in between due to repeated characters.
