# Cryptography Basics — Book and TS Examples

A small, practical applied cryptography handbook with companion TypeScript snippets. The full book is in `GUIDE.md`, and each `chapter-*.ts` file demonstrates a core idea in a tiny, didactic example.

- Read the book: see `GUIDE.md`
- Browse examples: `chapter-*.ts`

## Contents

- `GUIDE.md` — the complete, formatted guide (headings, lists, and inline math like `g^a (mod p)`, `N = p × q`)
- `README.doc` — original document version (kept for reference)
- TypeScript examples (small, focused, and intentionally non‑production):
  - `chapter-1.ts` — trapdoor functions and prime factorization (toy factor search)
  - `chapter-2.ts` — symmetric vs. public‑key crypto (high‑level demo)
  - `chapter-3.ts` — hashing basics (e.g., SHA‑256 usage patterns)
  - `chapter-4.ts` — digital signatures (hash → sign → verify flow)
  - `chapter-5.ts` — Diffie–Hellman key exchange (small‑number walkthrough)
  - `chapter-6.ts` — modular arithmetic helpers and examples
  - `chapter-7.ts` — discrete logarithm intuition (forward vs. inverse)
  - `chapter-8.ts` — RSA basics (key parts; tiny worked example)
  - `chapter-9.ts` — ECC/ECDH concepts (points, keys, shared secret)
  - `chapter-10.ts` — from shared secret to secure messages (IV + MAC shape)
  - `chapter-11.ts` — Merkle trees (hash leaves, root, simple proof)
  - `chapter-12.ts` — Shannon entropy (randomness, implications)
  - `chapter-13.ts` — Fisher–Yates (Yates) shuffle (unbiased permutation)
  - `chapter-14.ts` — zero‑knowledge proofs (intuition, toy patterns)
  - `chapter-15.ts` — extra helpers used across examples

Note: The examples use tiny, insecure parameters to make the math transparent. They’re for learning, not for production security.

Pair the code with the relevant section in `GUIDE.md` for context and explanations.