// import React, { useState } from "react";
// import "../App.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Api from "../Api";

// const Login = ({ highScores, setIsLoggedIn }) => {
//   const [name, setName] = useState("");
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError(null); // clear old errors

//     if (!name.trim()) {
//       setError("Please enter your name.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${Api}/register`,
//         { name },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       localStorage.setItem("token", response.data.token);
//       setIsLoggedIn(true);

//       navigate("/game");
//     } catch (error) {
//       // backend message available?
//       const msg =
//         error.response?.data?.message || "Something went wrong. Try again.";
//       setError(msg);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="start">
//         <h3>Enter your Name & Let's play</h3>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={name}
//             className="startInput"
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Enter your name"
//           />

//           <button className="startButton" type="submit">
//             Play
//           </button>

//           {error && <div style={{ color: "red" }}>{error}</div>}
//         </form>

//         <div className="highScoresLogin">
//           <h2> Top 3 Players</h2>
//           <ol type="1">
//             {highScores.slice(0, 3).map((score, index) => (
//               <li key={index} className="list">
//                 <p>
//                   <span>{score.name}</span> <span>{score.score}</span>
//                 </p>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Api from "../Api";

const MEDALS = ["🥇", "🥈", "🥉"];

const Login = ({ highScores, setIsLoggedIn }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Παρακαλώ εισάγετε το όνομά σας.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${Api}/register`,
        { name },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      navigate("/game");
    } catch (err) {
      const msg = err.response?.data?.message || "Κάτι πήγε στραβά. Δοκιμάστε ξανά.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Barlow:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #07071a;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120, 80, 220, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 90%, rgba(30, 10, 80, 0.35) 0%, transparent 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
          color: #e8e0f0;
          overflow: hidden;
          padding: 2rem;
        }

        /* Subtle spotlight */
        .login-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,192,64,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-card {
          width: 100%;
          max-width: 460px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .login-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---- LOGO AREA ---- */
        .login-logo {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-logo-eyebrow {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          color: rgba(240,192,64,0.5);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .login-logo-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.2rem, 4vw, 1.75rem);
          font-weight: 900;
          color: #f0c040;
          text-shadow: 0 0 40px rgba(240,192,64,0.45), 0 0 80px rgba(240,192,64,0.2);
          line-height: 1.25;
          letter-spacing: 0.06em;
        }
        .login-logo-divider {
          margin: 14px auto 0;
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f0c040, transparent);
        }

        /* ---- FORM PANEL ---- */
        .login-panel {
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(240,192,64,0.18);
          border-radius: 18px;
          padding: 2.2rem 2.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
          position: relative;
          overflow: hidden;
        }
        .login-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,192,64,0.5), transparent);
        }

        .form-label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: rgba(240,192,64,0.65);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .login-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(240,192,64,0.22);
          border-radius: 10px;
          color: #f0ece8;
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          margin-bottom: 1.2rem;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
        .login-input:focus {
          border-color: rgba(240,192,64,0.6);
          background: rgba(240,192,64,0.05);
          box-shadow: 0 0 0 3px rgba(240,192,64,0.08);
        }

        .login-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, rgba(240,192,64,0.18) 0%, rgba(240,192,64,0.08) 100%);
          border: 1px solid rgba(240,192,64,0.45);
          border-radius: 10px;
          color: #f0c040;
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(240,192,64,0.15), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .login-btn:hover:not(:disabled)::before { opacity: 1; }
        .login-btn:hover:not(:disabled) {
          border-color: rgba(240,192,64,0.8);
          box-shadow: 0 0 24px rgba(240,192,64,0.2);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(240,192,64,0.3);
          border-top-color: #f0c040;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-error {
          margin-top: 1rem;
          padding: 10px 14px;
          background: rgba(232,64,64,0.1);
          border: 1px solid rgba(232,64,64,0.3);
          border-radius: 8px;
          color: #e87878;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .error-icon {
          width: 16px; height: 16px;
          border-radius: 50%;
          border: 1.5px solid #e87878;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; flex-shrink: 0;
          color: #e87878;
        }

        /* ---- LEADERBOARD ---- */
        .leaderboard {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(240,192,64,0.1);
          border-radius: 14px;
          padding: 1.4rem 1.8rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .leaderboard.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .leaderboard-title {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: rgba(240,192,64,0.6);
          text-transform: uppercase;
          margin-bottom: 1rem;
          text-align: center;
        }
        .lb-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .lb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }
        .lb-item:first-child { border-color: rgba(240,192,64,0.15); background: rgba(240,192,64,0.04); }
        .lb-medal { font-size: 1rem; min-width: 22px; text-align: center; }
        .lb-name { flex: 1; font-size: 0.88rem; font-weight: 500; color: #d0c8e0; }
        .lb-score {
          font-family: 'Cinzel', serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #f0c040;
        }
        .lb-empty {
          text-align: center;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.2);
          padding: 0.5rem 0;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
        }
      `}</style>

      <div className="login-root">
        <div className={`login-card ${mounted ? "visible" : ""}`}>

          {/* LOGO */}
          <div className="login-logo">
            <div className="login-logo-eyebrow">Καλώς ήρθατε στο</div>
            <div className="login-logo-title">
              Ποιος Θέλει να Γίνει<br />Εκατομμυριούχος
            </div>
            <div className="login-logo-divider" />
          </div>

          {/* FORM */}
          <div className="login-panel">
            <form onSubmit={handleSubmit}>
              <label className="form-label" htmlFor="player-name">
                Όνομα Παίκτη
              </label>
              <input
                id="player-name"
                type="text"
                value={name}
                className="login-input"
                onChange={(e) => setName(e.target.value)}
                placeholder="Εισάγετε το όνομά σας…"
                autoComplete="off"
                autoFocus
                disabled={loading}
              />
              <button className="login-btn" type="submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? "Φόρτωση…" : "Παίξε Τώρα"}
              </button>
              {error && (
                <div className="login-error">
                  <span className="error-icon">!</span>
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* LEADERBOARD */}
          <div className={`leaderboard ${mounted ? "visible" : ""}`}>
            <div className="leaderboard-title">Κορυφαίοι Παίκτες</div>
            <ol className="lb-list">
              {highScores.slice(0, 3).length === 0 ? (
                <li className="lb-empty">Δεν υπάρχουν βαθμολογίες ακόμα</li>
              ) : (
                highScores.slice(0, 3).map((s, i) => (
                  <li key={i} className="lb-item">
                    <span className="lb-medal">{MEDALS[i]}</span>
                    <span className="lb-name">{s.name}</span>
                    <span className="lb-score">{s.score}</span>
                  </li>
                ))
              )}
            </ol>
          </div>

          <div className="login-footer">Who Wants to Be a Millionaire · Greece Edition · v.0.01</div>
        </div>
      </div>
    </>
  );
};

export default Login;