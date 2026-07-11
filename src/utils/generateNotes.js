import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { subjects } from '../data/subjects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const notesDir = path.join(projectRoot, 'src/notes');

// Helper to ensure directory exists
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate formulas/text based on chapter ID
function generateSubjectContent(subjectId, chapterId, title, desc) {
  // Maths Content templates
  if (subjectId === 'maths') {
    if (chapterId === 'real_numbers') {
      return `
# Real Numbers Revision Notes

Understanding the fundamental properties of integers and rational/irrational numbers.

---

## Euclid's Division Lemma
Given positive integers $a$ and $b$, there exist unique integers $r$ and $q$ satisfying:
$$a = bq + r \\quad \\text{where } 0 \\le r < b$$

## Fundamental Theorem of Arithmetic
Every composite number can be expressed (factorised) as a product of primes, and this factorisation is unique:
$$\\text{Composite Number} = p_1 \\cdot p_2 \\cdot p_3 \\dots p_n$$

> Formula
> **HCF and LCM relation**: For any two positive integers $a$ and $b$:
> $$\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b$$

> Important
> $\\sqrt{p}$ is irrational if $p$ is a prime number. To prove this, we use the method of contradiction.
`;
    }
    
    if (chapterId === 'polynomials') {
      return `
# Polynomials Revision Notes

A polynomial is an algebraic expression consisting of variables and coefficients.

---

## Relationship between Zeroes and Coefficients

For a quadratic polynomial $ax^2 + bx + c$:
- **Sum of zeroes ($\\alpha + \\beta$)**: $-\\frac{b}{a} = -\\frac{\\text{Coefficient of } x}{\\text{Coefficient of } x^2}$
- **Product of zeroes ($\\alpha \\cdot \\beta$)**: $\\frac{c}{a} = \\frac{\\text{Constant term}}{\\text{Coefficient of } x^2}$

> Remember
> If $\\alpha$ and $\\beta$ are zeroes of a quadratic polynomial, the polynomial can be written as:
> $$p(x) = k[x^2 - (\\alpha + \\beta)x + \\alpha\\beta]$$
`;
    }

    if (chapterId === 'linear_equations') {
      return `
# Pair of Linear Equations in Two Variables

Study of simultaneous linear equations and methods to solve them.

---

## Consistency Conditions

For a pair of equations $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$:

| Ratio Comparison | Graphical Representation | Algebraic Interpretation |
| :--- | :--- | :--- |
| $\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}$ | Intersecting lines | Unique solution (Consistent) |
| $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$ | Coincident lines | Infinitely many solutions (Dependent) |
| $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$ | Parallel lines | No solution (Inconsistent) |

> Trick
> Always convert both equations to the standard form $ax + by + c = 0$ before comparing coefficients!
`;
    }

    if (chapterId === 'quadratic_equations') {
      return `
# Quadratic Equations Revision Notes

A quadratic equation is in the standard form $ax^2 + bx + c = 0$, where $a \\neq 0$.

---

## Quadratic Formula
The roots of the quadratic equation are given by:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

## Nature of Roots (Discriminant $D = b^2 - 4ac$)
- **$D > 0$**: Two distinct real roots.
- **$D = 0$**: Two equal real roots.
- **$D < 0$**: No real roots (Imaginary roots).

> Formula
> Root values when $D = 0$:
> $$x = -\\frac{b}{2a}, -\\frac{b}{2a}$$
`;
    }

    if (chapterId === 'arithmetic_progressions') {
      return `
# Arithmetic Progressions (AP) Notes

An AP is a sequence of numbers in which the difference between consecutive terms is constant.

---

## Key Formulas

- **$n^{\\text{th}}$ term ($a_n$)**:
  $$a_n = a + (n - 1)d$$
- **Sum of first $n$ terms ($S_n$)**:
  $$S_n = \\frac{n}{2}[2a + (n-1)d] = \\frac{n}{2}[a + l]$$
  *(where $l$ is the last term)*

> Remember
> Common difference $d = a_k - a_{k-1}$. It can be positive, negative, or zero.
`;
    }

    if (chapterId === 'probability') {
      return `
# Probability Revision Notes

Probability is the measure of the likelihood that an event will occur.

---

## Formula for Classical Probability
The probability of an event $E$, denoted by $P(E)$, is defined as:
$$P(E) = \\frac{\\text{Number of outcomes favorable to } E}{\\text{Total number of possible outcomes}}$$

- The value of $P(E)$ always lies between $0$ and $1$:
  $$0 \\le P(E) \\le 1$$
- **Sure Event**: $P(E) = 1$
- **Impossible Event**: $P(E) = 0$

> Remember
> Sum of probabilities of all elementary events is $1$:
> $$P(E) + P(\\bar{E}) = 1$$
`;
    }

    // Default maths template
    return `
# ${title} Revision Notes

${desc}

---

## Core Formulas and Concepts

- Standard equation or ratio calculation.
- Key properties and conditions.

$$x^2 + y^2 = r^2$$

> Formula
> Let $k$ be a positive constant. Always verify boundary constraints before solving.
`;
  }

  // Science Content templates
  if (subjectId === 'science') {
    if (chapterId === 'chemical_reactions') {
      return `
# Chemical Reactions and Equations

A process in which one or more substances are converted to one or more different substances.

---

## Types of Chemical Reactions

1. **Combination Reaction**: Two or more reactants combine to form a single product.
   $$A + B \\rightarrow AB$$
2. **Decomposition Reaction**: A single reactant breaks down into two or more products.
   $$AB \\rightarrow A + B$$
3. **Displacement Reaction**: A more reactive element displaces a less reactive element.
   $$A + BC \\rightarrow AC + B$$
4. **Redox Reaction**: Simultaneous oxidation (gain of $O_2$/loss of $H_2$) and reduction.

> Remember
> Balancing a chemical equation is based on the **Law of Conservation of Mass** (mass can neither be created nor destroyed).
`;
    }

    if (chapterId === 'acids_bases_salts') {
      return `
# Acids, Bases and Salts Revision Notes

Chemical properties and behaviors of acids, bases, and indicator reactions.

---

## The pH Scale
pH measures the hydrogen ion concentration.
- **pH < 7**: Acidic solution (releases $H^+$ ions)
- **pH = 7**: Neutral solution (water)
- **pH > 7**: Basic solution (releases $OH^-$ ions)

## Important Salts
- **Baking Soda**: $NaHCO_3$ (Sodium Hydrogen Carbonate)
- **Washing Soda**: $Na_2CO_3 \\cdot 10H_2O$
- **Plaster of Paris**: $CaSO_4 \\cdot \\frac{1}{2}H_2O$

> Important
> Plaster of Paris turns into **Gypsum** ($CaSO_4 \\cdot 2H_2O$) when mixed with water!
`;
    }

    return `
# ${title} Revision Notes

${desc}

---

## Core Theory and Diagrams

Key scientific definitions, reactions, or formulas for CBSE Board exams.

> Remember
> Observe experimental setups and chemical indicator color changes.
`;
  }

  // Social Science Content templates
  if (subjectId === 'social') {
    return `
# ${title} Notes

${desc}

---

## Key Historical and Civic Contexts

- Primary events, timelines, or institutional structures.
- Explanations of socio-economic impacts.

> Important
> Understand the background causes, dates, and key figures associated with this chapter.
`;
  }

  // English Content templates
  if (subjectId === 'english') {
    return `
# ${title} Grammar & Literature Notes

${desc}

---

## Core Rules / Literary Theme

- Syntax rules, templates, or character analyses.
- Key direct-indirect speech models or character quotes.

> Remember
> Pay attention to spellings, grammar agreement, and critical citations from prose chapters.
`;
  }

  return `
# ${title} Notes
${desc}
`;
}

// Run through all subjects and chapters to generate notes
export function generateAllNotes() {
  ensureDirectory(notesDir);
  console.log('Generating notes directory at:', notesDir);

  let count = 0;

  subjects.forEach((sub) => {
    const subFolder = path.join(notesDir, sub.id);
    ensureDirectory(subFolder);

    sub.chapters.forEach((chap) => {
      const fileName = `${chap.id}.md`;
      const filePath = path.join(subFolder, fileName);

      // Check if file already exists. If yes, skip to prevent overriding trigonometry, electricity, nationalism, tenses
      if (fs.existsSync(filePath)) {
        console.log(`Skipping existing note: ${sub.id}/${fileName}`);
        return;
      }

      const title = chap.name;
      const desc = chap.description;
      const difficulty = chap.difficulty || 'Medium';
      const estTime = `${chap.timeRequired || 15} minutes`;
      const qCount = chap.questionCount || 5;

      const frontmatter = `---
title: "${title}"
subject: "${sub.name}"
class: 10
chapter: "${chap.id}"
difficulty: "${difficulty}"
estimatedTime: "${estTime}"
questions: ${qCount}
lastUpdated: 2026-07-11
tags:
 - ${sub.id}
 - revision
 - ${chap.id.replace(/_/g, '-')}
---
`;

      const body = generateSubjectContent(sub.id, chap.id, title, desc);
      const fullContent = frontmatter + body;

      fs.writeFileSync(filePath, fullContent, 'utf-8');
      count++;
    });
  });

  console.log(`Generated ${count} new chapter notes successfully!`);
}

// Execute if run directly
generateAllNotes();
