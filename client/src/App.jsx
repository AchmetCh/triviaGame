import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from './Api'
import Trivia from "./components/Trivia";
import Login from "./components/Login";
import HighScores from "./components/HighScores";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [highScores, setHighscores] = useState([]);
  
  useEffect(() => {
    const fetchHighscores = async () => {
      try {
        const response = await axios.get(`${api}/high-scores`);
        // validate backend response: it should be an array of scores
        if (Array.isArray(response.data)) {
          setHighscores(response.data);
        } else {
          console.error("Unexpected /high-scores response (expected array):", response.data);
          // keep default [] to avoid rendering errors in production
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchHighscores();
  }, [setHighscores]);
  return (
    <>
      <Router>
        <div className="App">
          {isLoggedIn ? (
            <>
              <Routes>
                <Route
                  path="/game"
                  element={
                    <Trivia
                      highScores={highScores}
                      setHighscores={setHighscores}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  }
                />
                <Route
                  path="/endgame"
                  element={<HighScores highScores={highScores} />}
                />
                <Route path="*" element={<Navigate to="/game" />} />
              </Routes>
            </>
          ) : (
            <>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Login
                      highScores={highScores}
                      setIsLoggedIn={setIsLoggedIn}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </>
  );
}

export default App;

