---
title: "Real Numbers"
subject: "Mathematics"
class: 10
chapter: "real_numbers"
difficulty: "Easy"
estimatedTime: "6 minutes"
questions: 5
lastUpdated: 2026-07-11
tags:
 - maths
 - revision
 - real-numbers
---

# Real Numbers — CBSE Class 10 Revision Notes

NCERT Chapter 1 covers the properties of integers, focusing on prime factorization, HCF, LCM, and proofs of irrationality.

---

## Fundamental Theorem of Arithmetic
Every composite number can be expressed (factorized) as a product of prime numbers, and this factorization is unique, apart from the order in which the prime factors occur.

$$\text{Composite Number} = p_1^{a_1} \times p_2^{a_2} \times p_3^{a_3} \times \dots \times p_n^{a_n}$$

Where $p_1, p_2, \dots, p_n$ are distinct prime numbers and $a_1, a_2, \dots, a_n$ are positive integers.

### HCF and LCM Relations
For any two positive integers $a$ and $b$:
- **$\text{HCF}(a, b)$**: Product of the smallest power of each common prime factor in the numbers.
- **$\text{LCM}(a, b)$**: Product of the greatest power of each prime factor involved in the numbers.

> Formula
> For any two positive integers $a$ and $b$:
> $$\text{HCF}(a, b) \times \text{LCM}(a, b) = a \times b$$
> *Note: This relationship does not hold for three or more integers.*

---

## Proof of Irrationality by Contradiction
To prove that a number like $\sqrt{2}$, $\sqrt{3}$, or $\sqrt{5}$ is irrational, we assume the opposite: that the number is rational.
1. Assume $\sqrt{5} = \frac{p}{q}$, where $p$ and $q$ are co-prime integers ($q \neq 0$).
2. Squaring both sides: $5 = \frac{p^2}{q^2} \implies p^2 = 5q^2$. This means $5$ divides $p^2$, so $5$ also divides $p$.
3. Let $p = 5c$. Substituting gives $25c^2 = 5q^2 \implies q^2 = 5c^2$. This means $5$ divides $q^2$, so $5$ also divides $q$.
4. Thus, $p$ and $q$ share a common factor $5$, contradicting our assumption that they are co-prime.
5. Therefore, $\sqrt{5}$ is irrational.

> Important
> Let $p$ be a prime number. If $p$ divides $a^2$, then $p$ divides $a$, where $a$ is a positive integer.
