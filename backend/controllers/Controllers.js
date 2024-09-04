const User = require("../models/user");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateQuestion = async (req, res) => {
  try {
    const topics = ["MERN stack", "JavaScript", "HTML", "CSS"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a creative and diverse trivia question generator about ${topic}.`,
        },
        {
          role: "user",
          content: `Generate a unique trivia question with four multiple choice answers about ${topic} that hasn't been generated before. 
                    Vary the topics and difficulty. Return the output in the following JSON format:
                    {
                      "question": "Your question here?",
                      "answers": [
                        { "text": "Option 1", "correct": true/false },
                        { "text": "Option 2", "correct": true/false },
                        { "text": "Option 3", "correct": true/false },
                        { "text": "Option 4", "correct": true/false }
                      ]
                    }`,
        },
      ],
      max_tokens: 150,
      temperature: 0.9, // Increased to encourage diversity
    });

    const questionData = JSON.parse(response.choices[0].message.content.trim());

    // Check if the question was generated before
    // const isDuplicate = checkIfDuplicate(questionData); // Implement this function to track duplicates
    // if (isDuplicate) {
    //   // If duplicate, recursively call or handle
    //   // Or log and skip, depending on your logic
    // }

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
    const highScores = await User.find().sort({ score: -1 }).limit(10);

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
    const highScores = await User.find().sort({ score: -1 }).limit(10);
    res.json(highScores);
  } catch (error) {
    console.error("Error getting high scores:", error);
    res.status(500).json({ error: error.message });
  }
};
