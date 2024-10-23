import { OrbData } from "./orb/Orb";
import { SnakeData } from "./snake/Snake";

/**
 * An interface representing a position on the Slither+ game map
 */
export interface Position {
  /** The x-coordinate of the position (horizontally) */
  x: number;
  /** The y-coordinate of the position (vertically) */
  y: number;
}

export interface leaderboardEntry {
  /** A client's username */
  username: string;
  /** The respective client's score */
  score: number;
}

export interface moveUpData {
  status: number;
  score: number;
  orbs: Set<OrbData>;
}

/**
 * An interface representing the state of the client's game
 */
export default interface GameState {
  /** A metadata representation of the client's snake */
  snake: SnakeData;
  /** A metadata representation of all current in-game orbs */
  orbs: Set<OrbData>;
}

