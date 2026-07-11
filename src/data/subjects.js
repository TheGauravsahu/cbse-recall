export const subjects = [
  {
    id: "maths",
    name: "Mathematics",
    icon: "Calculator",
    emoji: "📐",
    description: "Master Trigonometry, Algebra, Coordinate Geometry, and probability through active recalls.",
    color: "from-yellow-400 to-amber-500",
    chapters: [
      { id: "real_numbers", name: "Real Numbers", description: "Learn Euclid's division lemma, fundamental theorem of arithmetic, and irrational proofs.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "polynomials", name: "Polynomials", description: "Solve relationships between roots and coefficients, division algorithms for polynomials.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "linear_equations", name: "Pair of Linear Equations in Two Variables", description: "Solve equations using graphical, substitution, and elimination methods.", questionCount: 5, difficulty: "Medium", timeRequired: 9, xpReward: 100 },
      { id: "quadratic_equations", name: "Quadratic Equations", description: "Solve roots, quadratic formulas, discriminants, and standard quadratic forms.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "arithmetic_progressions", name: "Arithmetic Progressions", description: "Understand arithmetic sequences, the nth term formula, and sum of first n terms.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "triangles", name: "Triangles", description: "Study similarity of triangles, Basic Proportionality Theorem (BPT), and Pythagoras proofs.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "coordinate_geometry", name: "Coordinate Geometry", description: "Understand distance formula, section formula, and area of triangles in coordinate plane.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "trigonometry", name: "Introduction to Trigonometry", description: "Understand trigonometric ratios, identities, and ratio tables for specific angles.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "applications_trigonometry", name: "Some Applications of Trigonometry", description: "Solve height and distance problems using angle of elevation and depression.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "circles", name: "Circles", description: "Study tangents to a circle, length of tangents from external points, and circle properties.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "areas_circles", name: "Areas Related to Circles", description: "Calculate perimeter and area of circle, area of sector, and segment of a circle.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "surface_areas_volumes", name: "Surface Areas and Volumes", description: "Calculate surface area and volume of combinations of solids: cubes, cylinders, cones.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "statistics", name: "Statistics", description: "Compute mean, median, and mode of grouped data, and cumulative frequency graphs.", questionCount: 5, difficulty: "Medium", timeRequired: 9, xpReward: 100 },
      { id: "probability", name: "Probability", description: "Find classical probability, theoretical probability, and card/coin event calculations.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 }
    ]
  },
  {
    id: "science",
    name: "Science",
    icon: "Atom",
    emoji: "🧪",
    description: "Explore Chemical Reactions, Electricity, Life Processes, and Magnetic Effects.",
    color: "from-orange-400 to-red-500",
    chapters: [
      { id: "chemical_reactions", name: "Chemical Reactions and Equations", description: "Study chemical combinations, decompositions, balancing equations, and redox.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "acids_bases_salts", name: "Acids, Bases and Salts", description: "Study pH indicators, neutralization reactions, and salts like baking soda and plaster of paris.", questionCount: 5, difficulty: "Easy", timeRequired: 7, xpReward: 80 },
      { id: "metals_non_metals", name: "Metals and Non-metals", description: "Explore ionic bonding, reactivity series, metallurgy processes, and corrosion.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "carbon_compounds", name: "Carbon and its Compounds", description: "Understand covalent bonds, homologous series, isomers, and functional groups.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "life_processes", name: "Life Processes", description: "Explore nutrition, respiration, transportation, and excretion in plants and humans.", questionCount: 5, difficulty: "Medium", timeRequired: 9, xpReward: 100 },
      { id: "control_coordination", name: "Control and Coordination", description: "Study nervous system, human brain structure, plant hormones, and endocrine glands.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "reproduction", name: "How do Organisms Reproduce?", description: "Explore asexual fission/budding, sexual reproduction in flowering plants and humans.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "heredity", name: "Heredity", description: "Study Mendel's experiments, law of segregation, and sex determination in humans.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 100 },
      { id: "light", name: "Light - Reflection and Refraction", description: "Master mirror formula, lens formula, magnification, and refractive index equations.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "human_eye", name: "The Human Eye and the Colorful World", description: "Study eye defects (myopia, hypermetropia), prism refraction, and scattering of light.", questionCount: 5, difficulty: "Easy", timeRequired: 7, xpReward: 80 },
      { id: "electricity", name: "Electricity", description: "Understand Ohm's law, factors affecting resistance, heating effect, and power.", questionCount: 5, difficulty: "Hard", timeRequired: 10, xpReward: 120 },
      { id: "magnetic_effects", name: "Magnetic Effects of Electric Current", description: "Explore field lines, electromagnetic induction, solenoid fields, and AC/DC generators.", questionCount: 5, difficulty: "Hard", timeRequired: 9, xpReward: 120 },
      { id: "our_environment", name: "Our Environment", description: "Study ecosystems, food chains, trophic levels, ozone depletion, and waste management.", questionCount: 5, difficulty: "Easy", timeRequired: 5, xpReward: 70 }
    ]
  },
  {
    id: "social",
    name: "Social Science",
    icon: "Globe",
    emoji: "🌍",
    description: "Review Satyagraha timelines, industrial revolutions, resource uses, and civics structures.",
    color: "from-green-400 to-emerald-500",
    chapters: [
      { id: "nationalism_europe", name: "Rise of Nationalism in Europe", description: "Analyze the French Revolution, unification of Italy and Germany, and imperialism.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 90 },
      { id: "nationalism_india", name: "Nationalism in India", description: "Recall Satyagraha, Rowlatt Act, Khilafat Movement, and Salt March timeline.", questionCount: 5, difficulty: "Medium", timeRequired: 7, xpReward: 90 },
      { id: "resources_development", name: "Resources and Development", description: "Classify resources, land degradation, soil profiles, and sustainable development planning.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "water_resources", name: "Water Resources", description: "Study rain harvesting methods, dams pros/cons, and water conservation practices.", questionCount: 5, difficulty: "Easy", timeRequired: 5, xpReward: 70 },
      { id: "agriculture", name: "Agriculture", description: "Differentiate Kharif, Rabi, and Zaid crops, farming types, and technological reforms.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "minerals_energy", name: "Minerals and Energy Resources", description: "Study classification of metallic/non-metallic ores, conventional/solar energy distribution.", questionCount: 5, difficulty: "Medium", timeRequired: 8, xpReward: 90 },
      { id: "manufacturing_industries", name: "Manufacturing Industries", description: "Analyze location factors for steel, textile, chemical plants, and environmental control.", questionCount: 5, difficulty: "Medium", timeRequired: 7, xpReward: 90 },
      { id: "power_sharing", name: "Power Sharing", description: "Compare power distribution models in Belgium and Sri Lanka, and horizontal/vertical shares.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "federalism", name: "Federalism", description: "Understand key features of federalism, three-tier lists, and decentralization in India.", questionCount: 5, difficulty: "Medium", timeRequired: 7, xpReward: 90 },
      { id: "gender_religion_caste", name: "Gender, Religion and Caste", description: "Analyze gender division, communalism, and secular states in political contexts.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 85 },
      { id: "political_parties", name: "Political Parties", description: "Study national vs regional parties, party reforms, and multi-party structures.", questionCount: 5, difficulty: "Medium", timeRequired: 7, xpReward: 90 },
      { id: "outcomes_democracy", name: "Outcomes of Democracy", description: "Evaluate accountability, social diversity, economic growth, and dignity of citizens.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "development", name: "Development", description: "Compare nations using per capita income, HDI metrics, and sustainable development goals.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "sectors_economy", name: "Sectors of the Indian Economy", description: "Classify primary, secondary, tertiary fields, organised/unorganised, and public/private.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 80 },
      { id: "money_credit", name: "Money and Credit", description: "Explore formal vs informal credit sources, role of RBI, and Self-Help Groups (SHGs).", questionCount: 5, difficulty: "Medium", timeRequired: 7, xpReward: 90 },
      { id: "globalisation", name: "Globalisation and the Indian Economy", description: "Analyze multinational corporations (MNCs), WTO roles, and impacts of globalisation.", questionCount: 5, difficulty: "Medium", timeRequired: 7, xpReward: 90 }
    ]
  },
  {
    id: "english",
    name: "English Literature & Grammar",
    icon: "BookOpen",
    emoji: "📖",
    description: "Master grammar syntax, reported speech, tenses, and literary reading recalls.",
    color: "from-blue-400 to-indigo-500",
    chapters: [
      { id: "grammar_tenses", name: "Tenses & Modals", description: "Analyze active/passive structures, correct modal fits, and past/future perfects.", questionCount: 5, difficulty: "Easy", timeRequired: 5, xpReward: 70 },
      { id: "subject_verb", name: "Subject-Verb Concord", description: "Study singular/plural structures, tricky subject pairings, and collective concord.", questionCount: 5, difficulty: "Easy", timeRequired: 5, xpReward: 75 },
      { id: "reported_speech", name: "Reported Speech", description: "Practice converting direct commands, questions, and assertions to indirect speech.", questionCount: 5, difficulty: "Medium", timeRequired: 6, xpReward: 85 },
      { id: "letter_to_god", name: "A Letter to God", description: "Recall Lencho's faith, postmaster's kindness, and crop failure events.", questionCount: 5, difficulty: "Easy", timeRequired: 5, xpReward: 70 },
      { id: "nelson_mandela", name: "Nelson Mandela: Long Walk to Freedom", description: "Review inauguration events, apartheid quotes, and Mandela's perspective on freedom.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 75 },
      { id: "flying_stories", name: "Two Stories about Flying", description: "Study the young seagull's first flight and the mysterious black aeroplane pilot.", questionCount: 5, difficulty: "Easy", timeRequired: 5, xpReward: 70 },
      { id: "anne_frank", name: "From the Diary of Anne Frank", description: "Recall Anne's thoughts, details of Kitty, and relationship with Mr. Keesing.", questionCount: 5, difficulty: "Easy", timeRequired: 6, xpReward: 75 }
    ]
  }
];
