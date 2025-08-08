/**
 * This code demonstrates the Yates Shuffle algorithm in TypeScript.
 *
 * The Yates Shuffle is a simple, efficient, and provably unbiased algorithm
 * for generating a random permutation of a finite sequence. This is the
 * standard for shuffling things like decks of cards or lists of data.
 *
 * For cryptographic security, this implementation uses a secure random number
 * generator from Node.js's 'crypto' module.
 */

import crypto from 'crypto';

// -----------------------------------------------------------------------------
// Core Algorithm
// -----------------------------------------------------------------------------

/**
 * Performs a Yates Shuffle on an array in place.
 *
 * The algorithm iterates from the last element to the first, and at each step,
 * it swaps the current element with a randomly chosen element from the
 * unshuffled portion of the array.
 *
 * @param array The array to be shuffled. The original array is modified.
 */
function yatesShuffle<T>(array: T[]): void {
  // Start from the last element and work backwards.
  for (let i = array.length - 1; i > 0; i--) {
    // Choose a random index from 0 to i (inclusive).
    // We use crypto.randomInt for cryptographic security.
    const j = crypto.randomInt(i + 1);

    // Swap the element at index i with the element at index j.
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// -----------------------------------------------------------------------------
// Example Usage
// -----------------------------------------------------------------------------

const deckOfCards = [
  "Ace of Spades", "2 of Spades", "3 of Spades", "4 of Spades", "5 of Spades",
  "Ace of Hearts", "2 of Hearts", "3 of Hearts", "4 of Hearts", "5 of Hearts"
];

console.log("--- Original Deck ---");
console.log(deckOfCards.join(", "));

// Perform the shuffle in place.
yatesShuffle(deckOfCards);

console.log("\n--- Shuffled Deck ---");
console.log(deckOfCards.join(", "));

// Another example with numbers
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("\n--- Original Numbers ---");
console.log(numbers.join(", "));

yatesShuffle(numbers);

console.log("\n--- Shuffled Numbers ---");
console.log(numbers.join(", "));
