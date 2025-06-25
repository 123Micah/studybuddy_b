// controllers/aiController.js

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini client
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not defined. Please set it in your .env file.');
    process.exit(1);
}

// Choose the Gemini model. 'gemini-1.5-flash' is a great choice for speed and cost-efficiency
// while still being very capable. 'gemini-1.5-pro' offers higher quality for more complex tasks.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Define a single model for all tasks, since Gemini will handle them all
const MODELS = {
    MAIN_GENERATION_MODEL: 'gemini-2.5-flash', // Or 'gemini-1.5-pro' if preferred for higher quality
};

/**
 * POST /api/ai/generate
 * Body: { prompt: string, type: 'notes' | 'quiz' | 'flashcards' }
 * Header: Authorization: Bearer <JWT token>
 *
 * Returns JSON: { result: string }
 */
const generateContent = async (req, res) => {
    const { prompt, type } = req.body;

    // Input validation
    if (!prompt) {
        return res.status(400).json({ message: 'The "prompt" field is required.' });
    }
    if (!type) {
        return res.status(400).json({ message: 'The "type" field is required (e.g., "notes", "quiz", "flashcards").' });
    }
    if (!['notes', 'quiz', 'flashcards'].includes(type)) {
        return res.status(400).json({ message: 'Invalid "type" specified. Must be "notes", "quiz", or "flashcards".' });
    }

    try {
        let instruction;
        let resultText;
        const modelToUse = MODELS.MAIN_GENERATION_MODEL; // All tasks use Gemini

        switch (type) {
            case 'notes':
                // Instruction for summarization
                instruction = `Summarize the following text or topic to create concise study notes. Focus on key concepts and important details, presented in an easy-to-read format (e.g., bullet points or short paragraphs). The topic/text is: "${prompt}".`;
                console.log(`⏳ Generating study notes using ${modelToUse} (Google Gemini)...`);
                break;

            case 'quiz':
                // Instruction for quiz generation
                instruction = `Generate 5 multiple-choice quiz questions with 4 distinct options each. Clearly indicate the correct answer for each question. The questions should be based on the following topic or text: "${prompt}". Format the output clearly with questions, options (a, b, c, d), and the correct answer (e.g., "Correct Answer: [option letter]" or "Answer: (A)").`;
                console.log(`⏳ Generating quiz using ${modelToUse} (Google Gemini)...`);
                break;

            case 'flashcards':
                // Instruction for flashcard generation
                instruction = `Create 5 concise flashcards, each with a clear question and a corresponding answer, based on the topic: "${prompt}". Format each flashcard as "Question: [Your question]\nAnswer: [Your answer]".`;
                console.log(`⏳ Generating flashcards using ${modelToUse} (Google Gemini)...`);
                break;

            default:
                // This should not be reached due to initial type validation
                return res.status(400).json({ message: 'Unsupported content type.' });
        }

        // Generate content using Gemini
        const generationConfig = {
            temperature: 0.7, // Adjust as needed for creativity vs. factual accuracy
            topP: 0.9,        // Nucleus sampling
            topK: 40,         // Top-k sampling
            maxOutputTokens: 1024, // Adjust based on expected output length for quizzes/notes
        };

        const result = await geminiModel.generateContent(instruction, generationConfig);
        const response = await result.response;
        resultText = response.text();

        if (!resultText) {
            console.error(`No generated text from Gemini for ${type}.`);
            return res.status(500).json({ message: `Failed to generate ${type}: Empty response received from Gemini.` });
        }

        // Return the generated text
        return res.json({ result: resultText });

    } catch (err) {
        console.error('Error generating content with Gemini API:', err);

        let errorMessage = 'Failed to generate content via Google Gemini API.';
        // Attempt to extract more specific error messages from Gemini API response if available
        if (err.message && err.message.includes('API key not valid')) {
            errorMessage = 'Authentication failed: Invalid or missing Gemini API Key.';
            return res.status(401).json({ message: errorMessage });
        }
        if (err.message && err.message.includes('quota')) {
            errorMessage = 'Quota exceeded: You have reached your Gemini API usage limit. Please try again later.';
            return res.status(429).json({ message: errorMessage });
        }
        if (err.message) {
            errorMessage = `Gemini API Error: ${err.message}`;
        }

        return res.status(500).json({ message: errorMessage });
    }
};

module.exports = { generateContent };