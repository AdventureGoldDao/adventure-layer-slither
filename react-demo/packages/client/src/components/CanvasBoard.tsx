import React, { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,

  useDisclosure,
} from '@chakra-ui/react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useDispatch, useSelector } from "react-redux";
import { useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { useEthers, useLookupAddress } from "@usedapp/core";
import {
  increaseSnake,
  INCREMENT_SCORE,
  makeMove,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,
  MOVE_UP,
  resetGame,
  RESET_SCORE,
  scoreUpdates,
  stopGame,
  locateSnake,
  LOCATE_SNAKE,
  MAX_SCORE, RESET, STOP_GAME, RIGHT, setDisDirection, LEFT, UP, DOWN
} from "../store/actions/index";
import { IGlobalState } from "../store/reducers";
import {
  clearBoard,
  drawObject,
  drawSnakeBody,
  drawFood,
  drawBorder,
  generateRandomPosition,
  hasSnakeCollided,
  IObjectBody,
} from "../utils";
import Instruction from "./Instructions";

const styles: any = {
  'canvas-container': css`
    position: relative;
    display: inline-block;
    padding: 20px;
    background: repeating-linear-gradient(
      90deg,
      black,
      black 10px,
      transparent 10px,
      transparent 20px
    ),
    repeating-linear-gradient(
      180deg,
      black,
      black 10px,
      transparent 10px,
      transparent 20px
    );

    ::before,
    ::after {
      content: "#";
      position: absolute;
      left: 0;
      right: 0;
      height: 16px;
      background-repeat: repeat-x;
      background-image: repeating-linear-gradient(
        90deg,
        white,
        white 8px,
        transparent 8px,
        transparent 16px
      );
    }
  `,
  'border-hash': css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    font-family: monospace;
    color: white;
    white-space: pre;
    text-align: center;
  `,
}

export interface ICanvasBoard {
  height: number;
  width: number;
}
const CanvasBoard = ({ height, width }: ICanvasBoard) => {
  const {
    network : { playerEntity },
    components: { Counter,Position},
    systemCalls: {
      stGame, endGame, move, increment,
    },
  } = useMUD();

  const counter = useComponentValue(Counter, playerEntity);
  const position = useComponentValue(Position, playerEntity);


  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const dispatch = useDispatch();
  const snake1 = useSelector((state: IGlobalState) => state.snake);
  const disallowedDirection = useSelector(
    (state: IGlobalState) => state.disallowedDirection
  );
  dispatch({type: MAX_SCORE, payload: (counter?.maxScore ?? 0)});

  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [pos, setPos] = useState<IObjectBody>(
    generateRandomPosition(width - 20, height - 20)
  );
  const [isConsumed, setIsConsumed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const { account } = useEthers();
  const { ens } = useLookupAddress('');

  const moveSnake = useCallback(
    (dx = 0, dy = 0, ds: string) => {
      if (dx > 0 && dy === 0 && ds !== "RIGHT") {
        dispatch(makeMove(dx, dy, MOVE_RIGHT));
      }

      if (dx < 0 && dy === 0 && ds !== "LEFT") {
        dispatch(makeMove(dx, dy, MOVE_LEFT));
      }

      if (dx === 0 && dy < 0 && ds !== "UP") {
        dispatch(makeMove(dx, dy, MOVE_UP));
      }

      if (dx === 0 && dy > 0 && ds !== "DOWN") {
        dispatch(makeMove(dx, dy, MOVE_DOWN));
      }
    },
    [dispatch]
  );
  let currentKey = "";
  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      if (event.key == currentKey) {
        return
      }
      currentKey = event.key;
      if (disallowedDirection) {
        switch (event.key) {
          case "w":
            move(1);
            moveSnake(0, -20, disallowedDirection);
            break;
          case "s":
            move(3);
            moveSnake(0, 20, disallowedDirection);
            break;
          case "a":
            move(4);
            moveSnake(-20, 0, disallowedDirection);
            break;
          case "d":
            move(2);
            event.preventDefault();
            moveSnake(20, 0, disallowedDirection);
            break;
        }
      } else {
        if (
          disallowedDirection !== "LEFT" &&
          disallowedDirection !== "UP" &&
          disallowedDirection !== "DOWN" &&
          event.key === "d"
        ) {

          stGame()
          // if (!account) {
          //   onOpen()
          //   return
          // }
          moveSnake(20, 0, disallowedDirection); //Move RIGHT at start
          // getPlayerBalance().then(data => {
          //   if (data > 0) {
          //     return
          //   }
          //   // alert('You need pay first.')
          //   return rechargeGameBalance()
          //   // return Promise.reject(new Error("Balance not available"))
          // }).then(() => {
          //   moveSnake(20, 0, disallowedDirection); //Move RIGHT at start
          // }).catch(err => {
          //   console.log("getPlayerBalance Error:", err)
          // })
        }
      }
    },
    [disallowedDirection, moveSnake, account]
  );

  const resetBoard = useCallback(() => {
    endGame()
    window.removeEventListener("keypress", handleKeyEvents);
    dispatch(resetGame());
    dispatch(scoreUpdates(RESET_SCORE));
    clearBoard(context);
    drawSnakeBody(context, snake1, "#fff");
    drawBorder(canvasRef.current, context, '#fff');
    drawFood(
      context,
      [generateRandomPosition(width - 20, height - 20)],
      "#f39b4b"
    ); //Draws object randomly
    window.addEventListener("keypress", handleKeyEvents);
  }, [context, dispatch, handleKeyEvents, height, snake1, width]);

  useEffect(() => {
    //Generate new object
    if (isConsumed) {
      const posi = generateRandomPosition(width - 20, height - 20);
      setPos(posi);
      setIsConsumed(false);

      //Increase snake size when object is consumed successfully
      dispatch(increaseSnake());

      //Increment the score
      dispatch(scoreUpdates(INCREMENT_SCORE));
    }
  }, [isConsumed, pos, height, width, dispatch]);

  useEffect(() => {
    //Draw on canvas each time
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawSnakeBody(context, snake1, "#fff");
    drawBorder(canvasRef.current, context, '#fff')
    drawFood(context, [pos], "#f39b4b"); //Draws object randomly

    //When the object is consumed
    if (!isConsumed && snake1[0].x === pos?.x && snake1[0].y === pos?.y) {
      console.log("getPositionData:",position)
      increment()
      setIsConsumed(true);
    }

    if (
      hasSnakeCollided(snake1, snake1[0]) ||
      snake1[0].x >= width ||
      snake1[0].x <= 0 ||
      snake1[0].y <= 0 ||
      snake1[0].y >= height
    ) {
      endGame()
      setGameEnded(true);
      dispatch(stopGame());
      window.removeEventListener("keypress", handleKeyEvents);
    } else setGameEnded(false);
  }, [context, pos, snake1, height, width, dispatch, handleKeyEvents]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);

    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };
  }, [disallowedDirection, handleKeyEvents]);

  return (
    <>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          style={{
            border: `3px solid ${gameEnded ? "#31281f" : "white"}`,
          }}
          width={width}
          height={height}
        />
      </div>
      <Instruction resetBoard={resetBoard} />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Wallet Connect Notice
            </AlertDialogHeader>

            <AlertDialogBody>
              You need connect your wallet and pay before continuing.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default CanvasBoard;
