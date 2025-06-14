import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [playerPos, setPlayerPos] = useState(1); // 0: left, 1: center, 2: right
  const [obstaclePos, setObstaclePos] = useState({ lane: 1, top: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Move player with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && playerPos > 0) {
        setPlayerPos((pos) => pos - 1);
      } else if (e.key === "ArrowRight" && playerPos < 2) {
        setPlayerPos((pos) => pos + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPos]);

  // Drop obstacle
  useEffect(() => {
    if (gameOver) return;
    const fall = setInterval(() => {
      setObstaclePos((pos) => {
        if (pos.top >= 90) {
          if (pos.lane === playerPos) {
            setGameOver(true);
          }
          return { lane: Math.floor(Math.random() * 3), top: 0 };
        }
        return { ...pos, top: pos.top + 5 };
      });
    }, 100);
    return () => clearInterval(fall);
  }, [playerPos, gameOver]);

  // Score updater
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setScore((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  // Reset Game
  const resetGame = () => {
    setPlayerPos(1);
    setObstaclePos({ lane: 1, top: 0 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <>
      <div className="game">
        <h1>Emoji Escape</h1>
        <p>Use ← → keys to move</p>
        <div className="board">
          {[0, 1, 2].map((lane) => (
            <div className="lane" key={lane}>
              {obstaclePos.lane === lane && (
                <div
                  className="obstacle"
                  style={{ top: `${obstaclePos.top}%` }}
                >
                  💣
                </div>
              )}
              {playerPos === lane && (
                <div className="player">{gameOver ? "💀" : "😎"}</div>
              )}
            </div>
          ))}
        </div>
        <h2>Score: {score}</h2>
        {gameOver && (
          <>
            <h2 className="over">Game Over!</h2>
            <button onClick={resetGame} className="restart-btn">
              Restart
            </button>
          </>
        )}
      </div>
      <p style={{ marginTop: 40, textAlign: "center" }}>
        Made by <a href="https://linktr.ee/chiozoadiro">Chiozoadiro</a>
      </p>
    </>
  );
};

export default App;
