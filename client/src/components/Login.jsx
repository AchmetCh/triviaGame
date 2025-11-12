import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Api from '../Api';

const Login = ({highScores, setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${Api}/register`, { name }, 
        {
          headers: {
            'Content-Type': 'application/json'
            },
            }
      );
      localStorage.setItem('token', response.data.token);
      console.log( response.data );
      setIsLoggedIn(true);
      navigate("/game");
    } catch (error) {
      setError(error.message);
  };
  }

  return (
    <div className="login-container">
    <div className="start">
      <h3>Enter your Name & Let's play</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          className="startInput"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button className='startButton' type="submit">Play</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <div className="highScoresLogin">
        <h2> High Scores</h2>
        <ol type="1">
          {highScores.map((score, index) => (
            <li key={index} className="list">
              <p>
                <span>{score.name}</span> <span>{score.score}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
    </div>
  );
};

export default Login;