require('dotenv').config();
const Doubt = require('../models/Doubt');
const { VertexAI } = require('@google-cloud/vertexai');

const Categories = {
  TECHNICAL: 'Technical',
  CONCEPT: 'Concept',
  THEORY: 'Theory',
};

// Keywords and patterns for each category
const CategoryPatterns = {
  TECHNICAL: {
    keywords: ['how to', 'code', 'program', 'implement', 'debug', 'error', 'function', 'class', 'method', 'syntax',
      'loop', 'array', 'variable', 'compile', 'execute', 'run', 'install', 'configure', 'deploy', 'build',
      'python', 'javascript', 'java', 'c++', 'php', 'ruby', 'sql', 'html', 'css', 'api'],
    patterns: [
      /how\s+(?:do|can|to|would|should)\s+(?:i|we|you)/i,
      /(?:show|tell|explain)\s+(?:me|us)\s+how/i,
      /what\s+(?:is|are)\s+the\s+steps/i,
    ]
  },
  CONCEPT: {
    keywords: ['what is', 'definition', 'explain', 'concept', 'mean', 'difference between', 'compare', 'contrast',
      'understand', 'principle', 'fundamentals', 'basics', 'introduction', 'overview', 'describe'],
    patterns: [
      /what\s+(?:is|are|does)/i,
      /(?:explain|describe)\s+(?:the|a)\s+concept/i,
      /difference\s+between/i,
    ]
  },
  THEORY: {
    keywords: ['why', 'theory', 'principle', 'foundation', 'background', 'architecture', 'design pattern',
      'algorithm', 'complexity', 'paradigm', 'methodology', 'best practice', 'approach', 'strategy'],
    patterns: [
      /why\s+(?:do|does|is|are|should)/i,
      /(?:explain|describe)\s+(?:the|a)\s+theory/i,
      /what\s+(?:is|are)\s+the\s+principles/i,
    ]
  }
};

const vertex = new VertexAI({
  project: "gen-lang-client-0414811472",
  location: process.env.VERTEX_LOCATION || 'us-central1',
});

const model = vertex.preview.getGenerativeModel({
  model: 'gemini-pro',
  generation_config: {
    max_output_tokens: 50,
    temperature: 0.2,
  },
});

function analyzeText(text) {
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();

  // Score for each category
  const scores = {
    TECHNICAL: 0,
    CONCEPT: 0,
    THEORY: 0
  };

  // Calculate scores based on keywords and patterns
  Object.entries(CategoryPatterns).forEach(([category, patterns]) => {
    // Check keywords
    patterns.keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        scores[category] += 1;
      }
    });

    // Check regex patterns
    patterns.patterns.forEach(pattern => {
      if (pattern.test(lowerText)) {
        scores[category] += 2; // Patterns have higher weight than keywords
      }
    });
  });

  // Return the category with the highest score, defaulting to CONCEPT if all scores are 0
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return Categories.CONCEPT;

  return Categories[
    Object.entries(scores).find(([_, score]) => score === maxScore)[0]
  ];
}

async function classifyText(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const aiClassification = result.response.candidates[0].content.parts[0].text.trim();
    console.log('Vertex AI Classification:', aiClassification);

    // Get rule-based classification
    const ruleBasedClassification = analyzeText(prompt);
    console.log('Rule-based Classification:', ruleBasedClassification);

    // If AI classification matches our categories, use it; otherwise use rule-based
    const normalizedAICategory = Object.values(Categories).find(
      cat => cat.toLowerCase() === aiClassification.toLowerCase()
    );

    return normalizedAICategory || ruleBasedClassification;
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    // Fallback to rule-based classification in case of API error
    return analyzeText(prompt);
  }
}

async function classifyAndUpdateCategory(questionId) {
  try {
    const doubt = await Doubt.findById(questionId);
    if (!doubt) {
      throw new Error('Doubt not found');
    }

    // If category already exists, return the document
    if (doubt.category && Object.values(Categories).includes(doubt.category)) {
      console.log('Category already exists:', doubt.category);
      return doubt;
    }

    // Generate prompt for classification with explicit instructions and examples
    const prompt = `
      Classify the following text into exactly one of these categories: ${Object.values(Categories).join(', ')}.
      
      Guidelines:
      - Technical: Questions about implementation, coding, or specific programming tasks
      - Concept: Questions about understanding definitions or basic ideas
      - Theory: Questions about underlying principles or theoretical foundations
      
      Respond with only the category name, nothing else.
      
      Text: "${doubt.text}"
    `;

    // Get classification
    const classifiedCategory = await classifyText(prompt);

    // Update the document in the database
    doubt.category = classifiedCategory;
    await doubt.save();
    console.log('Category updated successfully:', classifiedCategory);
    return doubt;
  } catch (error) {
    console.error('Error in classifyAndUpdateCategory:', error);
    throw error;
  }
}

module.exports = {
  classifyText,
  classifyAndUpdateCategory,
  Categories,
};
