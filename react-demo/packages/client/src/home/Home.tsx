import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

import "./Home.css";

import GameState from "../game/GameState";
import HowToPlay from "./HowToPlay";
import { useMUD } from "../MUDContext";

/**
 * Interface representing data for an HTML input that updates metadata based
 * on text editing and has some functionality on keys pressed.
 */
interface ControlledInputProps {
  /** A read-only value representing the value of the text input element. */
  value: string;
  /** A function that sets the value of the given read-only value. */
  setValue: Dispatch<SetStateAction<string>>;
  /** A function for the event the enter key is pressed. */
  onEnter: () => void;
  /** The text placeholder of the input HTML element. */
  placeholder: string;
  /** The class of the input HTML element. */
  className: string;
}

/**
 * Creates and returns an input HTML element that updates metadata based
 * on text editing and with a custom functionality for when the enter key
 * is pressed
 *
 * @param value a read-only value representing the value of the text input element
 * @param setValue a function that sets the given read-only value
 * @param onEnter a function called when the enter key is pressed
 * @param placeholder the text placeholder for the returned input HTML element
 * @param className the class of the returned input HTML element
 * @returns
 */
function ControlledInput({
                           value,
                           setValue,
                           onEnter,
                           placeholder,
                           className,
                         }: ControlledInputProps): JSX.Element {
  return (
    <input
      value={value}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
        setValue(ev.target.value)
      }
      onKeyDown={(ev: React.KeyboardEvent<HTMLInputElement>): void => {
        if (ev.key === "Enter") {
          onEnter();
        }
      }}
      placeholder={placeholder}
      className={className}
    ></input>
  );
}

/**
 * An interface representing data passed to the home page HTML element
 */
interface HomeProps {
  /** A function that sets whether or not the client has started playing the game */
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  /** A metadata representation of the current state of the game */
  gameState: GameState;
  /** A function that sets the current state of the game */
  setGameState: Dispatch<SetStateAction<GameState>>;
  accountSetup: any;
  setAccountSetup: Dispatch<SetStateAction<any>>;
}

/**
 * Creates and returns the home page, rendering a button which displays
 * how-to-play instructions upon clicking, an input box for specifying one's
 * username, a button to create a new game, and an input box for specifying a
 * custom, already live game, with a button to join said game
 *
 * @param setGameStarted A function that sets whether or not the client has started playing the game
 * @param setScores A function that sets the current leaderboard (set of scores) for the game
 * @param setGameCode A function that sets the game code for the lobby the client is playing in
 * @param gameState A metadata representation of the current state of the game
 * @param setGameState A function that sets the current state of the game
 * @param orbSet A list of all orbs stored in metadata form
 * @returns the home page of the Slither+ game
 */
export default function Home({
                               setGameStarted,
                               gameState,
                               setGameState,
                               accountSetup,
                               setAccountSetup,
                             }: HomeProps): JSX.Element {
  const {
    systemCalls: {
      stGame,
    },
  } = useMUD();
  // const uData = useComponentValue(Users, playerEntity);
  // console.log("uData:", uData)

  const [username, setUsername] = useState("");
  const [inputGamecode, setInputGamecode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [displayHowToPlay, setDisplayHowToPlay] = useState(false);

  // registers the client's websocket to handle joining a new game
  const startNewGame = async () => {
    if (username.trim().length === 0) {
      setErrorText("Your username should be non-empty!");
      return;
    }
    await stGame(username)
    setGameStarted(true)
  };


  return (
    <div className="main-container">
      <div className="how-to-play-display">
        {displayHowToPlay ? (
          <HowToPlay setDisplayHowToPlay={setDisplayHowToPlay} />
        ) : null}
      </div>
      <div className="HomeContainer">
        <button
          className="btn btn-light how-to-play-button"
          aria-label="How To Play button"
          onClick={() => setDisplayHowToPlay(true)}
        >
          How to play?
        </button>
        <h1 className="main-title">
          Slither
          <span className="title-plus" aria-label="Title: Slither+">
            +
          </span>
        </h1>
        <h2
          className="username-prompt"
          aria-label="Prompt: Enter your username"
        >
          Enter your username:
        </h2>
        <ControlledInput
          value={username}
          setValue={setUsername}
          onEnter={() => {
            startNewGame();
          }}
          placeholder="Type your username here:"
          className="username-input"
          aria-label="Username input box"
        />
        <p className="error-text">{errorText}</p>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-5 col-sm-12">
              <button
                className="btn btn-light new-game-button"
                aria-label="New Game Button"
                onClick={startNewGame}
              >
                Create a new game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

