import { Dispatch, SetStateAction } from "react";

import GameState, { Position } from "./GameState";
import GameCanvas from "./GameCanvas";
import Leaderboard from "../leaderboard/Leaderboard";
import GameCode from "../gameCode/GameCode";

/**
 * An interface representing data passed to the HTML element responsible for
 * rendering the Slither+ game
 */
interface GameProps {
  /** A metadata representation of the current state of the game */
  gameState: GameState;
  /** A function that sets the current state of the game */
  setGameState: Dispatch<SetStateAction<GameState>>;
  /** A map from each user, as a string, to their score */
  scores: Map<string, number>;
  /** The game code of the game current being played */
  gameCode: string;
  /** A function that sets whether the game has started */
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  /** A function that sets the current leaderboard (set of scores) for the game */
  setScores: Dispatch<SetStateAction<Map<string, number>>>;
}

/**
 * Returns an HTML element that renders the Slither+ game, which includes the
 * game canvas, which renders map, snakes, and orbs, as well as the leaderboard
 * with each user's score and the game code of the current lobby.
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param scores A map from each user, as a string, to their score
 * @param gameCode The game code of the game current being played
 * @param setGameStarted
 * @param setScores
 * @returns the rendered representation of the client's current Slither+ game
 */
export default function Game({
  gameState,
  setGameState,
  scores,
  gameCode,
  setGameStarted,
  setScores,
}: GameProps) {
  return (
    <div>
      <GameCanvas
        gameState={gameState}
        setGameState={setGameState}
        setGameStarted={setGameStarted}
        setScores={setScores}
      />
      <Leaderboard leaderboard={scores} />
      <GameCode gameCode={gameCode} />
    </div>
  );
}
