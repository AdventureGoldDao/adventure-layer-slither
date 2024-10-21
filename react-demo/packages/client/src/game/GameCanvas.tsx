import {Dispatch, SetStateAction, useEffect} from "react";

import GameState, {extractLeaderboardMap, leaderboardEntry, Position} from "./GameState";
import Snake, {SNAKE_VELOCITY, SnakeData} from "./snake/Snake";
import Orb, {OrbData} from "./orb/Orb";
import Border from "./boundary/Boundary";
import {useMUD} from "../MUDContext";

/**
 * The size of the map. The map is rendered centered on the origin, so
 * the map ranges from -x/2 to x/2 horiziontally, and -y/2 to y/2 vertically
 */
const canvasSize: Position = {x: 3000, y: 3000};
/** The current position of the client's mouse on the screen */
const mousePos: Position = {x: 0, y: 0};
/**
 * The offset from the coordinates of the client's snake's head to the
 * middle of the window
 */
const offset: Position = {x: 0, y: 0};
// let lastUpdatedPosition: Position = { x: 0, y: 0 };
// let lastUpdatedTime: number = new Date().getTime();

/**
 * An interface representing data passed to the HTML element responsible for
 * rendering the Slither+ game map
 */
interface GameCanvasProps {
  /** A metadata representation of the current state of the game */
  gameState: GameState;
  /** A function that sets the current state of the game */
  setGameState: Dispatch<SetStateAction<GameState>>;
  /** A function that sets whether the game has started */
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  /** A function that sets the current leaderboard (set of scores) for the game */
  setScores: Dispatch<SetStateAction<Map<string, number>>>;
}

/**
 * Returns an HTML element that renders the Slither+ game map, which includes
 * your snake, whose head is always at the screen's center, all other snakes in
 * the game, all existing orbs, and the map border.
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param user The username of the client
 * @param setGameStarted
 * @returns a rendered representation of the current game map for the client
 */
export default function GameCanvas({
                                     gameState,
                                     setGameState,
                                     setGameStarted,
                                     setScores,
                                   }: GameCanvasProps): JSX.Element {
  const {
    systemCalls: {
      moveSnake, endGame, getOrbData, getLeaderboardData
    },
  } = useMUD();

  const onMouseMove = (e: MouseEvent) => {
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
  };

  const updatePositions = () => {
    let newGameState: GameState = {...gameState};
    setGameState(moveSnakeTick(newGameState));
  };

  useEffect(() => {
    // updates position of the client's snake every 50 ms
    const interval = setInterval(updatePositions, 50);
    // updates mouse position when moved, determines target direction for snake
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      // clean up upon closing
      clearInterval(interval);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // calculate offset to center snake on screen and place other objects relative to snake
  const front: Position | undefined = gameState.snake.snakeBody.peekFront();
  if (front !== undefined) {
    offset.x = window.innerWidth / 2 - front.x;
    offset.y = window.innerHeight / 2 - front.y;
  }

  let list: Position[] = [];
  /**
   * Changes the given snake's velocity to follow the mouse's position,
   * and sends the new position to the Slither+ server
   * @returns the newly updated metadata for the client's snake
   * @param gameState
   */
  const moveSnakeTick = (gameState: GameState): GameState => {
    // remove last position from the end (to simulate movement)
    gameState.snake.snakeBody.pop();
    const front: Position | undefined = gameState.snake.snakeBody.peekFront();
    if (front !== undefined) {
      const accel_angle: number = Math.atan2(
        // find the angle of acceleration based on your current position and the mouse position
        mousePos.y - offset.y - front.y,
        mousePos.x - offset.x - front.x
      );
      let vel_angle: number = Math.atan2(gameState.snake.velocityY, gameState.snake.velocityX);
      const angle_diff = mod(accel_angle - vel_angle, 2 * Math.PI);
      // changes the angle of velocity to move towards the mouse position
      vel_angle += angle_diff < Math.PI ? 0.1 : -0.1;

      // calculate new velocity
      gameState.snake.velocityX = SNAKE_VELOCITY * Math.cos(vel_angle);
      gameState.snake.velocityY = SNAKE_VELOCITY * Math.sin(vel_angle);

      // find new position of head based on velocity
      const newPosition: Position = {
        x: front.x + gameState.snake.velocityX,
        y: front.y + gameState.snake.velocityY,
      };

      gameState.snake.snakeBody.unshift({x: newPosition.x, y: newPosition.y});
      list.push({x: Math.round(newPosition.x * 100), y: Math.round(newPosition.y * 100)});

      if (list.length > 6) {
        moveSnake(list).then((res: { status: number; add: Position[]; }) => {
          if (res.status == 2) {
            endGame();
            setGameStarted(false);
          } else {
            if (res.add.length > 0) {
              res.add.forEach((bodyPart: Position) => {
                gameState.snake.snakeBody.push({x: bodyPart.x / 100.0, y: bodyPart.y / 100.0});
              });
              getOrbData().then((orbs: Set<OrbData>) => {
                gameState.orbs = orbs;
              })
              getLeaderboardData().then((sco: leaderboardEntry[]) => {
                gameState.scores = extractLeaderboardMap(sco);
              })
            }
          }
        })
        list = [];
      }
    }
    return gameState;
  }

  return (
    <div>
      <Snake snake={gameState.snake} offset={offset} />
      {Array.from(gameState.orbs).map((orb: OrbData, ind: number) => (
        <Orb orbInfo={orb} offset={offset} key={ind} />
      ))}
      <Border boundaries={canvasSize} offset={offset} />
    </div>
  );
}

/**
 * Takes the modulo of the first argument by the second argument (n % m)
 * @param n the number whose modulo is being calculated
 * @param m the modulus of the operation
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
