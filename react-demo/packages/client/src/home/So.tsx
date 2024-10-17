import {useMUD} from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";
import { useState, Dispatch, SetStateAction } from "react";

import GameState, { Position } from "./game/GameState";
import { OrbData } from "./game/orb/Orb";


export default function registerSo(
  setScores: Dispatch<SetStateAction<Map<string, number>>>,
  setGameStarted: Dispatch<SetStateAction<boolean>>,
  setErrorText: Dispatch<SetStateAction<string>>,
  setGameCode: Dispatch<SetStateAction<string>>,
  orbSet: Set<OrbData>,
  gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
  username: string,
  hasGameCode: boolean,
  gameCode: string = ""
) : JSX.Element {

}
