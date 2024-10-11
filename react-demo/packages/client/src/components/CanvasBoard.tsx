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
  MAX_SCORE, RESET, STOP_GAME, RIGHT, setDisDirection, LEFT, UP, DOWN
} from "../store/actions/index";
import { IGlobalState } from "../store/reducers";
import {
  clearBoard,
  drawObject,
  generateRandomPosition,
  hasSnakeCollided,
  IObjectBody,
} from "../utils";
import Instruction from "./Instructions";

export interface ICanvasBoard {
  height: number;
  width: number;
}
const CanvasBoard = ({ height, width }: ICanvasBoard) => {
  const {
    network : { playerEntity },
    components: { Position },
    systemCalls: { reStartGame, move, increment },
  } = useMUD();

  const position = useComponentValue(Position, playerEntity);
  if (position === undefined) {
     reStartGame()
  }

  const inerData = async () => {
    console.log("increment score :",await increment())
  };
  const reData = async () => {
    console.log("reStartGame :",await reStartGame())
  };

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const dispatch = useDispatch();
  const snake1 = useSelector((state: IGlobalState) => state.snake);
  const disallowedDirection = useSelector(
    (state: IGlobalState) => state.disallowedDirection
  );

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

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
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
          if (!account) {
            onOpen()
            return
          }
          moveSnake(20, 0, disallowedDirection); //Move RIGHT at start
        }
      }
    },
    [disallowedDirection, moveSnake, account]
  );

  const resetBoard = useCallback(async () => {
    reStartGame()
    window.removeEventListener("keypress", handleKeyEvents);
    dispatch(resetGame());
    clearBoard(context);
    drawObject(context, snake1, "#91C483");
    drawObject(
      context,
      [generateRandomPosition(width - 20, height - 20)],
      "#676FA3"
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
    drawObject(context, snake1, "#91C483");
    drawObject(context, [pos], "#676FA3"); //Draws object randomly

    //When the object is consumed
    if (!isConsumed && snake1[0].x === pos?.x && snake1[0].y === pos?.y) {
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
      // reStartGame()
      setGameEnded(true);
      dispatch(stopGame());
      window.removeEventListener("keypress", handleKeyEvents);
    } else setGameEnded(false);
  }, [context, pos, snake1, height, width, dispatch, handleKeyEvents]);

  const { systemCalls: { getPlayerBalance } } = useMUD();

  useEffect(() => {
    if (gameEnded) {
      getPlayerBalance(ethers.utils.getAddress(`${account}`)).then(data => {
        console.log("gameEnded", data)
      }).catch(err => {
        console.log("getPlayerBalance Error:", err)
      })
    }
  }, [gameEnded, dispatch, account]);
  
  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);

    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };
  }, [disallowedDirection, handleKeyEvents]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          border: `3px solid ${gameEnded ? "red" : "black"}`,
        }}
        width={width}
        height={height}
      />
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
