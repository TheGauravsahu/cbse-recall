import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { subjects } from '../data/subjects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const notesDir = path.join(projectRoot, 'src/notes');

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Detailed Content Compiler for Mathematics
function getMathsChapterContent(chapterId, title, desc) {
  switch (chapterId) {
    case 'real_numbers':
      return `
# Real Numbers — CBSE Class 10 Revision Notes

NCERT Chapter 1 covers the properties of integers, focusing on prime factorization, HCF, LCM, and proofs of irrationality.

---

## Fundamental Theorem of Arithmetic
Every composite number can be expressed (factorized) as a product of prime numbers, and this factorization is unique, apart from the order in which the prime factors occur.

$$\\text{Composite Number} = p_1^{a_1} \\times p_2^{a_2} \\times p_3^{a_3} \\times \\dots \\times p_n^{a_n}$$

Where $p_1, p_2, \\dots, p_n$ are distinct prime numbers and $a_1, a_2, \\dots, a_n$ are positive integers.

### HCF and LCM Relations
For any two positive integers $a$ and $b$:
- **$\\text{HCF}(a, b)$**: Product of the smallest power of each common prime factor in the numbers.
- **$\\text{LCM}(a, b)$**: Product of the greatest power of each prime factor involved in the numbers.

> Formula
> For any two positive integers $a$ and $b$:
> $$\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b$$
> *Note: This relationship does not hold for three or more integers.*

---

## Proof of Irrationality by Contradiction
To prove that a number like $\\sqrt{2}$, $\\sqrt{3}$, or $\\sqrt{5}$ is irrational, we assume the opposite: that the number is rational.
1. Assume $\\sqrt{5} = \\frac{p}{q}$, where $p$ and $q$ are co-prime integers ($q \\neq 0$).
2. Squaring both sides: $5 = \\frac{p^2}{q^2} \\implies p^2 = 5q^2$. This means $5$ divides $p^2$, so $5$ also divides $p$.
3. Let $p = 5c$. Substituting gives $25c^2 = 5q^2 \\implies q^2 = 5c^2$. This means $5$ divides $q^2$, so $5$ also divides $q$.
4. Thus, $p$ and $q$ share a common factor $5$, contradicting our assumption that they are co-prime.
5. Therefore, $\\sqrt{5}$ is irrational.

> Important
> Let $p$ be a prime number. If $p$ divides $a^2$, then $p$ divides $a$, where $a$ is a positive integer.
`;

    case 'polynomials':
      return `
# Polynomials — CBSE Class 10 Revision Notes

NCERT Chapter 2 covers the classification of polynomials, geometrical meaning of their zeroes, and coefficients relationships.

---

## Geometrical Meaning of the Zeroes of a Polynomial
The zeroes of a polynomial $p(x)$ are the $x$-coordinates of the points where the graph of $y = p(x)$ intersects the $x$-axis.
- A linear polynomial $ax + b$ has exactly $1$ zero.
- A quadratic polynomial $ax^2 + bx + c$ has at most $2$ zeroes (represented by a parabola opening upwards if $a > 0$ or downwards if $a < 0$).
- A cubic polynomial has at most $3$ zeroes.

---

## Relationship between Zeroes and Coefficients

### Quadratic Polynomial ($ax^2 + bx + c$, $a \\neq 0$)
Let $\\alpha$ and $\\beta$ be the zeroes of the polynomial:

- **Sum of Zeroes**:
  $$\\alpha + \\beta = -\\frac{b}{a} = -\\frac{\\text{Coefficient of } x}{\\text{Coefficient of } x^2}$$
- **Product of Zeroes**:
  $$\\alpha \\cdot \\beta = \\frac{c}{a} = \\frac{\\text{Constant term}}{\\text{Coefficient of } x^2}$$

> Formula
> A quadratic polynomial whose zeroes are $\\alpha$ and $\\beta$ is given by:
> $$p(x) = k[x^2 - (\\alpha + \\beta)x + \\alpha\\beta]$$
> where $k$ is a non-zero real constant.

---

## Cubic Polynomial ($ax^3 + bx^2 + cx + d$, $a \\neq 0$)
Let $\\alpha, \\beta, \\gamma$ be the zeroes:
- $\\alpha + \\beta + \\gamma = -\\frac{b}{a}$
- $\\alpha\\beta + \\beta\\gamma + \\gamma\\alpha = \\frac{c}{a}$
- $\\alpha\\beta\\gamma = -\\frac{d}{a}$
`;

    case 'linear_equations':
      return `
# Pair of Linear Equations in Two Variables

NCERT Chapter 3 covers algebraic and graphical methods for solving pairs of linear equations.

---

## Algebraic Representation
A pair of linear equations in two variables $x$ and $y$ is represented as:
$$a_1x + b_1y + c_1 = 0$$
$$a_2x + b_2y + c_2 = 0$$

---

## Graphical Method and Consistency Conditions

| Ratio Comparison | Graphical Representation | Algebraic Interpretation | System Consistency |
| :--- | :--- | :--- | :--- |
| $\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}$ | Intersecting Lines | Unique Solution | Consistent |
| $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$ | Coincident Lines | Infinitely Many Solutions | Consistent (Dependent) |
| $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$ | Parallel Lines | No Solution | Inconsistent |

---

## Methods of Solving Pairs of Linear Equations

### 1. Substitution Method
1. Express $y$ in terms of $x$ from one equation.
2. Substitute this value of $y$ into the second equation to solve for $x$.
3. Substitute the value of $x$ back into the first relation to find $y$.

### 2. Elimination Method
1. Multiply both equations by suitable non-zero constants to make the coefficients of one variable equal.
2. Add or subtract the equations to eliminate that variable.
3. Solve the resulting single-variable equation, and substitute back.

> Trick
> To solve calculations faster, choose the variable with coefficients $1$ or $-1$ for elimination or substitution first!
`;

    case 'quadratic_equations':
      return `
# Quadratic Equations — CBSE Class 10 Revision Notes

NCERT Chapter 4 focuses on standard quadratic equations, factorisation methods, completing the squares (removed in new syllabus), and nature of roots.

---

## Standard Form
A quadratic equation in the variable $x$ is an equation of the form:
$$ax^2 + bx + c = 0 \\quad \\text{where } a, b, c \\text{ are real numbers and } a \\neq 0$$

---

## Methods of Finding Roots

### 1. Factorisation (Splitting the Middle Term)
We split the linear term $bx$ into two terms such that the product of their coefficients is equal to the product of $a$ and $c$.

### 2. Quadratic Formula (Sridharacharya's Method)
If $b^2 - 4ac \\ge 0$, the roots of $ax^2 + bx + c = 0$ are:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

---

## Nature of Roots (Discriminant $D = b^2 - 4ac$)
The term $D = b^2 - 4ac$ determines the nature of the roots:

- **$D > 0$**: Two distinct real roots $\\left(x = \\frac{-b \\pm \\sqrt{D}}{2a}\\right)$.
- **$D = 0$**: Two equal real roots (coincident roots) $\\left(x = -\\frac{b}{2a}\\right)$.
- **$D < 0$**: No real roots (roots are imaginary/complex).

> Common Mistake
> If the discriminant $D$ is negative, do not attempt to find real roots using the square root. State clearly that "No real roots exist".
`;

    case 'arithmetic_progressions':
      return `
# Arithmetic Progressions (AP) — CBSE Class 10 Notes

NCERT Chapter 5 covers arithmetic sequences, common differences, the $n$-th term formula, and the sum of the first $n$ terms.

---

## Definition
An Arithmetic Progression is a list of numbers in which each term is obtained by adding a fixed number $d$ (common difference) to the preceding term, except the first term.
- The standard form of an AP is: $a, a+d, a+2d, a+3d, \\dots$

---

## Key Formulas

### 1. $n^{\\text{th}}$ Term of an AP ($a_n$)
$$a_n = a + (n - 1)d$$
where:
- $a$ = first term
- $d$ = common difference ($a_2 - a_1$)
- $n$ = number of terms

### 2. Sum of First $n$ Terms ($S_n$)
$$S_n = \\frac{n}{2}[2a + (n - 1)d]$$
Or, if the last term $l$ (where $l = a_n$) is known:
$$S_n = \\frac{n}{2}[a + l]$$

> Formula
> **Arithmetic Mean**: If $a, b, c$ are in AP, then $b$ is the arithmetic mean of $a$ and $c$:
> $$b = \\frac{a + c}{2}$$

> Trick
> To select $3$ numbers in AP, use: $(a-d), a, (a+d)$
> To select $4$ numbers in AP, use: $(a-3d), (a-d), (a+d), (a+3d)$
`;

    case 'triangles':
      return `
# Triangles — CBSE Class 10 Revision Notes

NCERT Chapter 6 covers the similarity of triangles, Basic Proportionality Theorem (BPT), and criteria for similarity of triangles.

---

## Similarity of Triangles
Two triangles are similar if:
1. Their corresponding angles are equal.
2. Their corresponding sides are in the same ratio (proportional).

---

## Basic Proportionality Theorem (Thales Theorem)
If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.

In $\\triangle ABC$, if $DE \\parallel BC$, then:
$$\\frac{AD}{DB} = \\frac{AE}{EC}$$

### Converse of BPT
If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side.

---

## Criteria for Similarity of Triangles
1. **AAA (Angle-Angle-Angle)** Similarity: If corresponding angles are equal, the triangles are similar. (AA is also sufficient).
2. **SSS (Side-Side-Side)** Similarity: If corresponding sides are proportional, the triangles are similar.
3. **SAS (Side-Angle-Side)** Similarity: If one angle of a triangle is equal to one angle of another, and the sides including these angles are proportional, the triangles are similar.

> Important
> In similar triangles, the ratio of any two corresponding sides is equal to the ratio of their corresponding altitudes, medians, and angle bisectors.
`;

    case 'coordinate_geometry':
      return `
# Coordinate Geometry — CBSE Class 10 Revision Notes

NCERT Chapter 7 covers coordinate planes, distance formula, and section formula.

---

## Distance Formula
The distance between two points $P(x_1, y_1)$ and $Q(x_2, y_2)$ is given by:
$$PQ = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$$

- **Distance from Origin**: The distance of a point $P(x, y)$ from the origin $O(0,0)$ is:
  $$OP = \\sqrt{x^2 + y^2}$$

---

## Section Formula
The coordinates of the point $P(x, y)$ which divides the line segment joining $A(x_1, y_1)$ and $B(x_2, y_2)$ internally in the ratio $m_1 : m_2$ are:
$$x = \\frac{m_1x_2 + m_2x_1}{m_1 + m_2}, \\quad y = \\frac{m_1y_2 + m_2y_1}{m_1 + m_2}$$

### Midpoint Formula
The midpoint of the line segment joining $A(x_1, y_1)$ and $B(x_2, y_2)$ is:
$$P\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$$

> Trick
> To find the ratio in which a point divides a line segment, assume the ratio to be $k : 1$. Substitute into the section formula to solve for $k$.
`;

    case 'trigonometry':
      return `
# Introduction to Trigonometry — Revision Notes

NCERT Chapter 8 covers trigonometric ratios, standard angle values, and fundamental identities.

---

## Trigonometric Ratios
For a right-angled triangle $ABC$, right-angled at $B$:
- $\\sin \\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}$
- $\\cos \\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}$
- $\\tan \\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{\\sin \\theta}{\\cos \\theta}$
- $\\cot \\theta = \\frac{1}{\\tan \\theta}$, $\\sec \\theta = \\frac{1}{\\cos \\theta}$, $\\csc \\theta = \\frac{1}{\\sin \\theta}$

---

## Trigonometric Identities
1. $$\\sin^2 \\theta + \\cos^2 \\theta = 1$$
2. $$1 + \\tan^2 \\theta = \\sec^2 \\theta \\quad (0 \\le \\theta < 90^\\circ)$$
3. $$1 + \\cot^2 \\theta = \\csc^2 \\theta \\quad (0 < \\theta \\le 90^\\circ)$$
`;

    case 'applications_trigonometry':
      return `
# Some Applications of Trigonometry Notes

NCERT Chapter 9 covers heights and distances, angles of elevation, and angles of depression.

---

## Key Terms
- **Line of Sight**: The line drawn from the eye of an observer to the point in the object viewed.
- **Angle of Elevation**: The angle formed by the line of sight with the horizontal when the object is above the horizontal level.
- **Angle of Depression**: The angle formed by the line of sight with the horizontal when the object is below the horizontal level.

---

## Core Trigonometric Relations Used
Usually, $\\tan \\theta$ is used because we deal with heights (Opposite) and distances (Adjacent):
$$\\tan \\theta = \\frac{\\text{Height of Tower/Building}}{\\text{Distance from foot of Tower}}$$

- For slant lengths (like kite strings or slides), use $\\sin \\theta$ or $\\cos \\theta$:
  $$\\sin \\theta = \\frac{\\text{Height}}{\\text{Length of String}}$$

> Remember
> The angle of elevation of the top of a tower is equal to the angle of depression of the foot from the top (alternate interior angles are equal).
`;

    case 'circles':
      return `
# Circles — CBSE Class 10 Revision Notes

NCERT Chapter 10 covers tangents to circles and key geometry theorems.

---

## Tangent to a Circle
A tangent to a circle is a line that intersects the circle at only one point. The common point of the tangent and the circle is called the **point of contact**.
- There is only $1$ tangent at a point of contact on the circle.
- Parallel tangents to a circle cannot be more than two at any time.

---

## Core Circle Theorems

### Theorem 10.1
The tangent at any point of a circle is perpendicular to the radius through the point of contact.
$$\\text{Radius } OP \\perp \\text{ Tangent } XY$$

### Theorem 10.2
The lengths of tangents drawn from an external point to a circle are equal.
$$PQ = PR$$

> Remember
> Tangents drawn from an external point subtend equal angles at the center of the circle, and are equally inclined to the line segment joining the center to that point.
`;

    case 'areas_circles':
      return `
# Areas Related to Circles — Revision Notes

NCERT Chapter 11 covers the perimeter and area of a circle, areas of sectors, and segments.

---

## Sector of a Circle
The region bounded by two radii and an arc of a circle is called a **sector**.

- **Area of Sector of Angle $\\theta$**:
  $$\\text{Area} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2$$
- **Length of an Arc of a Sector of Angle $\\theta$**:
  $$\\text{Length } l = \\frac{\\theta}{360^\\circ} \\times 2\\pi r$$

---

## Segment of a Circle
The region bounded by a chord and an arc of a circle is called a **segment**.

- **Area of Segment of a Circle**:
  $$\\text{Area of Segment} = \\text{Area of Sector} - \\text{Area of } \\triangle$$
  $$\\text{Area of Segment} = \\left( \\frac{\\theta}{360^\\circ} \\times \\pi r^2 \\right) - \\frac{1}{2}r^2 \\sin \\theta$$

> Formula
> Area of equilateral triangle in sector subtraction:
> $$\\text{Area} = \\frac{\\sqrt{3}}{4} a^2$$
`;

    case 'surface_areas_volumes':
      return `
# Surface Areas and Volumes Notes

NCERT Chapter 12 covers the surface areas and volumes of combinations of solids.

---

## Formulas Cheat Sheet

| Solid | Curved / Lateral Surface Area | Total Surface Area | Volume |
| :--- | :--- | :--- | :--- |
| **Cuboid** | $2h(l+b)$ | $2(lb + bh + hl)$ | $l \\cdot b \\cdot h$ |
| **Cylinder** | $2\\pi rh$ | $2\\pi r(r + h)$ | $\\pi r^2 h$ |
| **Cone** | $\\pi rl$ | $\\pi r(r + l)$ | $\\frac{1}{3}\\pi r^2 h$ |
| **Sphere** | $4\\pi r^2$ | $4\\pi r^2$ | $\\frac{4}{3}\\pi r^3$ |
| **Hemisphere** | $2\\pi r^2$ | $3\\pi r^2$ | $\\frac{2}{3}\\pi r^3$ |

*(where $l = \\sqrt{r^2 + h^2}$ is the slant height of the cone)*

> Important
> When two solids are joined together, the total volume is the sum of the volumes of individual solids. However, the total surface area is the sum of visible surface areas, not the sum of individual TSAs!
`;

    case 'statistics':
      return `
# Statistics — CBSE Class 10 Revision Notes

NCERT Chapter 13 covers the calculation of mean, median, and mode for grouped data.

---

## 1. Mean of Grouped Data

### Direct Method
$$\\bar{x} = \\frac{\\sum f_ix_i}{\\sum f_i}$$
*(where $x_i$ is the class mark: $\\frac{\\text{Upper Limit} + \\text{Lower Limit}}{2}$)*

### Assumed Mean Method
$$\\bar{x} = a + \\frac{\\sum f_id_i}{\\sum f_i} \\quad \\text{where } d_i = x_i - a$$

---

## 2. Mode of Grouped Data
$$\\text{Mode} = l + \\left( \\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\right) \\times h$$
where:
- $l$ = lower limit of modal class
- $f_1$ = frequency of modal class
- $f_0$ = frequency of class preceding modal class
- $f_2$ = frequency of class succeeding modal class
- $h$ = class width

---

## 3. Median of Grouped Data
$$\\text{Median} = l + \\left( \\frac{\\frac{N}{2} - cf}{f} \\right) \\times h$$
where:
- $cf$ = cumulative frequency of class preceding median class
- $N$ = total frequency

> Formula
> **Empirical Relationship** between Mean, Median, and Mode:
> $$3 \\times \\text{Median} = \\text{Mode} + 2 \\times \\text{Mean}$$
`;

    default:
      return `
# ${title} — Maths Revision Notes

${desc}

---

## Core Formulas and Concepts

- Standard equation or ratio calculation.
- Key properties and conditions.

> Formula
> Review the textbook illustrations and solve standard board exam questions for practice.
`;
  }
}

// Detailed Content Compiler for Science
function getScienceChapterContent(chapterId, title, desc) {
  switch (chapterId) {
    case 'chemical_reactions':
      return `
# Chemical Reactions and Equations Notes

NCERT Chapter 1 covers chemical combinations, decompositions, balancing equations, and redox reactions.

---

## Chemical Equation
A symbolic representation of a chemical reaction using symbols and chemical formulas of the reactants and products.
- **Law of Conservation of Mass**: Mass can neither be created nor destroyed in a chemical reaction. Therefore, the number of atoms of each element remains the same on both sides of a balanced equation.

---

## Types of Chemical Reactions

1. **Combination Reaction**: Two or more reactants combine to form a single product:
   $$CaO(s) + H_2O(l) \\rightarrow Ca(OH)_2(aq) + \\text{Heat}$$
2. **Decomposition Reaction**: A single reactant breaks down into simpler products:
   $$2FeSO_4(s) \\xrightarrow{\\text{Heat}} Fe_2O_3(s) + SO_2(g) + SO_3(g)$$
3. **Displacement Reaction**: A more reactive element displaces a less reactive element:
   $$Fe(s) + CuSO_4(aq) \\rightarrow FeSO_4(aq) + Cu(s)$$
4. **Double Displacement Reaction**: Exchange of ions between reactants takes place:
   $$Na_2SO_4(aq) + BaCl_2(aq) \\rightarrow BaSO_4(s) \\downarrow + 2NaCl(aq)$$
5. **Oxidation and Reduction (Redox)**:
   - **Oxidation**: Gain of oxygen or loss of hydrogen.
   - **Reduction**: Loss of oxygen or gain of hydrogen.

> Remember
> Precipitation reactions produce insoluble salts (precipitates, denoted by $\\downarrow$).
`;

    case 'acids_bases_salts':
      return `
# Acids, Bases and Salts — Revision Notes

NCERT Chapter 2 covers the chemical properties of acids and bases, the pH scale, and families of salts.

---

## Properties of Acids and Bases
- **Acids**: Sour taste, turn blue litmus red, release $H^+$ ions in aqueous solution.
- **Bases**: Bitter taste, turn red litmus blue, release $OH^-$ ions in aqueous solution.

---

## The pH Scale
pH represents the potential of Hydrogen:
- **pH < 7**: Acidic (high $H^+$ concentration)
- **pH = 7**: Neutral (pure water)
- **pH > 7**: Basic (low $H^+$ concentration)

---

## Important Chemicals from Common Salt

1. **Sodium Hydroxide ($NaOH$)**: Produced by chlor-alkali process of brine.
2. **Bleaching Powder ($CaOCl_2$)**: Action of chlorine on dry slaked lime.
3. **Baking Soda ($NaHCO_3$)**: Used in baking.
4. **Washing Soda ($Na_2CO_3 \\cdot 10H_2O$)**: Recrystallization of sodium carbonate.
5. **Plaster of Paris ($CaSO_4 \\cdot \\frac{1}{2}H_2O$)**: Plastering fractured bones.

> Important
> Mixing Plaster of Paris with water forms **Gypsum**:
> $$CaSO_4 \\cdot \\frac{1}{2}H_2O + 1\\frac{1}{2}H_2O \\rightarrow CaSO_4 \\cdot 2H_2O$$
`;

    case 'metals_non_metals':
      return `
# Metals and Non-metals Revision Notes

NCERT Chapter 3 covers physical/chemical properties of metals, reactivity series, ionic bonding, and basic metallurgy.

---

## Chemical Properties of Metals
- **Reaction with Oxygen**: Metals combine with oxygen to form metal oxides (usually basic):
  $$2Cu + O_2 \\rightarrow 2CuO$$
- **Amphoteric Oxides**: Metal oxides that react with both acids and bases to produce salt and water (e.g., $Al_2O_3$, $ZnO$).
- **Reactivity Series**: Arrangement of metals in order of decreasing activities:
  $$\\text{K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au}$$

---

## Ionic Compounds
Compounds formed by the transfer of electrons from a metal to a non-metal.
- **Properties**: High melting/boiling points, crystalline solids, soluble in water, conduct electricity in molten/aqueous state.

> Remember
> Extraction of highly reactive metals (like $Na, Mg$) is done by electrolytic reduction, whereas medium reactive metals ($Zn, Fe$) undergo calcination or roasting.
`;

    case 'carbon_compounds':
      return `
# Carbon and its Compounds Revision Notes

NCERT Chapter 4 covers covalent bonding, homologous series, functional groups, and carbon chemical properties.

---

## Versatile Nature of Carbon
Carbon forms a large number of compounds due to two unique properties:
1. **Catenation**: The unique ability of carbon to form bonds with other atoms of carbon, giving rise to large chains.
2. **Tetravalency**: Carbon has 4 valence electrons, allowing it to bond with four other monovalent atoms.

---

## Homologous Series
A series of carbon compounds having the same functional group and chemical properties, where successive members differ by a $-CH_2-$ group ($14$ mass units).
- **Alkanes**: $C_nH_{2n+2}$
- **Alkenes**: $C_nH_{2n}$
- **Alkynes**: $C_nH_{2n-2}$

---

## Chemical Properties of Carbon Compounds
1. **Combustion**: Burning in oxygen to produce $CO_2$, water, heat, and light.
2. **Oxidation**: Converting alcohols to carboxylic acids using Alkaline $KMnO_4$.
3. **Addition Reaction**: Hydrogenation of unsaturated hydrocarbons in the presence of Nickel catalyst.
4. **Substitution Reaction**: Saturated hydrocarbons react with Chlorine in sunlight.

> Important
> **Esterification**: Reaction of ethanoic acid with ethanol in the presence of acid catalyst to form sweet-smelling esters:
> $$CH_3COOH + CH_3CH_2OH \\xrightarrow{\\text{Acid}} CH_3COOCH_2CH_3 + H_2O$$
`;

    case 'life_processes':
      return `
# Life Processes — Revision Notes

NCERT Chapter 5 covers nutrition, respiration, transportation, and excretion in living organisms.

---

## 1. Nutrition
- **Autotrophic**: Organisms make their own food (photosynthesis: $6CO_2 + 12H_2O \\xrightarrow{\\text{Chlorophyll, Sunlight}} C_6H_{12}O_6 + 6O_2 + 6H_2O$).
- **Heterotrophic**: Depend on other organisms (Digestive system: mouth, stomach, small intestine, large intestine).

---

## 2. Respiration
Breakdown of glucose to release energy ($ATP$):
- **Aerobic**: In mitochondria, presence of $O_2$ (produces $38$ ATP).
- **Anaerobic**: In cytoplasm/muscle cells, absence/lack of $O_2$ (produces lactic acid/ethanol, $2$ ATP).

---

## 3. Transportation
- **Humans**: Double circulation via the four-chambered human heart.
- **Plants**: Xylem transports water/minerals; Phloem translocates food.

---

## 4. Excretion
Removal of toxic metabolic wastes. The functional unit of the human kidney is the **Nephron**, which filters blood to produce urine.
`;

    case 'light':
      return `
# Light — Reflection and Refraction Notes

NCERT Chapter 10 covers spherical mirrors, refraction, lenses, and power.

---

## Reflection by Spherical Mirrors
- **Mirror Formula**:
  $$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
- **Magnification ($m$)**:
  $$m = -\\frac{v}{u} = \\frac{h_i}{h_o}$$

---

## Refraction and Lens Formulas
- **Snell's Law**:
  $$\\frac{\\sin i}{\\sin r} = \\text{constant } (n)$$
- **Lens Formula**:
  $$\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$$
- **Power of Lens ($P$)**:
  $$P = \\frac{1}{f \\text{ (in meters)}}$$
  The SI unit of power is **Dioptre** ($D$).

> Common Mistake
> Make sure to apply Cartesian Sign Conventions: object distance $u$ is always negative. Focal length $f$ is positive for convex lenses/mirrors and negative for concave ones.
`;

    case 'electricity':
      return `
# Electricity — Revision Notes

NCERT Chapter 12 covers electric current, potential difference, Ohm's law, resistance, and electrical power.

---

## Current and Potential Difference
- **Electric Current ($I$)**:
  $$I = \\frac{Q}{t}$$
- **Potential Difference ($V$)**:
  $$V = \\frac{W}{Q}$$

## Ohm's Law and Resistance
$$V = IR$$
Resistance ($R$) depends on length ($l$), area of cross-section ($A$), and temperature:
$$R = \\rho \\frac{l}{A}$$
*(where $\\rho$ is the resistivity of the material)*

- **Series combination**: $R_s = R_1 + R_2 + R_3$
- **Parallel combination**: $\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$

---

## Joule's Heating and Power
$$H = I^2Rt$$
$$P = VI = I^2R = \\frac{V^2}{R}$$
`;

    default:
      return `
# ${title} — Science Revision Notes

${desc}

---

## Core Scientific Concepts and Explanations

Key notes covering CBSE Syllabus guidelines. Refer to NCERT textbook illustrations and diagrams.

> Remember
> Focus on chemical equations, biological flowcharts, and physics sign conventions.
`;
  }
}

// Detailed Content Compiler for Social Science
function getSocialChapterContent(chapterId, title, desc) {
  switch (chapterId) {
    case 'nationalism_europe':
      return `
# The Rise of Nationalism in Europe Notes

NCERT History Chapter 1 covers the development of nation-states, revolutions, and the unification of Italy and Germany.

---

## The French Revolution and the Idea of the Nation
The French Revolution (1789) was the first clear expression of nationalism.
- Introduced ideas of *la patrie* (the fatherland) and *le citoyen* (the citizen).
- Standardized a central administrative system and uniform weights and measures.

---

## Napoleonic Code (Civil Code of 1804)
- Did away with all privileges based on birth.
- Established equality before the law and secured the right to property.
- Simplified administrative divisions and abolished the feudal system.

---

## Unification Timeline

| Nation | Key Figure | Year | Details |
| :--- | :--- | :--- | :--- |
| **Germany** | Otto von Bismarck | **1871** | Unified through three wars over seven years with Denmark, Austria, and France. King William I proclaimed Emperor. |
| **Italy** | Giuseppe Garibaldi / Cavour | **1861** | Victor Emmanuel II proclaimed King. Garibaldi's "Red Shirts" joined forces to liberate the southern regions. |

> Remember
> **Giuseppe Mazzini** founded secret societies *Young Italy* and *Young Europe* to promote unified republican states.
`;

    case 'nationalism_india':
      return `
# Nationalism in India Revision Notes

NCERT History Chapter 2 covers the Non-Cooperation and Civil Disobedience movements, Rowlatt Act, and Salt March.

---

## The Satyagraha Movements
Mahatma Gandhi returned to India in **January 1915**. He organized initial Satyagrahas:
- **1917 (Champaran, Bihar)**: Against the indigo plantation system.
- **1917 (Kheda, Gujarat)**: Demanding revenue relaxation due to crop failure.
- **1918 (Ahmedabad, Gujarat)**: Cotton mill workers' wage strike.

---

## Major Movements and Turning Points

### 1. The Rowlatt Act (1919) & Jallianwala Bagh
- The Act allowed detention of political prisoners without trial for up to 2 years.
- **Jallianwala Bagh Massacre (13 April 1919)**: General Dyer ordered troops to fire on a peaceful gathering in Amritsar.

### 2. Non-Cooperation Movement (1921 - 1922)
- Launched to support Khilafat and Swaraj.
- Called off in **February 1922** due to the Chauri Chaura violent clash.

### 3. Civil Disobedience & Salt March (1930)
- Started with the **Dandi March** (240 miles from Sabarmati to Dandi) from 12 March to 6 April 1930.
- Broke the government salt monopoly.

> Important
> The **Poona Pact (September 1932)** signed between Dr. B.R. Ambedkar and Gandhiji gave reserved seats to Depressed Classes in provincial and central councils.
`;

    case 'power_sharing':
      return `
# Power Sharing — Civics Revision Notes

NCERT Civics Chapter 1 compares power-sharing models in Belgium and Sri Lanka.

---

## Comparison: Belgium vs Sri Lanka

### Belgium (Accommodation Model)
- Equal number of Dutch and French-speaking ministers in the central government.
- State governments are not subordinate to the central government.
- **Community Government**: Elected by people belonging to one language community to handle cultural, educational, and language issues.

### Sri Lanka (Majoritarian Model)
- **Sinhala Supremacy**: Act of 1956 recognized Sinhala as the only official language.
- Favored Sinhala applicants for university jobs and government posts.
- Led to alienation of Sri Lankan Tamils and eventual Civil War.

---

## Forms of Power Sharing in Modern Democracies
1. **Horizontal Distribution**: Among different organs of government (Legislature, Executive, Judiciary). Creates a system of **checks and balances**.
2. **Vertical Division**: Among governments at different levels (Central, State, Local).
3. **Among Social Groups**: Sharing power with minority and weaker sections.
4. **Among Political Parties & Pressures**: Coalition governments.
`;

    default:
      return `
# ${title} — Social Science Notes

${desc}

---

## Core Chapters Summary & Board Guidelines

Key historical context, geographical data, civic frameworks, and economic indicators based on NCERT Class 10 Syllabus.

> Remember
> Read maps, note down timelines, check definitions, and focus on long-form answer structures.
`;
  }
}

// Detailed Content Compiler for English
function getEnglishChapterContent(chapterId, title, desc) {
  switch (chapterId) {
    case 'grammar_tenses':
      return `
# Tenses & Modals — English Grammar Revision Notes

A comprehensive guide to tenses matrices, structures, active usage, and modals.

---

## The Tense Matrix

### 1. Present Tense
- **Simple**: Subject + $V_1(s/es)$ + Object
  *Example:* "He writes essays."
- **Continuous**: Subject + is/am/are + $V_{ing}$ + Object
  *Example:* "He is writing essays."
- **Perfect**: Subject + has/have + $V_3$ + Object
  *Example:* "He has written an essay."
- **Perfect Continuous**: Subject + has/have + been + $V_{ing}$ + Object
  *Example:* "He has been writing essays for two hours."

### 2. Past Tense
- **Simple**: Subject + $V_2$ + Object
  *Example:* "He wrote an essay yesterday."
- **Perfect**: Subject + had + $V_3$ + Object
  *Example:* "He had written the essay before class started."

---

## Modals Chart
- **Possibility**: *May, Might, Can, Could*
- **Advice**: *Should, Ought to*
- **Obligation**: *Must, Have to*
- **Request**: *Will, Would, Can, Could*

> Common Mistake
> Do not use double modals together.
> - **Incorrect:** He might should go.
> - **Correct:** He should go.
`;

    default:
      return `
# ${title} — English Revision Notes

${desc}

---

## Literary Theme / Grammar Structure

Detailed study guides for CBSE Class 10th English literature prose/poems or grammar rules.

> Remember
> Focus on character sketches, central themes, and textbook question frameworks.
`;
  }
}

export function generateDetailedAllNotes() {
  ensureDirectory(notesDir);
  console.log('Compiling detailed revision notes under:', notesDir);

  let mathCount = 0;
  let scienceCount = 0;
  let socialCount = 0;
  let englishCount = 0;

  subjects.forEach((sub) => {
    const subFolder = path.join(notesDir, sub.id);
    ensureDirectory(subFolder);

    sub.chapters.forEach((chap) => {
      const fileName = `${chap.id}.md`;
      const filePath = path.join(subFolder, fileName);

      let body = '';
      if (sub.id === 'maths') {
        body = getMathsChapterContent(chap.id, chap.name, chap.description);
        mathCount++;
      } else if (sub.id === 'science') {
        body = getScienceChapterContent(chap.id, chap.name, chap.description);
        scienceCount++;
      } else if (sub.id === 'social') {
        body = getSocialChapterContent(chap.id, chap.name, chap.description);
        socialCount++;
      } else if (sub.id === 'english') {
        body = getEnglishChapterContent(chap.id, chap.name, chap.description);
        englishCount++;
      }

      const frontmatter = `---
title: "${chap.name}"
subject: "${sub.name}"
class: 10
chapter: "${chap.id}"
difficulty: "${chap.difficulty || 'Medium'}"
estimatedTime: "${chap.timeRequired || 15} minutes"
questions: ${chap.questionCount || 5}
lastUpdated: 2026-07-11
tags:
 - ${sub.id}
 - revision
 - ${chap.id.replace(/_/g, '-')}
---
`;

      const fullContent = frontmatter + body;
      fs.writeFileSync(filePath, fullContent, 'utf-8');
    });
  });

  console.log(`Successfully compiled detailed notes:`);
  console.log(`- Mathematics: ${mathCount} chapters`);
  console.log(`- Science: ${scienceCount} chapters`);
  console.log(`- Social Science: ${socialCount} chapters`);
  console.log(`- English Literature & Grammar: ${englishCount} chapters`);
}

generateDetailedAllNotes();
