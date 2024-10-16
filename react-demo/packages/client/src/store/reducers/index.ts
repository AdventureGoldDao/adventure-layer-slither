
import {
  DOWN,
  INCREASE_SNAKE,
  INCREMENT_SCORE,
  ISnakeCoord,
  LEFT,
  RESET,
  RESET_SCORE,
  RIGHT,
  SET_DIS_DIRECTION,
  UP,
  MAX_SCORE,
  LOCATE_SNAKE,
} from "../actions/index";


export interface IGlobalState {
  snake: ISnakeCoord[] | [];
  disallowedDirection: string;
  score: number;
  maxScore: number;
}

const globalState: IGlobalState = {
  snake: [
    { x: 560, y: 300 },
    { x: 540, y: 300 },
    { x: 520, y: 300 },
  ],
  disallowedDirection: "",
  score: 0,
  maxScore: 0
};
const gameReducer = (state = globalState, action: any) => {
  switch (action.type) {
    case RIGHT:
    case LEFT:
    case UP:
    case DOWN: {
      // let newSnake = [...state.snake];
      let newSnake = [...state.snake];
      newSnake = [{
        x: state.snake[0].x + action.payload[0],
        y: state.snake[0].y + action.payload[1],
      }, ...newSnake];
      newSnake.pop();

      return {
        ...state,
        snake: newSnake,
      };
    }

    case SET_DIS_DIRECTION:
      return { ...state, disallowedDirection: action.payload };

    case RESET:
      return {
        ...state,
        snake: [
          { x: 560, y: 300 },
          { x: 540, y: 300 },
          { x: 520, y: 300 },
        ],
        disallowedDirection: ""
      };

    case LOCATE_SNAKE:
      const px = action.payload[0]
      const py = action.payload[1]
      const ps = action.payload[2]
      if (!ps) { return state }
      let newSnake: any[] = [
        { x: px, y: py },
      ]
      if (ps == 1) {
        newSnake = [
          ...newSnake,
          { x: px, y: py + 20 },
          { x: px, y: py + 40 },
        ]
      } else if (ps == 2) {
        newSnake = [
          ...newSnake,
          { x: px - 20, y: py },
          { x: px - 40, y: py },
        ]
      } else if (ps == 3) {
        newSnake = [
          ...newSnake,
          { x: px, y: py - 20 },
          { x: px, y: py - 40 },
        ]
      } else if (ps == 4) {
        newSnake = [
          ...newSnake,
          { x: px + 20, y: py },
          { x: px + 40, y: py },
        ]
      }

      return {
        ...state,
        snake: newSnake,
        disallowedDirection: state.disallowedDirection,
      };

    case INCREASE_SNAKE:
      const snakeLen = state.snake.length;
      return {
        ...state,
        snake: [
          ...state.snake,
          {
            x: state.snake[snakeLen - 1].x - 20,
            y: state.snake[snakeLen - 1].y - 20,
          },
        ],
      };
    case RESET_SCORE:
      return { ...state, score: 0 };

    case INCREMENT_SCORE:
      return {
        ...state,
        score: state.score + 1,
      };
    case MAX_SCORE:
      return { ...state, maxScore: action.payload };
    default:
      return state;
  }
};

export default gameReducer;
