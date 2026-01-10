import "../App.css";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useSound from "use-sound";
import play from "../sounds/wait.mp3";
import correct from "../sounds/correct.mp3";
import wrong from "../sounds/wrong.mp3";
import api from "../Api";

const Trivia = ({ highScores, setHighscores, setIsLoggedIn }) => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timeout, setTimeoutState] = useState(false);

  const [letsPlay, { stop: stopLetsPlay }] = useSound(play);
  const [wrongSound] = useSound(wrong);
  const [itsCorrect] = useSound(correct);

  const userName = localStorage.getItem("token");
  const navigate = useNavigate();

  // ------------------------------ FETCH QUESTIONS ------------------------------
  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get(`${api}/generate-questions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      setData(response.data.questionData);
      setTimer(30); // reset timer for each new question
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ------------------------------ FETCH HIGHSCORES ------------------------------
  const fetchHighscores = useCallback(async () => {
    try {
      const response = await axios.get(`${api}/high-scores`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setHighscores(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [setHighscores]);

  // ------------------------------ DELETE USERS ------------------------------
  const deleteUsers = async () => {
    try {
      await axios.delete(`${api}/deleteUsers`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ------------------------------ TIMER EFFECT ------------------------------
  useEffect(() => {
    if (timer === 0) {
      setTimeoutState(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ------------------------------ LOAD INITIAL DATA ------------------------------
  useEffect(() => {
    fetchQuestions();
    fetchHighscores();
  }, [fetchQuestions, fetchHighscores]);

  // ------------------------------ END GAME ------------------------------
  const endGame = useCallback(async () => {
    wrongSound();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${api}/update-score`,
        {
          name: userName,
          score: score,
        },
        { headers: { Authorization: token } }
      );

      stopLetsPlay();
      localStorage.removeItem("token");
      deleteUsers();

      toast.loading(response.data.message, { duration: 2000 });

      setIsLoggedIn(false);

      navigate("/");
      window.location.reload();

      setHighscores((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error in endGame function:", error);
    }
  }, [score, userName, stopLetsPlay, setIsLoggedIn, setHighscores]);

  // ------------------------------ TIMEOUT END GAME ------------------------------
  useEffect(() => {
    if (timeout) endGame();
  }, [timeout, endGame]);

  // ------------------------------ ANSWER CLICK ------------------------------
  const handleClick = (correctAnswer) => {
    if (correctAnswer) {
      setScore((prev) => prev + timer);
      itsCorrect();
      toast.success("Correct!");
      fetchQuestions();
    } else {
      endGame();
    }
  };

  // ------------------------------ JSX ------------------------------
  return (
    <div className="app" onMouseOver={() => letsPlay()}>
      <div className="highScores">
        <h2> High Scores</h2>
        <ol type="1">
          {highScores.map((score, index) => (
            <li key={index} className="list">
              <p>
                <span>{score.name}</span>
                <span>{score.score}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="main">
        <div className="questionanswers">
          <div className="titleName">
            <h1>Ποιος θέλει να γίνει εκατομμυριούχος</h1>
            <h1>Όνομα: {userName}</h1>
          </div>

          <div className="gameQuestions">
            <div className="timer">{timer}</div>
            <div className="question">{data?.question}</div>
            <div className="answers">
              {data.answers?.map((ans) => (
                <button
                  key={ans.text}
                  className="answer"
                  style={{ color: "white" }}
                  onClick={() => handleClick(ans.correct)}
                >
                  {ans.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pyramid">
        <div className="score">Score: {score}</div>
        <button className="startButton" onClick={endGame}>
          End Game
        </button>
        <p className="version">v.0.01</p>
      </div>

      <Toaster />
    </div>
  );
};

export default Trivia;
