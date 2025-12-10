const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1. Import the Google Gen AI SDK
const { GoogleGenAI } = require("@google/genai");

// 2. Initialize the Gemini AI client
// This is correct! The SDK will automatically find the key from 
// the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define the required JSON schema for the output
const triviaQuestionSchema = {
    type: "object",
    properties: {
        question: {
            type: "string",
            description: "The unique trivia question.",
        },
        answers: {
            type: "array",
            description: "A list of four multiple-choice answer options.",
            items: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "The text of the answer option.",
                    },
                    correct: {
                        type: "boolean",
                        description: "True if this is the correct answer, false otherwise.",
                    },
                },
                required: ["text", "correct"],
            },
            minItems: 4,
            maxItems: 4,
        },
    },
    required: ["question", "answers"],
};

exports.generateQuestion = async (req, res) => {
    try {
        // const topics = ["milky way", "ocean", "space", "geography", "science", "sports" , 'aliens', 'galaxies', 'computers', 'mathematics'];
        const topics = ["ιστορία", "γεωγραφία", " προγραμματισμός"," τεχνολογία", "επιστήμη", "αθλητισμός", "μουσική", "κινηματογράφος", "τεχνολογία", "φύση"];
        const topic = topics[Math.floor(Math.random() * topics.length)];

        // 3. Use the generateContent method
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash", // A fast, powerful model, comparable to gpt-3.5-turbo
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            // text: `Δημιούργησε μία **εντελώς μοναδική, πρωτότυπη** και **ποικίλη** ερώτηση για παιδιά γυμνασίου trivia για ${topic}. Να έχει τέσσερις επιλογές απάντησης, με **ακριβώς μία** σωστή. Επέστρεψε την απάντηση σε μορφή JSON με το εξής σχήμα:`,
                            text: 'Δημιούργησε μία **πολύ σύντομη**, μοναδική ερώτηση trivia με ${topic}. Η ερώτηση και οι τέσσερις επιλογές απάντησης πρέπει να είναι **σύντομες και περιεκτικές** (όχι περισσότερες από 10 λέξεις η καθεμία). Να έχει ακριβώς μία σωστή απάντηση. Επέστρεψε την απάντηση σε μορφή JSON με το εξής σχήμα:'
                        },
                    ],
                },
            ],
            config: {
                // 4. Use responseMimeType and responseSchema to ensure JSON output
                responseMimeType: "application/json",
                responseSchema: triviaQuestionSchema,
                temperature: 0.95, // Increased to encourage diversity
            },
        });
        
        // 5. The response content is already a clean JSON string
        // We use JSON.parse() to convert the string output into a JavaScript object.
        const questionData = JSON.parse(response.text.trim());

        // The rest of your logic remains largely the same
        // ... (Duplicate check logic omitted for brevity) ...

        const formattedQuestion = {
            id: Math.floor(Math.random() * 1000),
            question: questionData.question,
            answers: questionData.answers,
        };

        res.json({ questionData: formattedQuestion });
    } catch (error) {
        console.error("Error generating question:", error);
        res
            .status(500)
            .json({ error: "An error occurred while generating the question." });
    }
};

exports.NewUser = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the name already exists
    const user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({ message: "Name already exists" });
    }

    // Create a new user
    const newUser = new User({ name });
    await newUser.save();

    // Use the user's name as a "token"
    const token = newUser.name;

    res.json({ message: "User created successfully", user: newUser, token });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.topTenUsersScore = async (req, res) => {
  try {
    const { name, score } = req.body;

    // Find or create the user
    let user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's score
    user.score = score;
    await user.save();

    // Get the current top 10 high scores
    const highScores = await User.find().sort({ score: -1 }).limit(3);

    // If the user is not in the top 10, remove them
    if (!highScores.some((highScore) => highScore._id.equals(user._id))) {
      await User.findByIdAndDelete(user._id); // Updated method
      return res.status(201).json({ message: "Score is not in the top 10" });
    } else {
      return res
        .status(202)
        .json({ message: `User score is now ${user.score}` });
    }
  } catch (error) {
    console.error("Error updating high scores:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getHighScores = async (req, res) => {
  try {
    const highScores = await User.find().sort({ score: -1 }).limit(3);
    res.json(highScores);
  } catch (error) {
    console.error("Error getting high scores:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUsersNotInTopTen = async (req, res) => {
  try {
    const allUsers = await User.find().sort({ score: -1 });
    const topTenUsers = allUsers.slice(0, 3);
    const usersNotInTopTen = allUsers.filter(user => !topTenUsers.includes(user));

    await Promise.all(usersNotInTopTen.map(user => User.findByIdAndDelete(user._id)));

    res.json(usersNotInTopTen);
  } catch (error) {
    console.error("Error deleting users not in top ten:", error);
    res.status(500).json({ error: error.message });
  }
};
