import Denque from "denque";
import "./Snake.css";
import { Position } from "../GameState";

/** A metadata representation of a snake */
export interface SnakeData {
  /**
   * A collection of positions, specifying the locations of the
   * circles making up the snake's body
   */
  snakeBody: Denque<Position>;
  /** The velocity of the snake in the horizontal direction */
  velocityX: number;
  /** The velocity of the snake in the vertical direction */
  velocityY: number;
}

/** The constant velocity at which a snake moves */
export const SNAKE_VELOCITY = 8;

/**
 * Renders the given snake, represented by its metadata, on screen at the
 * given position offset; a snake is rendered as a consecutive collection of circles
 * @param snake a metadata representation of a snake
 * @param offset the offset at which the snake is to be rendered
 * @returns a HTML element rendering the given snake
 */
export default function Snake({
  snake,
  offset,
  mousePos,
}: {
  snake: SnakeData;
  offset: Position;
  mousePos: Position;
}): JSX.Element {
  const snakeList = snake.snakeBody.toArray()

  const head = snakeList[0];
  const neck = snakeList[1]; // 用第二个部位来计算朝向

  let direction = "right";
  if (neck) {
    const dx = head.x - neck.x;
    const dy = head.y - neck.y;
    if (dx > 0) direction = "right";
    if (dx < 0) direction = "left";
    if (dy > 0) direction = "down";
    if (dy < 0) direction = "up";
  }

  const angle = Math.atan2(
    mousePos.y - (head.y + offset.y),
    mousePos.x - (head.x + offset.x)
  );
  return (
    <div>
      {
        snakeList.slice()
        .reverse()
        .map((bodyPart: Position, ind: number) => {
        if (ind === snakeList.length - 1) {
          return (
            <div
              className={`snake-head`}
              key={ind}
              style={{
                left: bodyPart.x + offset.x,
                top: bodyPart.y + offset.y,
              }}
            >
              <div
                className="snake-head-inner"
                style={{ transform: `rotate(${angle}rad)` }}
              >
                {/* <div className="center-dot"></div> */}
                <div className="eye eye-left"></div>
                <div className="eye eye-right"></div>
              </div>
            </div>
          );
        }
        const bodyClass = ind % 2 === 0 ? "snake light" : "snake dark";
        return (
          <div
            // className="snake"
            className={bodyClass}
            key={ind}
            style={{ left: bodyPart.x + offset.x, top: bodyPart.y + offset.y }}
          />
        );
      })}
    </div>
  );
}
