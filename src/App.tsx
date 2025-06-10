import React, { useState } from 'react';
import './styles.css';
import RPLogo from '/src/assets/RPLogo2.png';

export default function App() {
  const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;
  const [target, setTarget] = useState<number>(getRandomNumber());
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const sendData = (data: any) => {
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab(data);
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('Please enter a valid number between 1 and 100.');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let feedback = '';
    if (num > target) {
      feedback = 'Too high!';
    } else if (num < target) {
      feedback = 'Too low!';
    } else {
      feedback = `Correct! You guessed it in ${newAttempts} attempt${newAttempts > 1 ? 's' : ''}.`;
      setIsCorrect(true);
    }

    setMessage(feedback);
    sendData({ event: 'guess', guess: num, feedback, attempts: newAttempts });
    setGuess('');
  };

  const handleReset = () => {
    const newTarget = getRandomNumber();
    setTarget(newTarget);
    setGuess('');
    setMessage('');
    setAttempts(0);
    setIsCorrect(false);
    sendData({ event: 'reset' });
  };

  return (
    <div className="App">
      <img src={RPLogo} alt="RP Logo" className="logo" />
      <h1>Number Guessing Game</h1>
      <p>I'm thinking of a number between 1 and 100.</p>
      <form onSubmit={handleGuess}>
        <input
          type="number"
          min="1"
          max="100"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
          disabled={isCorrect}
        />
        <button type="submit" disabled={isCorrect}>
          Guess
        </button>
      </form>
      {isCorrect && (
        <button className="reset-button" onClick={handleReset}>
          Play Again
        </button>
      )}
      {message && <p className="message">{message}</p>}
      {!isCorrect && <p className="attempts">Attempts: {attempts}</p>}
    </div>
  );
}