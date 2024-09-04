# Who Wants to Be a MERN Stacker? 🎉

==========================================================================

#### Welcome to Who Wants to Be a MERN Stacker?, an exciting trivia game inspired by the classic "Who Wants to Be a Millionaire?" game show, but with a tech twist! This game is designed for developers and tech enthusiasts who want to test and improve their knowledge of HTML, CSS, JavaScript, and the MERN stack (MongoDB, Express.js, React, and Node.js).

### Features

- Dynamic Question Generation: Questions are dynamically generated using ChatGPT, covering a wide range of topics including HTML, CSS, JavaScript, and the entire MERN stack.
- Interactive Gameplay: Enjoy a quiz format that mimics the "Who Wants to Be a Millionaire?" experience, complete with multiple-choice questions and escalating difficulty.
- Real-time Feedback: Get instant feedback on your answers, helping you learn and improve as you play.
- Engaging UI/UX: A clean and responsive user interface designed to make learning fun and engaging.

### Technologies Used

- MERN Stack: The game is built using MongoDB, Express.js, React, and Node.js.
- ChatGPT Integration: Leverages OpenAI's ChatGPT to generate and diversify trivia questions.

### How to Play

- Enter Your Name: Simply input your name to start the game.
- Answer Questions: You'll be presented with multiple-choice questions on various topics related to web development.
- Score Points: The remaining time for each question is added to your score, so answer quickly!
- Beat the High Score: Answer as many questions as you can and try to beat the high score to become the ultimate MERN Stack master!

## Technologies Used

- **Frontend**: React, React-Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Styling**: CSS
- **Hosting**: (e.g., Render, Heroku, Netlify, etc.)

## Installation

### Prerequisites

- Node.js (>= 12.x)
- MongoDB

### Setup

1. Clone the repository:

```bash
git clone https://github.com/AchmetCh/triviaGame.git
cd trivia
```

2. Install server dependencies:

```bash
cd backend
npm install
```

3. Install client dependencies

```bash
cd ../client
npm install
```

## Create a .env file in the backend directory and add the following:

```
MONGDODB_URI=your_mongodb_connection_string
OPENAI_API_KEY= your_openAI_APIKEY
PRIVATE_KEY=your_jwt_secret
```

## Usage

### Running the App

1. Start the backend server:

```
cd backend
npm start
```

2. Start the frontend development server:

```
cd client
npm start
```

3. Open your browser and navigate to http://localhost:8000.

- Frontend: You can deploy the frontend to platforms like Netlify or Vercel.
- Backend: Deploy the backend to platforms like Render or Heroku.
- Make sure to update the environment variables in your deployment environment.

## Contributing

Contributions are welcome! Please follow these steps:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-branch).
- Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact

Developed by Achmet Chasankil.

Feel free to contact me at:

- Email: gigsakos@gmail.com
- Linkedin: [Achmet Chasankil](https://www.linkedin.com/in/achmet-ch/)
