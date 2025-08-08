Cryptography Basics

Chapter 1: The Trap Door Function
Imagine a secret room with a very special door. This door is designed so that anyone can walk through it easily from one side, but it is nearly impossible to get back through it from the other side. You'd be trapped. However, there is a secret key—a trap door—that allows the one person who possesses it to open the door from the "trapped" side and walk back out.

This is the central idea behind a trap door function. In cryptography, it’s a mathematical function that is simple to compute in one direction, but computationally infeasible to reverse without a special, secret piece of information. With this secret, the reversal becomes trivial.

The trap door function is a cornerstone of modern public-key cryptography, a concept we'll explore in detail in the next chapter. It allows us to create a system where we can have a public key that anyone can use to encrypt a message, but only a single person with the corresponding private key can decrypt it. The one-way function is the encryption, and the trap door is the private key.

The Prime Number Example
One of the most famous examples of a trap door function is built on the challenge of prime factorization.

Consider two very large prime numbers, which we'll call p and q. For this example, let's use small numbers to keep it simple:

p=13
q=17

It is extremely easy and fast to compute their product, N.

N=p×q
N=13×17
N=221

This is the "easy direction" of the function. Anyone with a calculator or a computer can perform this multiplication in a fraction of a second, even with numbers that are hundreds of digits long.

Now, let's look at the "hard direction". If I only gave you the number N=221 and asked you to find the original prime factors, p and q, the task becomes much more difficult. You would have to try dividing 221 by various prime numbers until you found one that divides it evenly. This process is called prime factorization. For a small number like 221, it's not too bad, but for numbers that are hundreds of digits long, this process would take even the most powerful supercomputers an impossibly long time—thousands, or even millions, of years.

The Secret Trap Door
So, what is the secret "trap door" in this function? It's simply the knowledge of the original prime factors, p and q.

If you know that p=13 and q=17, reversing the function from N=221 is a non-issue; you already know the answer. This is the secret information that makes the reversal easy.

In this simple example, the trap door function can be summarized as:

Easy Direction: Given two large prime numbers p and q, compute N=p×q.

Hard Direction: Given the number N, find the prime factors p and q.

Trap Door: The secret information that makes the hard direction easy is the knowledge of p and q.

This simple but powerful idea forms the basis for how we can securely communicate over the internet.

Check chapter-1.ts file for an example of how you would try to get the prime factors.

Chapter 2: Symmetric vs. Public-Key Cryptography
In the world of cryptography, there are two primary ways to encrypt and decrypt information: using a symmetric key or using public/private key pairs. The choice between them depends on a trade-off between speed, security, and convenience.

Symmetric-Key Cryptography
Imagine you and a friend want to pass secret notes in class. You both agree on a single, shared secret codebook to encrypt and decrypt your messages. This is the core of symmetric-key cryptography.

Symmetric-key cryptography uses a single, shared secret key for both encrypting a message and decrypting it. The same key is used by both the sender and the receiver.

How it works: Alice wants to send a secret message to Bob. They both have a copy of the same secret key. Alice uses this key to encrypt the message, turning it into unreadable ciphertext. She then sends the ciphertext to Bob. Bob uses the exact same key to decrypt the message, revealing the original plaintext.

Pros: It's incredibly fast and efficient. Symmetric algorithms like AES (Advanced Encryption Standard) are widely used and are great for encrypting large amounts of data.

Cons: The biggest challenge is the key distribution problem. How do Alice and Bob securely exchange the secret key in the first place? If an eavesdropper intercepts the key, all their future messages can be read.

Public-Key Cryptography (Asymmetric)
Now, imagine you have a special mailbox with a mail slot on the street. Anyone can drop a letter into the slot, but only you have the unique key to open the mailbox and retrieve the letters. This is a good analogy for public-key cryptography.

Public-key cryptography, also known as asymmetric cryptography, uses a pair of mathematically related keys: a public key and a private key. What one key encrypts, only the other can decrypt.

How it works: Each person has a public key (which is shared with everyone) and a private key (which is kept secret).

To send a secret message to Bob, Alice gets Bob's public key. She uses it to encrypt the message.

She sends the encrypted message to Bob. Even if someone intercepts it, they cannot decrypt it with Bob's public key.

Bob is the only one who can decrypt the message, because he's the only one who possesses the corresponding private key.

Pros: It solves the key distribution problem. You don't need a secure channel to share keys. The public key can be freely shared. It's also used for digital signatures, which we'll cover later.

Cons: It is much, much slower and more computationally intensive than symmetric-key cryptography. For this reason, it is not practical for encrypting large files.

Why We Use Both: Hybrid Systems
Since symmetric-key encryption is fast and public-key encryption is good for key exchange, they're often used together in a hybrid system. A common scenario is:

Use public-key cryptography to securely exchange a temporary, symmetric secret key.

Use that newly exchanged symmetric key to encrypt and decrypt the rest of the communication, which is much faster.

This is the principle behind protocols like TLS/SSL, which secure most of the websites you visit every day.

Summary Comparison
Feature

Symmetric-Key Cryptography

Public-Key Cryptography

Number of Keys

One shared secret key

A public key and a private key

Purpose

Encryption/decryption of data

Secure key exchange, digital signatures, encryption/decryption of small data

Speed

Very fast

Very slow

Key Distribution

Must be shared securely (a major challenge)

Public key can be shared openly

Examples

AES, DES

RSA, ECC

Chapter 3: Understanding Hashing
Hashing is a core concept in cryptography and computer science. Unlike encryption, which is a two-way street (you can encrypt and then decrypt), hashing is a one-way function. You can't "un-hash" a message. Think of it like taking a document and creating a unique fingerprint for it.

What is a Hash Function?
A hash function takes an input of any size (like a message, a file, or a password) and produces a fixed-size, seemingly random output called a hash value, a hash code, or simply a hash.

No matter if you hash the single letter "a" or an entire encyclopedia, the hash will always have the same length. For example, a common hash function like SHA-256 (Secure Hash Algorithm) always produces a 256-bit hash, no matter the size of the input.

Key Properties of a Cryptographic Hash Function
To be useful for cryptography, a hash function must have these critical properties:

Deterministic: The same input will always produce the same output. If you hash the phrase "The quick brown fox" today, a week from now, or a year from now, you will get the exact same hash value.

Irreversible (One-Way): Given a hash value, it should be computationally impossible to figure out the original input. This is the one-way "trap door" aspect of hashing.

Collision Resistant: It should be computationally infeasible to find two different inputs that produce the same output hash. Finding a "collision" would undermine the security of the hash function.

Avalanche Effect: Even a tiny change to the input (like changing a single letter or character) should produce a completely different hash output. This makes it impossible to guess what the original input was by observing the hash.

Why is Hashing Useful?
Hashing is used everywhere, often without you even realizing it. Here are a few examples:

Verifying Data Integrity: When you download a file, the website might provide its hash. You can hash the file on your end, and if the hashes match, you can be sure the file wasn't corrupted or tampered with during the download.

Password Storage: Websites never store your actual password. Instead, they store a hash of your password. When you log in, they hash the password you just entered and compare it to the stored hash. If they match, you're in! This way, even if a database is breached, the attacker only gets the hashes, not the passwords themselves.

Blockchain and Digital Signatures: Hashing is the fundamental building block of blockchain technology. Each block contains a hash of the previous block, creating a secure, unchangeable chain.

In the next chapter, we'll see how hashing combines with asymmetric cryptography to create digital signatures, which are a cornerstone of modern digital trust.

Chapter 4: Understanding Digital Signing
In the physical world, a signature on a document serves two purposes: it proves that the document is authentic and that it hasn't been tampered with after being signed. In the digital world, we achieve the same goals using a digital signature.

A digital signature is a cryptographic mechanism that uses a combination of hashing and public-key cryptography to provide authentication, integrity, and non-repudiation for a digital message or document.

How Digital Signing Works
The process of creating and verifying a digital signature involves a few key steps. Let's use our friends Alice and Bob again to walk through it.

Creating the Signature (Alice's Side)
Hash the Message: Alice writes a message for Bob. She takes her entire message and runs it through a cryptographic hash function (like SHA-256). This creates a unique, fixed-size hash value—a "fingerprint" of her message.

Encrypt the Hash: This is the most crucial step. Alice takes the hash and encrypts it using her own private key. Remember from the last chapter that anything encrypted with her private key can only be decrypted with her public key. The result of this encryption is the digital signature.

Send the Package: Alice sends both the original, unencrypted message and the digital signature to Bob. The message is sent in plain text, but the signature proves it's from her and is unaltered.

Verifying the Signature (Bob's Side)
Decrypt the Signature: When Bob receives the package, he first takes the digital signature and decrypts it using Alice's public key. If Alice's public key successfully decrypts the signature, Bob knows two things:

The signature must have been created with Alice's private key. This proves the message is truly from Alice (Authentication).

The decrypted value is the original hash of the message that Alice created.

Hash the Message (Again): Bob then takes the original, unencrypted message he received and hashes it himself using the exact same hash function that Alice used.

Compare the Hashes: Finally, Bob compares the hash value he just created with the hash value he got from decrypting the signature.

If the two hashes match, he knows the message was not altered in any way since Alice signed it (Integrity).

If they don't match, he knows someone must have tampered with the message in transit.

Why Digital Signatures are Important
Authentication: It proves the identity of the sender because only the owner of the private key could have created the signature.

Integrity: It guarantees that the message has not been changed since it was signed. Even a single character change would produce a completely different hash, causing the verification to fail.

Non-Repudiation: The sender cannot later deny that they signed and sent the message, as the private key is their exclusive cryptographic identity.

Digital signatures are the foundation of trust in a digital world. They're used in everything from code repositories to secure email and software updates.

Chapter 5: Understanding the Diffie-Hellman Exchange
The Diffie-Hellman Exchange is a groundbreaking cryptographic protocol that allows two parties to establish a shared secret key over an insecure communication channel. Even if a third party is listening to their entire conversation, they can't figure out the secret key. This elegantly solves the "key distribution problem" that we identified in symmetric-key cryptography.

The Paint-Mixing Analogy
The easiest way to understand the Diffie-Hellman Exchange is with an analogy. Imagine Alice and Bob want to agree on a secret color without an eavesdropper, Eve, knowing what it is.

Publicly Shared Color: Alice and Bob agree on a public, shared starting color (e.g., yellow). Eve can also see this color.

Private Secret Colors: Alice and Bob each choose a secret color that no one else knows. Alice chooses secret blue and Bob chooses secret red.

Mixing the Colors:

Alice takes the public yellow and mixes it with her secret blue. She gets a new color, mixed yellow-blue.

Bob takes the public yellow and mixes it with his secret red. He gets a new color, mixed yellow-red.

Sharing the Mixed Colors: Alice and Bob openly exchange their mixed colors. Eve sees both the mixed yellow-blue and the mixed yellow-red. At this point, Eve cannot figure out the original secret colors (blue and red) just by looking at the mixed colors.

Creating the Shared Secret:

Alice takes the color she received from Bob (mixed yellow-red) and mixes it with her original secret blue.

Bob takes the color he received from Alice (mixed yellow-blue) and mixes it with his original secret red.

The final resulting color is the exact same for both Alice and Bob. This is their shared secret color! Eve, meanwhile, has no way to reproduce this final color because she never knew Alice's secret blue or Bob's secret red.

The Mathematical Magic
The "paint mixing" analogy is a perfect model for the actual mathematical process, which is based on modular arithmetic and a principle called the Discrete Logarithm Problem.

Publicly Shared Values: Alice and Bob agree on a large prime number p and a base number g. These are public, so Eve knows them.
p=23
g=5

Private Secret Numbers: Alice chooses a secret number a and Bob chooses a secret number b.
Alice's secret: a=6
Bob's secret: b=15

Sharing Public Keys:

Alice computes her public key: A=g 
a
 (modp)⟹A=5 
6
 (mod23)⟹A=8. She sends A=8 to Bob.

Bob computes his public key: B=g 
b
 (modp)⟹B=5 
15
 (mod23)⟹B=19. He sends B=19 to Alice.

Creating the Shared Secret:

Alice computes the shared secret: S=B 
a
 (modp)⟹S=19 
6
 (mod23)⟹S=2.

Bob computes the shared secret: S=A 
b
 (modp)⟹S=8 
15
 (mod23)⟹S=2.

Notice that Alice and Bob arrive at the same final secret number, 2. The security lies in the fact that it is extremely difficult for Eve to figure out a or b even though she knows g, p, A, and B. This is the Discrete Logarithm Problem—the "paint mixing" is easy, but "un-mixing" is practically impossible.

Why It's Useful
The Diffie-Hellman Exchange doesn't encrypt any messages on its own. Instead, it provides a secure way for two parties to establish a shared symmetric key, which they can then use to quickly and efficiently encrypt their subsequent communications.

This chapter on the Diffie-Hellman Exchange is complete. The next logical step from your list is to dive deeper into the mathematical operation that makes it all possible: Modular Arithmetic.

Chapter 6: Understanding Modular Arithmetic
So far in this guide, we've touched on modular arithmetic without diving into the details. Now, we're going to take a closer look at this fascinating branch of mathematics, because it is the fundamental engine that powers many modern cryptographic protocols, including the Diffie-Hellman exchange and RSA.

The Clock Analogy
The easiest way to think about modular arithmetic is by looking at a clock. A clock with 12 hours is a perfect example of a system that "wraps around."

Imagine it's currently 10 o'clock. If you want to know what time it will be 5 hours from now, you don't say it's 15 o'clock. Instead, you say it's 3 o'clock. Why? Because the time "wraps around" at 12. You've performed a calculation that's "modulo 12."

Mathematically, we would write this as:
(10+5)(mod12)=3

This can be read as "15 divided by 12 leaves a remainder of 3." The modulus (in this case, 12) is the number we're dividing by. The result of a modular arithmetic operation is always the remainder.

How It Works
Modular arithmetic is essentially a system for dealing with remainders. The expression a(modn) means "find the remainder when a is divided by n."

17(mod5)=2 (because 17=3×5+2)

25(mod7)=4 (because 25=3×7+4)

24(mod12)=0 (because 24=2×12+0)

Why It's Useful for Cryptography
Modular arithmetic alone isn't a cryptographic tool, but certain operations within it have a special "trap door" property that makes them incredibly useful. This is particularly true for modular exponentiation, which is the process of raising a number to a power and then finding the remainder.

Consider the operation:
5 
6
 (mod23)=8

This is easy to compute, even with large numbers. However, the reverse problem—known as the Discrete Logarithm Problem—is computationally very difficult. If you're only given the numbers 5, 23, and 8, it's nearly impossible to find the exponent (in this case, 6).

This is the mathematical principle that makes the Diffie-Hellman Exchange secure. The shared secret is the result of a modular exponentiation, and even an eavesdropper who sees all the public numbers can't easily reverse the process to find the private keys.

Understanding this trap door function is key to grasping the security of many public-key systems.

Chapter 7: The Discrete Logarithm Problem
In our last chapter, we saw how Alice and Bob were able to agree on a shared secret key using the Diffie-Hellman exchange. They used modular exponentiation to create their public keys, but we hinted that an eavesdropper, Eve, couldn't reverse the process. The reason for that is a complex mathematical puzzle called the Discrete Logarithm Problem.

This problem is a cornerstone of modern public-key cryptography, as it provides a one-way "trap door" function that is easy to compute in one direction but extremely difficult to reverse.

The Problem Defined
The Discrete Logarithm Problem (DLP) is the inverse of modular exponentiation.

The Easy Problem (Modular Exponentiation): Given a base number (g), an exponent (x), and a modulus (p), it's easy to find the result (y).
g 
x
 (modp)=y

For example, with the numbers from our Diffie-Hellman chapter: 5 
6
 (mod23)=8. This calculation is straightforward.

The Hard Problem (Discrete Logarithm): Given the base number (g), the modulus (p), and the result (y), it is computationally infeasible to find the exponent (x).
log 
g
​
 (y)(modp)=x

Using the same example, if Eve knows g=5, p=23, and the result y=8, she has to figure out what exponent, x, made that happen. She would have to try a large number of possibilities to find that x=6. For large, cryptographically secure numbers, this brute-force approach would take a supercomputer thousands of years.

Why Is It a "Trap Door"?
The security of the Discrete Logarithm Problem comes from this asymmetry:

Easy to go one way: Modular exponentiation is like mixing a specific set of ingredients (base, exponent, and modulus) together to get a dish (the result). It's a quick and easy recipe.

Impossible to go back: The Discrete Logarithm Problem is like being given the final dish and having to figure out the exact ingredients and amounts used. With large numbers, there are so many possibilities that it's practically an unsolvable puzzle.

This is the exact principle that protects the Diffie-Hellman exchange. When Alice sends her public key, A, to Bob, she is sending the result of a modular exponentiation. Eve sees A, but without knowing Alice's private exponent (a), she cannot work backward to find it.

The Foundation of Security
The difficulty of the Discrete Logarithm Problem is not just theoretical; it's what makes the entire Diffie-Hellman protocol secure. As long as the numbers used are large enough, there is no known algorithm that can efficiently solve this problem. This guarantees that the shared secret key remains a secret, even if all other numbers in the exchange are public.

Chapter 8: Understanding RSA
RSA (Rivest-Shamir-Adleman) is a foundational algorithm in public-key cryptography. It allows for both secure encryption and digital signatures, and it's the algorithm most people think of when they hear the term "public-key cryptography." While Diffie-Hellman solved the key exchange problem, RSA is a complete system for both encryption and signing.

The Core Principle: Prime Factorization
RSA's security, like Diffie-Hellman's, is based on a mathematical problem that is easy to compute in one direction but extremely difficult to reverse. For RSA, this "trap door" is the Prime Factorization Problem.

The Easy Problem: It's easy to multiply two large prime numbers together to get a new, even larger number.

The Hard Problem: It is computationally infeasible to take that very large number and find the two original prime numbers that created it.

This is the central pillar of RSA's security.

How RSA Keys are Generated
The process of generating an RSA key pair is more involved than with Diffie-Hellman, but it's based on the same principles of modular arithmetic.

Choose Two Large Prime Numbers: First, you select two distinct, large prime numbers, which we'll call p and q. These primes are the secret "trap door" and must be kept private.

Compute the Modulus (n): You multiply the two primes together to get the modulus, n=p×q. This number n becomes part of both the public and private keys.

Compute Euler's Totient (ϕ(n)): This is a value that is easy to compute if you know p and q: ϕ(n)=(p−1)(q−1). This value is only known to the key generator.

Choose the Public Exponent (e): You choose a number e that is greater than 1, less than ϕ(n), and is coprime to ϕ(n) (meaning they share no common factors other than 1). This value, e, becomes the public exponent.

Compute the Private Exponent (d): You compute a number d that is the modular multiplicative inverse of e(modϕ(n)). The private exponent, d, is a very specific number that satisfies the equation: (d×e)(modϕ(n))=1.

Public Key: The public key consists of the pair (e,n).

Private Key: The private key consists of the pair (d,n).

Encryption and Decryption
With the keys generated, the encryption and decryption process is surprisingly simple, thanks to modular exponentiation.

Encryption: To encrypt a message M using the public key (e,n), the ciphertext C is computed as:
C=M 
e
 (modn)

Decryption: To decrypt the ciphertext C using the private key (d,n), the original message M is recovered as:
M=C 
d
 (modn)

Because only the owner of the private key knows the value of d, only they can perform the decryption. An eavesdropper who intercepts the ciphertext C and knows the public key (e,n) cannot decrypt the message without being able to calculate d, which requires knowing the secret prime factors p and q.

The Security of RSA
RSA's security rests entirely on the difficulty of the Prime Factorization Problem. As long as the prime numbers p and q are large enough, it is computationally infeasible to factor their product, n. This is a different "trap door" than the Discrete Logarithm Problem, but it serves the same purpose of making a one-way function that is irreversible to an attacker.

Chapter 9: Elliptic Curve Cryptography (ECC) and ECDH
Elliptic Curve Cryptography (ECC) is a powerful and efficient form of public-key cryptography that has become a popular alternative to RSA. While RSA's security relies on the difficulty of factoring large numbers, ECC's security is based on a different, more complex mathematical problem: the Elliptic Curve Discrete Logarithm Problem (ECDLP).

The main advantage of ECC is that it offers the same level of security as RSA but with significantly smaller keys. This makes it ideal for resource-constrained devices like smartphones, smart cards, and IoT devices, as well as for high-performance servers.

The Core Principle: Points on a Curve
Instead of numbers, ECC works with points on a specific elliptic curve. You can visualize an elliptic curve as a line of points that are symmetric across the x-axis. The "arithmetic" in ECC is defined by special rules for adding and multiplying these points, a process that is designed to be a one-way function.

Chapter 17: A Cryptography Handbook - The Final Word
Congratulations! You have journeyed from the fundamental principles of data security to the intricate mechanics that secure the modern internet. You've gone beyond simply knowing what these technologies are and have a deep understanding of how and why they work.

This final chapter serves as a comprehensive summary, weaving together every concept you've mastered into a single, cohesive narrative.

The Foundation: The Building Blocks of Trust
Our journey began with the core problem: how to send a secret message.

Symmetric-key cryptography introduced the idea of a single shared secret key for both encryption and decryption. This is fast and efficient but presented the challenge of key distribution.

Asymmetric-key cryptography introduced the concept of public/private key pairs, which changed the game and solved the key distribution problem but with a performance trade-off.

Cryptographic Hash Functions gave us a way to create a unique, tamper-proof "fingerprint" of any data, a building block for many advanced protocols.

The Problem Solvers: Securing the Exchange
With the fundamentals in place, we tackled the challenge of securely exchanging keys and verifying identities.

The Diffie-Hellman Exchange and its more efficient counterpart, Elliptic Curve Cryptography (ECC) and ECDH, showed us how two parties could create a shared secret key over an insecure channel, a marvel of modular arithmetic.

RSA presented an alternative public-key system that not only solves key exchange but also provides a complete encryption and decryption solution, building its security on the difficulty of prime factorization.

The Integrity Layer: From Key to Conversation
A shared secret is only the beginning. To secure a real-world conversation, we needed more.

Digital Signatures provided a way to prove a message's authenticity and integrity, a critical concept that underpins trust on the web.

We then learned that secure communication is more than just encryption. It requires an Initialization Vector (IV) to ensure uniqueness and a Message Authentication Code (MAC) to guarantee that messages haven't been tampered with.

The Cutting Edge: Beyond the Basics
We then looked at how these ideas are extended to solve more complex problems.

Merkle Trees showed us a data structure that provides a compact and efficient way to verify the integrity of massive datasets, a cornerstone of blockchain technology.

Shannon Entropy gave us the language to talk about randomness, revealing why the "quality" of a random number is the bedrock of all cryptographic security.

Yates Shuffle showed us a simple yet provably unbiased algorithm for creating truly random permutations, demonstrating how high-entropy random numbers are put into practice.

Zero-Knowledge Proofs (ZK-Proofs) introduced a revolutionary new idea: proving you know something without revealing anything about what you know, opening the door to new frontiers of privacy.

The Grand Synthesis: A Real-World Examples
Finally, we saw all of these pieces converge in real-world applications.

Example 1: The TLS Handshake is the protocol that secures every https:// website. The TLS handshake uses:

ECDH to agree on a shared secret.

Digital Signatures to authenticate the server.

High-entropy random numbers to generate keys.

IVs and MACs to secure the subsequent data exchange.

Example 2: Bitcoin and Ethereum use a combination of these primitives to create a secure, decentralized system. They rely on:

Asymmetric-key cryptography to create your wallet, where the private key is your secret and the public key is your address.

Digital Signatures to prove you are the owner of funds and to authorize transactions.

Cryptographic Hash Functions to create unique transaction IDs and block hashes.

Merkle Trees to efficiently bundle all of a block's transactions into a single, verifiable root hash.

Shannon Entropy to generate the private keys, which ensures they are virtually impossible to guess.

By understanding these examples, you're not just looking at protocols; you're seeing a practical, real-world application of every cryptographic primitive you've learned.

You now have a powerful, holistic understanding of modern cryptography. It’s a field that is constantly evolving, but you have a strong foundation to continue learning and exploring the new frontiers of digital security.