export const trigonometryQuestions = [
  {
    id: "math_trig_q1",
    question: "What is the exact value of sin 60°?",
    options: ["1/2", "√3/2", "√2/2", "0"],
    correctAnswer: "√3/2",
    difficulty: "Easy",
    solution: "Using the standard trigonometric values, sin 60° is equal to √3/2.",
    hint: "Refer to the standard angle table for 0°, 30°, 45°, 60°, and 90°.",
    explanation: "From the standard values, sin 0° = 0, sin 30° = 1/2, sin 45° = 1/√2 (or √2/2), sin 60° = √3/2, and sin 90° = 1.",
    tags: ["Trigonometry", "NCERT", "CBSE 2024"]
  },
  {
    id: "math_trig_q2",
    question: "If tan A = 4/3, what is the value of sin A?",
    options: ["3/5", "4/5", "5/4", "3/4"],
    correctAnswer: "4/5",
    difficulty: "Medium",
    solution: "Since tan A = opposite/adjacent = 4/3, by Pythagoras theorem, the hypotenuse is √(4² + 3²) = 5. Therefore, sin A = opposite/hypotenuse = 4/5.",
    hint: "Use Pythagoras theorem: Hypotenuse² = Opposite² + Adjacent².",
    explanation: "tan A = 4/3 indicates a right-angled triangle with opposite side = 4k and adjacent side = 3k. Hypotenuse = √(16k² + 9k²) = 5k. Thus, sin A = opposite/hypotenuse = 4k/5k = 4/5.",
    tags: ["Trigonometry", "Pythagoras", "NCERT"]
  },
  {
    id: "math_trig_q3",
    question: "Simplify the expression: (1 - sin² θ) * sec² θ.",
    options: ["0", "1", "sin² θ", "cos² θ"],
    correctAnswer: "1",
    difficulty: "Easy",
    solution: "By the fundamental identity, 1 - sin² θ = cos² θ. Since sec² θ = 1/cos² θ, the product is cos² θ * (1/cos² θ) = 1.",
    hint: "Use the identity sin² θ + cos² θ = 1.",
    explanation: "Step 1: Replace (1 - sin² θ) with cos² θ.\nStep 2: Note that sec² θ = 1 / cos² θ.\nStep 3: Multiply: cos² θ * (1 / cos² θ) = 1.",
    tags: ["Trigonometry Identities", "NCERT"]
  },
  {
    id: "math_trig_q4",
    question: "If sin θ + cos θ = √2 cos θ, what is the value of cos θ - sin θ?",
    options: ["√2 sin θ", "2 sin θ", "√2 cos θ", "sin θ"],
    correctAnswer: "√2 sin θ",
    difficulty: "Hard",
    solution: "Squaring both sides and solving, or by shifting terms: sin θ = (√2 - 1) cos θ. Multiply both sides by (√2 + 1) to get (√2 + 1) sin θ = cos θ. Re-arranging gives cos θ - sin θ = √2 sin θ.",
    hint: "Try to express cos θ in terms of sin θ by isolating terms, or rationalize (√2 - 1).",
    explanation: "Given sin θ + cos θ = √2 cos θ\n=> sin θ = √2 cos θ - cos θ = (√2 - 1) cos θ\nMultiply by (√2 + 1):\n=> (√2 + 1) sin θ = (√2 - 1)(√2 + 1) cos θ\n=> √2 sin θ + sin θ = (2 - 1) cos θ\n=> √2 sin θ + sin θ = cos θ\n=> cos θ - sin θ = √2 sin θ.",
    tags: ["Trigonometry", "Identities", "CBSE Exemplar"]
  },
  {
    id: "math_trig_q5",
    question: "Assertion: The value of sin θ increases as θ increases from 0° to 90°.\nReason: The value of cos θ also increases as θ increases from 0° to 90°.",
    options: [
      "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
      "Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.",
      "Assertion is true but Reason is false.",
      "Assertion is false but Reason is true."
    ],
    correctAnswer: "Assertion is true but Reason is false.",
    difficulty: "Medium",
    solution: "The value of sin θ increases from 0 to 1, while cos θ decreases from 1 to 0 as θ increases from 0° to 90°. Hence Assertion is true, Reason is false.",
    hint: "Recall values: sin 0° = 0, sin 90° = 1. cos 0° = 1, cos 90° = 0.",
    explanation: "As angle increases from 0° to 90°, the height of the opposite side increases relative to the hypotenuse (sin θ increases), but the base length decreases relative to the hypotenuse (cos θ decreases).",
    tags: ["Assertion Reason", "CBSE Board Paper"]
  }
];
