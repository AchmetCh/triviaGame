import "../App.css";
import { useEffect, useState } from "react";
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
  const [timeout, setTimeOut] = useState(false);
  const [letsPlay, { stop: stopLetsPlay }] = useSound(play);
  const [wrongSound] = useSound(wrong);
  const [itsCorrect] = useSound(correct);

  const userName = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (timer === 0) return setTimeOut(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, setTimeOut]);

  const deleteUsers = async () => {
    try {
      const deleteUsers = await axios.delete(`${api}/deleteUsers`, 
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            },
            });
      console.log(deleteUsers);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${api}/generate-questions`, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
            },
            });
      setData(response.data.questionData);
      console.log(response.data.questionData);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchHighscores = async () => {
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
  };
  useEffect(() => {
    fetchQuestions();
    fetchHighscores();
  }, [setHighscores]);

  const endGame = async () => {
    const token = localStorage.getItem("token");
    console.log(userName, score);
    wrongSound();
    try {
      const response = await axios.post(`${api}/update-score`,
        {
          name: userName,
          score: score,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      stopLetsPlay();
      localStorage.removeItem("token");
      deleteUsers();
      fetchQuestions();
      setIsLoggedIn(false);
      toast.loading(response.data.message, {
        duration: 2000,
      });
      navigate("/");
      window.location.reload();
      console.log("Response from server:", response.data.message);
      setHighscores((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error in endGame function:", error);
    }
  };

  const handleClick = (a) => {
    console.log(a);
    if (a) {
      setScore((prev) => prev + timer);
      itsCorrect();
      toast.success("correct");
      setTimer(30);
      fetchQuestions();
    } else {
      endGame();
      console.log("no");
    }
  };
  useEffect(() => {
    if (timeout === true) return endGame();
    console.log(timeout);
  });
// JSX start
  return (
    <div className="app" onMouseOver={() => letsPlay()}>
      <div className="highScores">
        <h2> High Scores</h2>
        <ol type="1">
          {highScores.map((score, index) => (
            <li key={index} className="list">
              <p>
                <span>{score.name}</span> <spa>{score.score}</spa>
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="main">
        <div className="questionanswers">
          <div className="titleName">
            <h1>Who wants to be a MERN stacker</h1>
            <h1>Player: {userName}</h1>
          </div>

          <div className="gameQuestions">
            <div className="timer">{timer}</div>
            <div className="question">{data?.question}</div>
            <div className="answers">
              {data.answers?.map((ans) => {
                return (
                  <button
                    key={ans.text}
                    className="answer"
                    style={{ color: "white" }}
                    onClick={() => handleClick(ans.correct)}
                  >
                    {ans.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="pyramid">
        <div className="score">Score: {score}</div>
        <div>
          <button className="startButton" onClick={(e) => endGame()}>
            End Game
          </button>
          <p className="version"> v.0.01</p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Trivia;
