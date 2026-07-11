export const electricityQuestions = [
  {
    id: "sci_elec_q1",
    question: "Ohm's Law states the direct relationship between which of the following quantities (keeping temperature constant)?",
    options: ["Current and Potential Difference", "Current and Resistance", "Charge and Time", "Work and Potential Difference"],
    correctAnswer: "Current and Potential Difference",
    difficulty: "Easy",
    solution: "Ohm's Law states V = IR, meaning Potential Difference (V) is directly proportional to Current (I) passing through a conductor at constant temperature.",
    hint: "Think of V ∝ I.",
    explanation: "At a constant temperature, the current flowing through a conductor is directly proportional to the potential difference across its ends.",
    tags: ["Electricity", "Ohm's Law", "NCERT"]
  },
  {
    id: "sci_elec_q2",
    question: "Two resistors with resistances 6 Ω and 3 Ω are connected in parallel. What is their equivalent resistance?",
    options: ["9 Ω", "4.5 Ω", "2 Ω", "0.5 Ω"],
    correctAnswer: "2 Ω",
    difficulty: "Medium",
    solution: "For parallel connection: 1/Rp = 1/R1 + 1/R2 = 1/6 + 1/3 = 3/6 = 1/2. Thus, Rp = 2 Ω.",
    hint: "Use the formula 1/Rp = 1/R1 + 1/R2.",
    explanation: "The parallel resistance formula gives: Rp = (R1 * R2) / (R1 + R2) = (6 * 3) / (6 + 3) = 18 / 9 = 2 Ω.",
    tags: ["Electricity", "Parallel Circuit", "NCERT"]
  },
  {
    id: "sci_elec_q3",
    question: "If the length of a metallic wire is doubled and its cross-sectional area is halved, how does its resistance change?",
    options: ["It becomes 4 times", "It becomes 2 times", "It is halved", "It remains unchanged"],
    correctAnswer: "It becomes 4 times",
    difficulty: "Hard",
    solution: "Resistance R = ρ * (L/A). If L becomes 2L and A becomes A/2, the new resistance R' = ρ * (2L / (A/2)) = 4 * ρ * (L/A) = 4R.",
    hint: "Recall R = ρL/A. Replace L with 2L and A with A/2.",
    explanation: "Doubling the length doubles resistance. Halving the cross-sectional area doubles resistance again. Combined, the resistance increases by 2 * 2 = 4 times.",
    tags: ["Resistivity", "Resistance Factors", "CBSE 2024"]
  },
  {
    id: "sci_elec_q4",
    question: "True or False: The resistivity of a metal wire depends on its length and thickness.",
    options: ["True", "False"],
    correctAnswer: "False",
    difficulty: "Medium",
    solution: "Resistivity is an intrinsic property of the material and only changes with temperature and the nature of the material, not with the shape, length, or cross-sectional area.",
    hint: "Distinguish between resistance (shape-dependent) and resistivity (material-dependent).",
    explanation: "While resistance (R) changes with length and area, resistivity (ρ) remains constant for a given material at a specific temperature. Thus, the statement is False.",
    tags: ["True False", "Resistivity"]
  },
  {
    id: "sci_elec_q5",
    question: "Assertion: An ammeter is always connected in series in an electric circuit.\nReason: Ammeters have very low electrical resistance.",
    options: [
      "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
      "Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.",
      "Assertion is true but Reason is false.",
      "Assertion is false but Reason is true."
    ],
    correctAnswer: "Both Assertion and Reason are true and Reason is the correct explanation of Assertion.",
    difficulty: "Hard",
    solution: "Assertion is true because ammeters measure active current in a branch and must receive all the current. Reason is true and explains the assertion because a low resistance ensures the ammeter doesn't significantly drop voltage or reduce current in the circuit.",
    hint: "Think about current measurement and how high resistance would affect it.",
    explanation: "If an ammeter had high resistance, it would increase the total resistance of the series circuit, thereby changing and reducing the current it is trying to measure. Its series connections and low resistance are designed to prevent this.",
    tags: ["Assertion Reason", "Electricity", "CBSE Board Paper"]
  }
];
