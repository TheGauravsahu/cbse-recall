/**
 * Fallback CBSE Question Generator
 * Generates realistic Class 10 CBSE questions dynamically for any chapter.
 */

const MATH_FALLBACKS = {
  real_numbers: [
    {
      id: "gen_math_real_1",
      question: "Find the HCF of 96 and 404 using prime factorization.",
      options: ["4", "2", "8", "12"],
      correctAnswer: "4",
      difficulty: "Easy",
      solution: "96 = 2^5 * 3, and 404 = 2^2 * 101. HCF is the product of the smallest powers of common factors: 2^2 = 4.",
      hint: "Break both numbers into their prime factors.",
      explanation: "The prime factorization yields common base 2, with the lowest exponent being 2. Therefore, HCF = 2² = 4.",
      tags: ["Real Numbers", "HCF", "NCERT"]
    },
    {
      id: "gen_math_real_2",
      question: "If two positive integers a and b are written as a = x³y² and b = xy³, where x, y are prime numbers, then find HCF(a, b).",
      options: ["xy²", "x³y³", "x²y²", "xy"],
      correctAnswer: "xy²",
      difficulty: "Medium",
      solution: "HCF(a, b) = x^(min(3,1)) * y^(min(2,3)) = x^1 * y^2 = xy².",
      hint: "Take the lowest power of each common prime factor.",
      explanation: "For HCF, we choose common factors with the lowest exponents: x^1 and y^2. Thus, HCF = xy².",
      tags: ["Real Numbers", "Algebraic factors", "CBSE Exemplar"]
    }
  ],
  polynomials: [
    {
      id: "gen_math_poly_1",
      question: "Find the quadratic polynomial whose zeroes are -3 and 4.",
      options: ["x² - x - 12", "x² + x - 12", "x² - x + 12", "x² + x + 12"],
      correctAnswer: "x² - x - 12",
      difficulty: "Medium",
      solution: "Sum of zeroes (S) = -3 + 4 = 1. Product (P) = -3 * 4 = -12. Equation is x² - Sx + P = x² - (1)x + (-12) = x² - x - 12.",
      hint: "Use formula: x² - (Sum of zeroes)x + (Product of zeroes).",
      explanation: "Zeroes alpha=-3, beta=4. Sum = 1, Product = -12. Substituting into x² - Sx + P gives x² - x - 12.",
      tags: ["Polynomials", "Zeroes", "NCERT"]
    }
  ],
  arithmetic_progressions: [
    {
      id: "gen_math_ap_1",
      question: "Find the 10th term of the AP: 2, 7, 12, ...",
      options: ["47", "42", "50", "37"],
      correctAnswer: "47",
      difficulty: "Easy",
      solution: "Here a = 2, d = 7 - 2 = 5. a_10 = a + (10 - 1)d = 2 + 9(5) = 2 + 45 = 47.",
      hint: "Use the formula: a_n = a + (n - 1)d.",
      explanation: "Applying the general term formula for n=10, a=2, and d=5, we get a_10 = 2 + 9 * 5 = 47.",
      tags: ["Arithmetic Progression", "nth Term", "NCERT"]
    },
    {
      id: "gen_math_ap_2",
      question: "What is the sum of the first 20 natural numbers?",
      options: ["210", "190", "420", "400"],
      correctAnswer: "210",
      difficulty: "Easy",
      solution: "Sum of first n natural numbers = n(n+1)/2. For n=20: 20(21)/2 = 210.",
      hint: "Use the natural numbers sum formula, or AP sum formula with a=1, d=1.",
      explanation: "S_n = n(n + 1) / 2. S_20 = 20 * 21 / 2 = 10 * 21 = 210.",
      tags: ["AP Sum", "Algebra"]
    }
  ],
  coordinate_geometry: [
    {
      id: "gen_math_cg_1",
      question: "Find the distance between the points (2, 3) and (4, 1).",
      options: ["2√2", "4", "2", "√2"],
      correctAnswer: "2√2",
      difficulty: "Easy",
      solution: "Distance = √[(4-2)² + (1-3)²] = √[2² + (-2)²] = √[4 + 4] = √8 = 2√2.",
      hint: "Use the distance formula: d = √[(x2 - x1)² + (y2 - y1)²].",
      explanation: "Substituting the coordinates into the formula yields √[2² + (-2)²] = √8 = 2√2.",
      tags: ["Coordinate Geometry", "Distance Formula", "NCERT"]
    }
  ],
  surface_areas_volumes: [
    {
      id: "gen_math_sav_1",
      question: "If the radius of a sphere is doubled, what happens to its volume?",
      options: ["It becomes 8 times", "It becomes 4 times", "It becomes 2 times", "It remains unchanged"],
      correctAnswer: "It becomes 8 times",
      difficulty: "Medium",
      solution: "Volume of sphere = 4/3 * π * r³. If r is doubled (2r), volume V' = 4/3 * π * (2r)³ = 8 * (4/3 * π * r³) = 8V.",
      hint: "Remember that volume depends on the cube of the radius.",
      explanation: "Since volume is proportional to r³, scaling the radius by 2 scales the volume by 2³ = 8.",
      tags: ["Surface Areas and Volumes", "Sphere", "CBSE Exemplar"]
    }
  ]
};

const SCIENCE_FALLBACKS = {
  acids_bases_salts: [
    {
      id: "gen_sci_abs_1",
      question: "Which of the following is present in tomato?",
      options: ["Oxalic acid", "Citric acid", "Tartaric acid", "Acetic acid"],
      correctAnswer: "Oxalic acid",
      difficulty: "Easy",
      solution: "Tomatoes contain oxalic acid naturally. Lemons/oranges contain citric acid, tamarind contains tartaric, vinegar contains acetic.",
      hint: "It is an organic acid also found in spinach.",
      explanation: "Tomatoes contain oxalic acid. Thus, eating tomatoes increases oxalic levels, which makes Oxalic Acid the correct answer.",
      tags: ["Acids Bases", "Natural Acids", "NCERT"]
    },
    {
      id: "gen_sci_abs_2",
      question: "What is the pH of a neutral aqueous solution at 25°C?",
      options: ["7", "0", "14", "1"],
      correctAnswer: "7",
      difficulty: "Easy",
      solution: "A neutral solution has equal concentration of hydrogen and hydroxyl ions, which corresponds to pH = 7.",
      hint: "Think of pure drinking water's pH.",
      explanation: "pH scales run from 0 (highly acidic) to 14 (highly basic). A pH of 7 represents a completely neutral solution.",
      tags: ["pH Scale", "NCERT"]
    }
  ],
  metals_non_metals: [
    {
      id: "gen_sci_mnm_1",
      question: "Which of the following metals is stored in kerosene oil to prevent accidental fires?",
      options: ["Sodium", "Iron", "Gold", "Copper"],
      correctAnswer: "Sodium",
      difficulty: "Easy",
      solution: "Sodium is highly reactive and reacts vigorously with moisture and oxygen in air. Storing it in kerosene keeps it isolated.",
      hint: "It is a highly reactive alkali metal that can be cut with a knife.",
      explanation: "Sodium reacts exothermically with air and water, catch fires easily. Storing it in kerosene prevents exposure to humidity.",
      tags: ["Metals", "Reactivity", "NCERT"]
    }
  ],
  light: [
    {
      id: "gen_sci_light_1",
      question: "A concave mirror has a radius of curvature of 30 cm. What is its focal length?",
      options: ["-15 cm", "15 cm", "-30 cm", "30 cm"],
      correctAnswer: "-15 cm",
      difficulty: "Easy",
      solution: "Focal length f = R / 2. According to sign convention, focal length of a concave mirror is negative. f = -30 / 2 = -15 cm.",
      hint: "Remember f = R / 2. Concave mirrors face the negative x-axis.",
      explanation: "R = 30cm. The center of curvature for concave mirror lies in front of it (negative). Thus f = -30/2 = -15cm.",
      tags: ["Light", "Mirrors", "Sign Convention"]
    }
  ]
};

const SOCIAL_FALLBACKS = {
  nationalism_europe: [
    {
      id: "gen_soc_eur_1",
      question: "Who was proclaimed the German Emperor in January 1871 in a ceremony held at Versailles?",
      options: ["Kaiser William I", "William II", "Otto von Bismarck", "Friedrich Wilhelm IV"],
      correctAnswer: "Kaiser William I",
      difficulty: "Easy",
      solution: "In January 1871, the Prussian King, Kaiser William I, was proclaimed German Emperor in a ceremony at Versailles after German unification.",
      hint: "He was the Prussian king during Bismarck's unification campaign.",
      explanation: "German unification concluded with Prussia leading. Kaiser William I was crowned emperor in the Hall of Mirrors at Versailles.",
      tags: ["History", "German Unification", "NCERT"]
    }
  ],
  sectors_economy: [
    {
      id: "gen_soc_sec_1",
      question: "Agriculture, dairy, fishing, and forestry are activities of which sector of the economy?",
      options: ["Primary sector", "Secondary sector", "Tertiary sector", "Quaternary sector"],
      correctAnswer: "Primary sector",
      difficulty: "Easy",
      solution: "Activities that directly exploit natural resources are classified under the Primary sector.",
      hint: "These form the base/primary step for industrial production.",
      explanation: "Since farming and fishing directly use earth's natural assets, they belong to the Primary sector.",
      tags: ["Economics", "Sectors of Economy", "NCERT"]
    }
  ]
};

const ENGLISH_FALLBACKS = {
  subject_verb: [
    {
      id: "gen_eng_sv_1",
      question: "Choose the correct verb: 'The committee ________ split in their opinions on the new school rules.'",
      options: ["were", "was", "is", "has"],
      correctAnswer: "were",
      difficulty: "Medium",
      solution: "When a collective noun like 'committee' acts as individuals or is split/divided, it takes a plural verb ('were').",
      hint: "Notice the plural indicator 'in their opinions'.",
      explanation: "If the committee acted as one unit, we would use 'was'. Since they are split, they are treated as individuals, requiring 'were'.",
      tags: ["Subject Verb Agreement", "Grammar"]
    }
  ]
};

// Generic generator if no specific chapter questions written
const generateGenericQuestions = (subjectId, chapterId, index) => {
  const titles = {
    maths: {
      q: `Identify the correct step to simplify standard Class 10 CBSE Math operations for topic [${chapterId}].`,
      opts: ["Use fundamental identities and formulas", "Solve linear factors by substitution", "Apply Pythagoras theorem directly", "Verify roots using discriminant"],
      ans: "Use fundamental identities and formulas",
      sol: "Verify that standard NCERT formulas are matched when simplifying mathematical equations.",
      hint: "Recall core algebraic properties."
    },
    science: {
      q: `In a CBSE laboratory experiment regarding [${chapterId}], which observation is most likely correct?`,
      opts: ["A chemical change occurs releasing heat energy", "The litmus paper changes color showing acidic character", "Electrical resistance drops to zero", "Mass remains conserved under closed systems"],
      ans: "Mass remains conserved under closed systems",
      sol: "Class 10 science experiments emphasize law of conservation of mass and observations.",
      hint: "Consider fundamental physical laws."
    },
    social: {
      q: `Which of the following aspects was a primary cause or feature in CBSE syllabus for [${chapterId}]?`,
      opts: ["Demand for democratic representation and rights", "Industrial development in urban nodes", "Environmental sustainability planning", "Decentralized federal distribution of powers"],
      ans: "Demand for democratic representation and rights",
      sol: "CBSE history and civics chapters heavily highlight democratic values and movements.",
      hint: "Think about constitutional frameworks."
    },
    english: {
      q: `Identify the grammatically correct sentence structure for [${chapterId}] active recall testing.`,
      opts: ["She has been reading the grammar book since morning.", "She had readed the story book yesterday.", "Neither he nor they was present at the class.", "The committee is split in their views."],
      ans: "She has been reading the grammar book since morning.",
      sol: "Present perfect continuous uses 'has/have been + V-ing + since/for'.",
      hint: "Check time markers and auxiliary verb combinations."
    }
  };

  const subjectMeta = titles[subjectId] || titles.maths;

  return {
    id: `dynamic_${subjectId}_${chapterId}_q${index}`,
    question: `${subjectMeta.q} (Active Recall Q${index})`,
    options: [...subjectMeta.opts],
    correctAnswer: subjectMeta.ans,
    difficulty: index % 2 === 0 ? "Medium" : "Easy",
    solution: subjectMeta.sol,
    hint: subjectMeta.hint,
    explanation: `This is an auto-generated active recall question designed to test core concept understandings for Class 10 CBSE: ${chapterId}.`,
    tags: ["CBSE Recall", "Active Practice", subjectId.toUpperCase()]
  };
};

/**
 * Generates or resolves 5 questions for any given subject and chapter
 */
export const generateQuestions = (subjectId, chapterId) => {
  let list = [];
  
  // 1. Resolve specific static fallback list if defined
  if (subjectId === "maths" && MATH_FALLBACKS[chapterId]) {
    list = [...MATH_FALLBACKS[chapterId]];
  } else if (subjectId === "science" && SCIENCE_FALLBACKS[chapterId]) {
    list = [...SCIENCE_FALLBACKS[chapterId]];
  } else if (subjectId === "social" && SOCIAL_FALLBACKS[chapterId]) {
    list = [...SOCIAL_FALLBACKS[chapterId]];
  } else if (subjectId === "english" && ENGLISH_FALLBACKS[chapterId]) {
    list = [...ENGLISH_FALLBACKS[chapterId]];
  }

  // 2. Pad up to 5 questions using generic generator
  while (list.length < 5) {
    const idx = list.length + 1;
    list.push(generateGenericQuestions(subjectId, chapterId, idx));
  }

  return list;
};
