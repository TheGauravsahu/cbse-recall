import { trigonometryQuestions } from "./chapters/math_trigonometry";
import { quadraticQuestions } from "./chapters/math_quadratic";
import { electricityQuestions } from "./chapters/science_electricity";
import { chemicalReactionsQuestions } from "./chapters/science_chemical_reactions";
import { nationalismIndiaQuestions } from "./chapters/social_nationalism_india";
import { grammarTensesQuestions } from "./chapters/english_grammar_tenses";
import { generateQuestions } from "./questionGenerator";

const questionBank = {
  "maths/trigonometry": trigonometryQuestions,
  "maths/quadratic_equations": quadraticQuestions,
  "science/electricity": electricityQuestions,
  "science/chemical_reactions": chemicalReactionsQuestions,
  "social/nationalism_india": nationalismIndiaQuestions,
  "english/grammar_tenses": grammarTensesQuestions
};

/**
 * Fetch questions for a specific subject and chapter.
 * Automatically falls back to the dynamic generator if not hardcoded.
 * @param {string} subjectId 
 * @param {string} chapterId 
 * @returns {Array} List of questions
 */
export const getQuestions = (subjectId, chapterId) => {
  const key = `${subjectId}/${chapterId}`;
  
  // Return static questions if defined, otherwise generate fallback questions
  if (questionBank[key]) {
    return questionBank[key];
  }
  
  return generateQuestions(subjectId, chapterId);
};

/**
 * Search the entire question bank including auto-generated sets.
 * @param {string} query 
 * @returns {Array} Search results
 */
export const searchQuestions = (query) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  // Search static questions first
  Object.entries(questionBank).forEach(([path, list]) => {
    const [subjectId, chapterId] = path.split("/");
    list.forEach(q => {
      if (
        q.question.toLowerCase().includes(lowerQuery) ||
        q.tags.some(t => t.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          ...q,
          subjectId,
          chapterId
        });
      }
    });
  });
  
  return results;
};
