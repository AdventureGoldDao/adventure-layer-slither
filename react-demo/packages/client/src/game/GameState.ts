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

/**
 * An interface representing the state of the client's game
 */
export default interface GameState {
  /** A metadata representation of the client's snake */
  snake: SnakeData;
  /** A metadata representation of all current in-game orbs */
  orbs: Set<OrbData>;
  /** A map of each user to their score */
  scores: Map<String, Number>;
  /** The game code of the current lobby being played */
  gameCode: String;
}

/**
 * Extracts and returns a map of users to their scores, from a server
 * websocket message
 * @param leaderboardData a list of leaderboard entries, from a server websocket message
 * @returns a map of users to their scores
 */
export function extractLeaderboardMap(leaderboardData: leaderboardEntry[]) {
  const leaderboard: Map<string, number> = new Map<string, number>();
  leaderboardData.forEach((entry: leaderboardEntry) => {
    leaderboard.set(entry.username, entry.score);
  });
  return leaderboard;
}
