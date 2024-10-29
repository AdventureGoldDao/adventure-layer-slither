import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import GameState, { moveUpData, Position} from "./GameState";
import Snake, {SNAKE_VELOCITY} from "./snake/Snake";
import Orb, {OrbData} from "./orb/Orb";
import Border from "./boundary/Boundary";
import {useMUD} from "../MUDContext";
import Denque from "denque";

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
}

/**
 * Returns an HTML element that renders the Slither+ game map, which includes
 * your snake, whose head is always at the screen's center, all other snakes in
 * the game, all existing orbs, and the map border.
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param setGameStarted
 * @returns a rendered representation of the current game map for the client
 */
export default function GameCanvas({
                                     gameState,
                                     setGameState,
                                     setGameStarted,
                                   }: GameCanvasProps): JSX.Element {


  const {
    components: { Users,OrbLists },
    network: { playerEntity },
    systemCalls: {
      moveSnake, endGame
    },
  } = useMUD();
  const [oldScore, setOldScore] = useState(0);
  const user = useComponentValue(Users,playerEntity);

  const orbList = useEntityQuery([Has(OrbLists)]);
  const onMouseMove = (e: MouseEvent) => {
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
  };

  useEffect(() => {
    // updates mouse position when moved, determines target direction for snake
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      endGame();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [endGame]);

  useEffect(() => {
      // updates position of the client's snake every 50 ms
      const interval = setInterval(moveSnakeTick, 50);
      return () => {
        // clean up upon closing
        clearInterval(interval);
      };
  }, [user.status,user.score,oldScore]);

  // calculate offset to center snake on screen and place other objects relative to snake
  const front: Position | undefined = gameState.snake.snakeBody.peekFront();
  if (front !== undefined) {
    offset.x = window.innerWidth / 2 - front.x;
    offset.y = window.innerHeight / 2 - front.y;
  }

  let moveList: Denque<Position> = new Denque();
  /**
   * Changes the given snake's velocity to follow the mouse's position,
   * and sends the new position to the Slither+ server
   */
  const moveSnakeTick = async () => {
    let newGameState: GameState = {...gameState};
    // remove last position from the end (to simulate movement)
    newGameState.snake.snakeBody.pop();
    const front: Position | undefined = newGameState.snake.snakeBody.peekFront();
    if (front !== undefined) {
      const accel_angle: number = Math.atan2(
        // find the angle of acceleration based on your current position and the mouse position
        mousePos.y - offset.y - front.y,
        mousePos.x - offset.x - front.x
      );
      let vel_angle: number = Math.atan2(newGameState.snake.velocityY, newGameState.snake.velocityX);
      const angle_diff = mod(accel_angle - vel_angle, 2 * Math.PI);
      // changes the angle of velocity to move towards the mouse position
      vel_angle += angle_diff < Math.PI ? 0.1 : -0.1;

      // calculate new velocity
      newGameState.snake.velocityX = SNAKE_VELOCITY * Math.cos(vel_angle);
      newGameState.snake.velocityY = SNAKE_VELOCITY * Math.sin(vel_angle);

      // find new position of head based on velocity
      const newPosition: Position = {
        x: front.x + newGameState.snake.velocityX,
        y: front.y + newGameState.snake.velocityY,
      };
      if (isDie(newPosition, user.status == 1)) {
        return;
      }

      newGameState.snake.snakeBody.unshift({x: newPosition.x, y: newPosition.y});
      moveList.push({x: Math.round(newPosition.x * 100), y: Math.round(newPosition.y * 100)});

      if (moveList.length > 6) {
        const list1  = moveList.splice(0, 6);
        moveSnake(list1);
      }

      const inScore = user.score - oldScore;
      if (inScore > 0) {
        setOldScore(user.score)
        const s : Position[] = newGameState.snake.snakeBody.toArray();
        const last : Position  = s[s.length - 1];
        const secondLast : Position  = s[s.length - 2];
        const xDifference = last.x - secondLast.x;
        const yDifference = last.y - secondLast.y;
        for (let i = 0; i < inScore; i++) {
          const p = { x: last.x - xDifference * i, y: last.y - yDifference * i }
          newGameState.snake.snakeBody.push(p);
        }
      }
    }
    setGameState(newGameState);
  }

  const isDie = (p:Position, die:boolean=false) :boolean => {
    if (die || p.x < -1533 || p.x >= 1533 || p.y < -1533 || p.y >= 1533) {
      const snakeBody: Position[] = [];
      for (let i = 0; i < 20; i++) {
        snakeBody.push({ x: 600, y: 100 + 5 * i });
      }
      gameState.snake.snakeBody = new Denque(snakeBody);
      setGameState(gameState);
      moveList = new Denque();
      setGameStarted(false);
      return true;
    }
    return false;
  }

  return (
    <div>
      <Snake snake={gameState.snake} offset={offset} />
      {orbList.map((entity, ind) => (
        <Orb orbInfo={getComponentValueStrict(OrbLists, entity)} offset={offset} key={ind} />
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
