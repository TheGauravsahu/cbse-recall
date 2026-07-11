export const quadraticQuestions = [
  {
    id: "math_quad_q1",
    question: "What are the roots of the quadratic equation x² - 5x + 6 = 0?",
    options: ["2 and 3", "-2 and -3", "2 and -3", "-2 and 3"],
    correctAnswer: "2 and 3",
    difficulty: "Easy",
    solution: "Factoring the equation: x² - 2x - 3x + 6 = 0 => x(x - 2) - 3(x - 2) = 0 => (x - 2)(x - 3) = 0. Thus, x = 2 or x = 3.",
    hint: "Find two numbers that multiply to 6 and add up to -5.",
    explanation: "Using splitting the middle term: x² - 5x + 6 = 0 can be written as (x-2)(x-3) = 0, giving roots 2 and 3.",
    tags: ["Quadratic Equations", "NCERT"]
  },
  {
    id: "math_quad_q2",
    question: "If the roots of the quadratic equation ax² + bx + c = 0 are real and equal, what is the value of the discriminant (D = b² - 4ac)?",
    options: ["D > 0", "D < 0", "D = 0", "D is undefined"],
    correctAnswer: "D = 0",
    difficulty: "Easy",
    solution: "For a quadratic equation to have equal and real roots, the discriminant D must be exactly equal to 0.",
    hint: "Recall the nature of roots using the discriminant value.",
    explanation: "If D > 0, roots are real and distinct. If D = 0, roots are real and equal. If D < 0, roots are imaginary (not real).",
    tags: ["Discriminant", "Nature of Roots", "NCERT"]
  },
  {
    id: "math_quad_q3",
    question: "Find the values of k for which the quadratic equation x² - kx + 4 = 0 has equal roots.",
    options: ["±2", "±4", "±8", "0"],
    correctAnswer: "±4",
    difficulty: "Medium",
    solution: "For equal roots, D = b² - 4ac = 0. Here, a=1, b=-k, c=4. Thus, (-k)² - 4(1)(4) = 0 => k² - 16 = 0 => k = ±4.",
    hint: "Set b² - 4ac = 0 and solve for k.",
    explanation: "D = (-k)² - 4 * 1 * 4 = k² - 16. Setting D = 0 gives k² = 16, which results in k = ±4.",
    tags: ["Quadratic Equations", "CBSE 2023"]
  },
  {
    id: "math_quad_q4",
    question: "True or False: The quadratic equation x² + x + 5 = 0 has real roots.",
    options: ["True", "False"],
    correctAnswer: "False",
    difficulty: "Medium",
    solution: "Discriminant D = b² - 4ac = 1² - 4(1)(5) = 1 - 20 = -19. Since D < 0, the equation has no real roots.",
    hint: "Calculate D = b² - 4ac and check if it is negative.",
    explanation: "Because the discriminant is -19 (which is less than 0), the roots are complex/imaginary, meaning there are no real roots. Therefore, the statement is False.",
    tags: ["True False", "Discriminant"]
  },
  {
    id: "math_quad_q5",
    question: "Assertion: The roots of x² - 3x - 10 = 0 are 5 and -2.\nReason: A quadratic equation ax² + bx + c = 0 can have at most 2 real roots.",
    options: [
      "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
      "Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.",
      "Assertion is true but Reason is false.",
      "Assertion is false but Reason is true."
    ],
    correctAnswer: "Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.",
    difficulty: "Hard",
    solution: "Assertion is true because (5)² - 3(5) - 10 = 0 and (-2)² - 3(-2) - 10 = 0. Reason is also a true mathematical statement (Fundamental Theorem of Algebra states degree 2 has at most 2 roots). However, the reason does not explain why 5 and -2 are the specific roots of this equation.",
    hint: "Verify if 5 and -2 are roots, check if the degree statement is true, and see if it explains the factorization.",
    explanation: "Splitting middle terms gives (x-5)(x+2)=0. This yields roots 5 and -2 (Assertion true). The general statement that degree 2 polynomials have at most 2 roots is true, but it's not the *reason* why the roots of this specific equation are 5 and -2.",
    tags: ["Assertion Reason", "CBSE Board Paper"]
  }
];
