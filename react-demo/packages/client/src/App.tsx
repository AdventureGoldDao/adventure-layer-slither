import Denque from "denque";
import { useState } from "react";

import "./App.css";
import GameState, {Position} from "./game/GameState";
import Game from "./game/Game";
import { OrbData } from "./game/orb/Orb";
import { SnakeData, SNAKE_VELOCITY } from "./game/snake/Snake";
import Home from "./home/Home";
/**
 * Creates and returns the overarching HTML element representing the Slither+
 * app at any given moment, appropriately either the home or in-game screen
 * @returns the overarching HTML SLither+ app element
 */
export default function App(): JSX.Element {

  const [accountSetup, setAccountSetup] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const orbSet = new Set<OrbData>();

  // initial snake
  const snakeBody: Position[] = [];
  for (let i = 0; i < 20; i++) {
    snakeBody.push({ x: 600, y: 100 + 5 * i });
  }
  const snake: SnakeData = {
    snakeBody: new Denque(snakeBody),
    velocityX: 0,
    velocityY: SNAKE_VELOCITY,
  };

  const [gameState, setGameState] = useState<GameState>({
    snake: snake,
    orbs: orbSet,
  });

  return (
    <div className="App">
      {gameStarted ? (
        <Game
          gameState={gameState}
          setGameState={setGameState}
          setGameStarted={setGameStarted}
        />
      ) : (
        <Home
          setGameStarted={setGameStarted}
          gameState={gameState}
          setGameState={setGameState}
          accountSetup={accountSetup}
          setAccountSetup={setAccountSetup}
        />
      )}
    </div>
  );
}

