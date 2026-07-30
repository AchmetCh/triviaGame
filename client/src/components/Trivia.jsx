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

const ANSWER_LABELS = ["Α", "Β", "Γ", "Δ"];

const Trivia = ({ highScores, setHighscores, setIsLoggedIn }) => {
  const [data, setData] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [timeout, setTimeoutState] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerState, setAnswerState] = useState(null); // 'correct' | 'wrong' | null
  const [isLocked, setIsLocked] = useState(false);

  const [letsPlay, { stop: stopLetsPlay }] = useSound(play);
  const [wrongSound] = useSound(wrong);
  const [itsCorrect] = useSound(correct);

  const userName = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await axios.get(`${api}/generate-questions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: encodeURIComponent(localStorage.getItem("token") || ""),
        },
      });
      setData(response.data.questionData);
      setTimer(30);
      setSelectedAnswer(null);
      setAnswerState(null);
      setIsLocked(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchHighscores = useCallback(async () => {
    try {
      const response = await axios.get(`${api}/high-scores`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setHighscores(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [setHighscores]);

  const deleteUsers = async () => {
    try {
      await axios.delete(`${api}/deleteUsers`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (timer === 0) {
      setTimeoutState(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    fetchQuestions();
    fetchHighscores();
  }, [fetchQuestions, fetchHighscores]);

  const endGame = useCallback(async () => {
    wrongSound();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${api}/update-score`,
        { name: userName, score },
        { headers: { Authorization: encodeURIComponent(token || "") } }
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

  useEffect(() => {
    if (timeout) endGame();
  }, [timeout, endGame]);

  const handleClick = (correctAnswer, index) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedAnswer(index);

    if (correctAnswer) {
      setAnswerState("correct");
      itsCorrect();
      toast.success("Σωστό!", {
        style: { background: "#1a1a2e", color: "#f0c040", border: "1px solid #f0c040" },
        iconTheme: { primary: "#f0c040", secondary: "#1a1a2e" },
      });
      setTimeout(() => {
        setScore((prev) => prev + timer);
        fetchQuestions();
      }, 1200);
    } else {
      setAnswerState("wrong");
      setTimeout(() => endGame(), 1200);
    }
  };

  const timerPct = (timer / 30) * 100;
  const timerColor = timer > 15 ? "#f0c040" : timer > 8 ? "#e88c30" : "#e84040";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Barlow:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tv-root {
          min-height: 100vh;
          background: #07071a;
          background-image:
            radial-gradient(ellipse at 50% 0%, rgba(100, 60, 180, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 100% 100%, rgba(30, 10, 80, 0.3) 0%, transparent 50%);
          display: grid;
          grid-template-columns: 260px 1fr 220px;
          grid-template-rows: auto 1fr auto;
          gap: 0;
          font-family: 'Barlow', sans-serif;
          color: #e8e0f0;
          overflow: hidden;
        }

        /* ---- HEADER ---- */
        .tv-header {
          grid-column: 1 / -1;
          text-align: center;
          padding: 1.5rem 2rem 1rem;
          border-bottom: 1px solid rgba(240,192,64,0.15);
          position: relative;
        }
        .tv-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f0c040, transparent);
        }
        .tv-show-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.7rem);
          font-weight: 900;
          letter-spacing: 0.12em;
          color: #f0c040;
          text-shadow: 0 0 40px rgba(240,192,64,0.5);
          text-transform: uppercase;
        }
        .tv-player-name {
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.2em;
          color: rgba(240,192,64,0.6);
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* ---- SIDEBAR LEFT: HIGHSCORES ---- */
        .tv-sidebar-left {
          grid-column: 1;
          padding: 1.5rem 1.2rem;
          border-right: 1px solid rgba(240,192,64,0.08);
          overflow-y: auto;
        }
        .sidebar-title {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          color: rgba(240,192,64,0.7);
          text-transform: uppercase;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(240,192,64,0.15);
        }
        .score-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .score-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(240,192,64,0.07);
          transition: background 0.2s;
        }
        .score-item:hover { background: rgba(240,192,64,0.06); }
        .score-rank {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          color: rgba(240,192,64,0.5);
          min-width: 18px;
        }
        .score-name { flex: 1; font-size: 0.78rem; font-weight: 500; color: #c8c0d8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .score-pts { font-family: 'Cinzel', serif; font-size: 0.75rem; color: #f0c040; }

        /* ---- MAIN AREA ---- */
        .tv-main {
          grid-column: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 2rem;
        }

        /* ---- TIMER ---- */
        .timer-wrap {
          position: relative;
          width: 80px; height: 80px;
        }
        .timer-svg { transform: rotate(-90deg); }
        .timer-bg { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 5; }
        .timer-arc {
          fill: none;
          stroke-width: 5;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.9s linear, stroke 0.5s;
        }
        .timer-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          font-weight: 600;
        }

        /* ---- QUESTION CARD ---- */
        .question-card {
          width: 100%;
          max-width: 680px;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(240,192,64,0.2);
          border-radius: 16px;
          padding: 2rem 2.5rem;
          text-align: center;
          position: relative;
          box-shadow: 0 0 60px rgba(240,192,64,0.05), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .question-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(240,192,64,0.3), transparent 50%, rgba(240,192,64,0.1));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: destination-out;
          pointer-events: none;
          padding: 1px;
        }
        .question-text {
          font-family: 'Barlow', sans-serif;
          font-size: clamp(1rem, 2vw, 1.3rem);
          font-weight: 500;
          line-height: 1.55;
          color: #f0ece8;
          letter-spacing: 0.01em;
        }

        /* ---- ANSWERS GRID ---- */
        .answers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          width: 100%;
          max-width: 680px;
        }
        .answer-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(240,192,64,0.18);
          border-radius: 10px;
          color: #e8e0f0;
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s, border-color 0.18s, transform 0.12s, box-shadow 0.18s;
          position: relative;
          overflow: hidden;
        }
        .answer-btn:not(:disabled):hover {
          background: rgba(240,192,64,0.1);
          border-color: rgba(240,192,64,0.5);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(240,192,64,0.1);
        }
        .answer-btn:not(:disabled):active { transform: scale(0.98); }
        .answer-btn:disabled { cursor: default; }

        .answer-btn.selected-correct {
          background: rgba(60,200,100,0.15);
          border-color: #3cc864;
          box-shadow: 0 0 20px rgba(60,200,100,0.2);
          animation: pulse-green 0.4s ease;
        }
        .answer-btn.selected-wrong {
          background: rgba(232,64,64,0.15);
          border-color: #e84040;
          box-shadow: 0 0 20px rgba(232,64,64,0.2);
          animation: shake 0.4s ease;
        }
        @keyframes pulse-green { 0%,100%{transform:scale(1)} 50%{transform:scale(1.02)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

        .answer-label {
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #f0c040;
          min-width: 20px;
          flex-shrink: 0;
        }
        .answer-text { flex: 1; line-height: 1.4; }

        /* ---- RIGHT SIDEBAR: SCORE ---- */
        .tv-sidebar-right {
          grid-column: 3;
          padding: 1.5rem 1.2rem;
          border-left: 1px solid rgba(240,192,64,0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .score-display {
          text-align: center;
          padding: 1.2rem 1rem;
          background: rgba(240,192,64,0.06);
          border: 1px solid rgba(240,192,64,0.2);
          border-radius: 12px;
          width: 100%;
        }
        .score-label {
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          color: rgba(240,192,64,0.6);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .score-value {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          font-weight: 900;
          color: #f0c040;
          text-shadow: 0 0 20px rgba(240,192,64,0.5);
        }

        .end-btn {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(232,64,64,0.4);
          border-radius: 8px;
          color: rgba(232,100,100,0.8);
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .end-btn:hover {
          background: rgba(232,64,64,0.12);
          border-color: rgba(232,64,64,0.7);
          color: #e87070;
        }

        /* ---- FOOTER ---- */
        .tv-footer {
          grid-column: 1 / -1;
          text-align: center;
          padding: 0.6rem;
          border-top: 1px solid rgba(255,255,255,0.04);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.15);
        }

        /* ---- TOASTER OVERRIDES ---- */
        .tv-root [data-hot-toast] { font-family: 'Barlow', sans-serif; }
      `}</style>

      <div className="tv-root" onMouseOver={() => letsPlay()}>

        {/* HEADER */}
        <header className="tv-header">
          <div className="tv-show-title">Ποιος Θέλει να Γίνει Εκατομμυριούχος</div>
          <div className="tv-player-name">Παίκτης: {userName}</div>
        </header>

        {/* LEFT — HIGH SCORES */}
        <aside className="tv-sidebar-left">
          <div className="sidebar-title">Υψηλές Βαθμολογίες</div>
          <ol className="score-list">
            {highScores.map((s, i) => (
              <li key={i} className="score-item">
                <span className="score-rank">#{i + 1}</span>
                <span className="score-name">{s.name}</span>
                <span className="score-pts">{s.score}</span>
              </li>
            ))}
          </ol>
        </aside>

        {/* MAIN */}
        <main className="tv-main">
          {/* Circular timer */}
          <div className="timer-wrap">
            <svg className="timer-svg" viewBox="0 0 80 80" width="80" height="80">
              <circle className="timer-bg" cx="40" cy="40" r="35" />
              <circle
                className="timer-arc"
                cx="40" cy="40" r="35"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - timerPct / 100)}`}
                stroke={timerColor}
              />
            </svg>
            <div className="timer-text" style={{ color: timerColor }}>{timer}</div>
          </div>

          {/* Question */}
          <div className="question-card">
            <p className="question-text">{data?.question || "Φόρτωση ερώτησης…"}</p>
          </div>

          {/* Answers */}
          <div className="answers-grid">
            {data.answers?.map((ans, i) => {
              let cls = "answer-btn";
              if (selectedAnswer === i) {
                cls += answerState === "correct" ? " selected-correct" : " selected-wrong";
              }
              return (
                <button
                  key={ans.text}
                  className={cls}
                  disabled={isLocked}
                  onClick={() => handleClick(ans.correct, i)}
                >
                  <span className="answer-label">{ANSWER_LABELS[i]}</span>
                  <span className="answer-text">{ans.text}</span>
                </button>
              );
            })}
          </div>
        </main>

        {/* RIGHT — SCORE & CONTROLS */}
        <aside className="tv-sidebar-right">
          <div className="score-display">
            <div className="score-label">Βαθμολογία</div>
            <div className="score-value">{score}</div>
          </div>
          <button className="end-btn" onClick={endGame}>
            Τέλος Παιχνιδιού
          </button>
          <div style={{ marginTop: "auto", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>
            v.0.01
          </div>
        </aside>

        {/* FOOTER */}
        <footer className="tv-footer">WHO WANTS TO BE A MILLIONAIRE · SCIENCE EDITION</footer>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#12122a",
              color: "#f0c040",
              border: "1px solid rgba(240,192,64,0.3)",
              fontFamily: "'Barlow', sans-serif",
              fontSize: "0.9rem",
            },
          }}
        />
      </div>
    </>
  );
};

export default Trivia;