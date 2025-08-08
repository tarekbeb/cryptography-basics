# Applied Cryptography course

## Chapter 1: The Trap Door Function

Imagine a secret room with a very special door. This door is designed so that anyone can walk through it easily from one side, but it is nearly impossible to get back through it from the other side. You'd be trapped. However, there is a secret key—a trap door—that allows the one person who possesses it to open the door from the "trapped" side and walk back out.

This is the central idea behind a trap door function. In cryptography, it’s a mathematical function that is simple to compute in one direction, but computationally infeasible to reverse without a special, secret piece of information. With this secret, the reversal becomes trivial.

The trap door function is a cornerstone of modern public-key cryptography. It allows us to create a system where we can have a public key that anyone can use to encrypt a message, but only a single person with the corresponding private key can decrypt it. The one-way function is the encryption, and the trap door is the private key.

### The Prime Number Example

One of the most famous examples of a trap door function is built on the challenge of prime factorization.

Consider two prime numbers, which we'll call `p` and `q`. For this example, let's use small numbers to keep it simple:

- `p = 13`
- `q = 17`

It is extremely easy and fast to compute their product, `N`:

- `N = p × q`
- `N = 13 × 17`
- `N = 221`

This is the "easy direction" of the function.

Now, the "hard direction": given only `N = 221`, finding the original prime factors `p` and `q` is much harder. This process—prime factorization—becomes computationally infeasible for numbers that are hundreds of digits long.

### The Secret Trap Door

The secret "trap door" is the knowledge of the original prime factors `p` and `q`.

- Easy: given `p` and `q`, compute `N = p × q`.
- Hard: given `N`, find `p` and `q`.
- Trap door: knowing `p` and `q` makes the hard direction trivial.

Check `chapter-1.ts` for an example of trying to get the prime factors.

## Chapter 2: Understanding Symmetric vs. Public-Key Cryptography

There are two primary ways to encrypt and decrypt information: using a symmetric key or using public/private key pairs.

### Symmetric-Key Cryptography

Symmetric-key cryptography uses a single, shared secret key for both encrypting and decrypting a message.

- Alice and Bob share the same key.
- Alice encrypts with the key; Bob decrypts with the same key.
- Pros: very fast (e.g., AES).
- Cons: key distribution problem.

### Public-Key Cryptography (Asymmetric)

Asymmetric cryptography uses a pair of mathematically related keys: a public key and a private key. What one key encrypts, only the other can decrypt.

- Everyone can know the public key; only the owner knows the private key.
- Alice encrypts with Bob’s public key; only Bob can decrypt with his private key.
- Pros: solves key distribution, supports digital signatures.
- Cons: much slower than symmetric encryption.

### Why We Use Both: Hybrid Systems

- Use public-key cryptography to exchange a temporary symmetric key.
- Use that symmetric key for fast, bulk encryption.

### Summary Comparison

- Number of Keys: one shared secret (symmetric) vs. public/private pair (asymmetric)
- Purpose: data encryption (symmetric) vs. key exchange, signatures, small-data encryption (asymmetric)
- Speed: very fast (symmetric) vs. much slower (asymmetric)
- Key Distribution: must share securely (symmetric) vs. public key can be shared openly (asymmetric)
- Examples: AES, DES (symmetric) vs. RSA, ECC (asymmetric)

## Chapter 3: Understanding Hashing

Hashing is a one-way function that maps data of arbitrary size to a fixed-size output (a hash).

### What is a Hash Function?

- Takes any input and produces a fixed-size output.
- Example: `SHA-256` always returns 256 bits.

### Key Properties of a Cryptographic Hash Function

- Deterministic: same input → same output.
- One-way: infeasible to recover input from hash.
- Collision resistant: hard to find two inputs with the same hash.
- Avalanche effect: tiny input change → drastically different hash.

### Why is Hashing Useful?

- Data integrity checks (compare hashes).
- Password storage (store hashes, not plaintext).
- Blockchains and digital signatures.

## Chapter 4: Understanding Signing

A digital signature uses hashing and public-key cryptography to provide authentication, integrity, and non-repudiation.

### How Digital Signing Works

#### Creating the Signature (Alice)

1. Hash the message (e.g., `SHA-256`).
2. Encrypt the hash with her private key → the digital signature.
3. Send the message + signature to Bob.

#### Verifying the Signature (Bob)

1. Decrypt the signature with Alice’s public key to get the original hash.
2. Hash the received message himself.
3. Compare hashes: match → authentic and unaltered.

### Why Digital Signatures are Important

- Authentication, integrity, and non-repudiation.

## Chapter 5: Understanding the Diffie-Hellman Exchange

Diffie-Hellman (DH) lets two parties establish a shared secret over an insecure channel.

### The Paint-Mixing Analogy

- Share a public color; each party mixes with a private color.
- Exchange mixtures; mix again with your private color.
- Both end up with the same final color; eavesdropper cannot “unmix.”

### The Mathematical Magic

Publicly shared values:

- `p = 23`
- `g = 5`

Private secrets:

- Alice: `a = 6`
- Bob: `b = 15`

Public keys:

- `A = g^a (mod p) = 5^6 (mod 23) = 8`
- `B = g^b (mod p) = 5^15 (mod 23) = 19`

Shared secret:

- Alice: `S = B^a (mod p) = 19^6 (mod 23) = 2`
- Bob:   `S = A^b (mod p) = 8^15 (mod 23) = 2`

Security relies on the discrete logarithm problem (hard to recover `a` or `b`).

## Chapter 6: Understanding Modular Arithmetic

Modular arithmetic is arithmetic with wrap-around at a modulus.

### The Clock Analogy

- `(10 + 5) (mod 12) = 3`

### How It Works

- `17 mod 5 = 2`
- `25 mod 7 = 4`
- `24 mod 12 = 0`

### Why It's Useful for Cryptography

Modular exponentiation is easy; reversing it (discrete log) is hard. Example: `5^6 (mod 23) = 8`.

## Chapter 7: Understanding the Discrete Logarithm Problem

The discrete logarithm problem (DLP) is the inverse of modular exponentiation.

- Easy: `y = g^x (mod p)`.
- Hard: given `g, p, y`, find `x` such that `g^x ≡ y (mod p)`.

This “trap door” protects DH.

## Chapter 8: Understanding RSA

RSA enables encryption and digital signatures; security is based on factoring difficulty.

### Key Generation

1. Choose large primes `p, q`.
2. Compute `n = p × q`.
3. Compute `φ(n) = (p − 1)(q − 1)`.
4. Choose `e` with `1 < e < φ(n)` and `gcd(e, φ(n)) = 1`.
5. Compute `d` such that `d × e ≡ 1 (mod φ(n))`.
6. Public key `(e, n)`, private key `(d, n)`.

### Encryption and Decryption

- Encrypt: `C = M^e (mod n)`
- Decrypt: `M = C^d (mod n)`

Security: infeasible to recover `d` without factoring `n`.

## Chapter 9: Elliptic Curve Cryptography (ECC) and ECDH

ECC uses arithmetic on elliptic curve points; security relies on the elliptic curve discrete log problem (ECDLP). Offers same security as RSA with smaller keys.

ECDH (elliptic-curve Diffie-Hellman):

- Public parameters: curve and base point `G`.
- Private keys: `a`, `b`.
- Public keys: `A = aG`, `B = bG`.
- Shared secret: `S = aB = bA = (ab)G`.

## Chapter 10: From Shared Secret to Secure Communication

Encrypting with a symmetric key alone isn’t enough. We also need:

- Confidentiality
- Integrity
- Authenticity

### Initialization Vector (IV)

Random, non-secret value ensuring identical plaintexts produce different ciphertexts. Sent alongside ciphertext.

### Message Authentication Code (MAC)

Tag calculated over ciphertext (and IV) with a secret key to ensure authenticity and integrity.

### Secure Message Format

`Plaintext -> Encrypt -> { iv, ciphertext, mac } -> Send -> Receiver`

## Chapter 11: Understanding Merkle Trees

Merkle trees provide efficient integrity proofs for large datasets.

### Building a Merkle Tree

Given data blocks `D0..D3`:

- Leaves: `H0 = hash(D0)`, `H1 = hash(D1)`, `H2 = hash(D2)`, `H3 = hash(D3)`
- Parents: `H01 = hash(H0 + H1)`, `H23 = hash(H2 + H3)`
- Root: `H0123 = hash(H01 + H23)`

Changing any bit in the data changes the Merkle root.

### Merkle Proof

To prove `D0` is included:

- Provide `D0`, `H1`, `H23`, and the Merkle root.
- Recompute: `H0 = hash(D0)`, `H01 = hash(H0 + H1)`, `root = hash(H01 + H23)`.
- Compare to the official root.

## Chapter 12: Understanding Shannon Entropy

Entropy measures uncertainty/randomness in data.

### Formula

`H(X) = - Σ P(x_i) log2 P(x_i)`

### Why It Matters

- Strong keys require high entropy.
- CSPRNGs must output high-entropy values.
- Password strength correlates with entropy.

## Chapter 13: The Yates (Fisher–Yates) Shuffle

An unbiased algorithm to generate a random permutation of a list.

Basic idea (in-place, from end to start): at index `i`, pick random `j ∈ [0, i]`, swap `a[i]` and `a[j]`.

Properties: unbiased and efficient; security depends on randomness quality.

## Chapter 14: Understanding Zero-Knowledge Proofs

Prove a statement is true without revealing any information beyond its truth.

### Properties

- Completeness, Soundness, Zero-Knowledge.

### Applications

- Blockchain privacy (e.g., Zcash)
- Authentication without revealing secrets
- Verifiable computation without exposing data

## Chapter 16: A Deep Dive into the TLS Protocol

TLS handshake establishes a secure channel between client and server.

### Phase 1: Hello

- ClientHello: highest TLS version, cipher suites, compression, client random.
- ServerHello: chosen version, cipher suite, server random.

### Phase 2: Key Exchange and Server Authentication

- Server Certificate (verified via CA).
- Server Key Exchange (e.g., ECDHE parameters, signed).
- Client Key Exchange (client’s ECDH public key, shared secret derived).

### Phase 3: Finished

- Derive keys from client random, server random, and shared secret.
- ChangeCipherSpec from both sides.
- Finished messages (hash of prior handshake messages, encrypted).

### Phase 4: Encrypted Application Data

All further data uses symmetric encryption with IVs and MACs (or AEAD).

## Chapter 17: A Cryptography Handbook — The Final Word

### The Foundation

- Symmetric-key crypto: fast, shared secret, distribution challenge.
- Asymmetric-key crypto: public/private pairs, solves distribution, slower.
- Hash functions: tamper-evident fingerprints.

### Securing the Exchange

- DH/ECDH: shared secret over insecure channels.
- RSA: encryption and signatures; security from factoring hardness.

### From Key to Conversation

- Digital signatures: authenticity and integrity.
- IVs and MACs: secure, tamper-evident communication.

### Beyond the Basics

- Merkle trees, entropy, Fisher–Yates shuffle, zero-knowledge proofs.

### Real-World Examples

- TLS: ECDH, signatures, randomness, IVs, MACs.
- Bitcoin/Ethereum: asymmetric keys, signatures, hashes, Merkle trees, entropy.

You now have a strong foundation to keep exploring modern cryptography.
