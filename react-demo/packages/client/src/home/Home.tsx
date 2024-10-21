import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

import "./Home.css";

import { registerSocket } from "../App";
import { registerContract } from "../event";
import GameState from "../game/GameState";
import { OrbData } from "../game/orb/Orb";
import HowToPlay from "./HowToPlay";
import { Kbd } from "@chakra-ui/react";

import { ethers } from "ethers";
import web3, { Web3 } from 'web3';
import { setupCustom } from "../mud/setup";
import { setBurnerPrivateKey } from "../mud/util";
import { useCustomMUD, useMUD } from "../MUDContext";
import { useComponentValue } from "@latticexyz/react";

import { getNetworkConfig } from "../mud/getNetworkConfig";
import { shortenAddress } from "@usedapp/core";

async function switchNetwork(targetChainId) {
  try {
    // 尝试切换到目标网络
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: Web3.utils.toHex(targetChainId) }],
    });
  } catch (switchError) {
    // 如果目标网络没有添加到钱包，添加网络
    if (switchError.code === 4902) {
      await addNetwork(targetChainId);
    } else {
      throw switchError;
    }
  }
}

async function addNetwork(chainId) {
  // const networkConfig = await getNetworkConfig();
  const networkParams = {
    chainId: Web3.utils.toHex(chainId), // 目标网络的 Chain ID
    chainName: 'Adventure Layer Shard', // 目标网络名称
    nativeCurrency: {
      name: 'AGLD',
      symbol: 'AGLD',
      decimals: 18,
    },
    rpcUrls: ['https://slither-demo.adventurelayer.xyz/shard'], // 替换为目标网络的 RPC URL
    // blockExplorerUrls: ['https://sepolia.etherscan.io'], // 替换为区块浏览器 URL
  };

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  } catch (addError) {
    console.error("Failed to add network:", addError);
  }
}

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
  /** A function that sets the current leaderboard (set of scores) for the game */
  setScores: Dispatch<SetStateAction<Map<string, number>>>;
  /** A function that sets the game code for the lobby the client is playing in */
  setGameCode: Dispatch<SetStateAction<string>>;
  /** A metadata representation of the current state of the game */
  gameState: GameState;
  /** A function that sets the current state of the game */
  setGameState: Dispatch<SetStateAction<GameState>>;
  /** A list of all orbs stored in metadata form */
  orbSet: Set<OrbData>;
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
  setScores,
  setGameCode,
  gameState,
  setGameState,
  orbSet,
}: HomeProps): JSX.Element {
  const {
    network: {playerEntity},
    components: {Users},
    systemCalls: {
      stGame,adventureHeatbeat, moveSnake,getDataPlayers,getOrbData,getLeaderboardData,getSnakeBody
    },
  } = useMUD();
  const { systemCalls } = useMUD()
  const { setMudContext } = useCustomMUD();
  const uData = useComponentValue(Users, playerEntity);
  console.log("uData:", uData)

  const [timer, setTimer] = useState(null);
  const [username, setUsername] = useState("");
  const [account, setAccount] = useState("");
  const [accountSetup, setAccountSetup] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [inputGamecode, setInputGamecode] = useState("");
  const [errorText, setErrorText] = useState("");
  const [displayHowToPlay, setDisplayHowToPlay] = useState(false);

  useEffect(() => {
    window.ethereum.request({ method: "eth_requestAccounts" }).then(() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      signer.getAddress().then(address => {
        setAccount(address)
      });
    })

    getNetworkConfig().then(networkConfig => {
      // console.log('Private', networkConfig.privateKey)
      setPrivateKey(networkConfig.privateKey);
    })

    // systemCalls.getSnakeBody().then((result) => {
    //   console.log('getSnakeBody:', result)
    // })

    // systemCalls.getLeaderboardData().then((result) => {
    //   console.log('getLeaderboardData:', result)
    // })
    // setBindAccount('0xcA64108F6D7117922aD403951fA92b782cD81662').then((res) => {
    //   console.log('setBindAccount:', res);
    //   return getBindAccountBy().then(testAccount => {
    //     console.log('getBindAccount:', testAccount)
    //     return testAccount
    //   })
    // })

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [])

  const connectWallet = async () => {
    try {
      const networkConfig = await getNetworkConfig();
      const targetChainId = networkConfig.chainId;
      const web3 = new Web3(window.ethereum);
      const chainId = await web3.eth.getChainId();
      if (chainId !== BigInt(targetChainId)) {
        try {
          await switchNetwork(targetChainId);
        } catch (error) {
          console.error("Failed to switch network:", error);
        }
      }

      let address = account
      if (!account) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        address = await signer.getAddress();
        setAccount(address)
      }

      let setupResult = accountSetup
      if (!accountSetup) {
        setupResult = await setupCustom('wallet')
        setAccountSetup(setupResult)
      }

      try {
        // const accountResult = await setupResult.systemCalls.getBindAccountBy()
        // console.log('BindAccount:', accountResult)
        // const bindAccount = accountResult ? accountResult.account : ''
        const bindAccount = await setupResult.systemCalls.getUserBindAccount(account)
        console.log('BindAccount:', bindAccount)

        if (bindAccount && bindAccount !== privateKey) {
          console.log('Read Exist Account')
          setPrivateKey(bindAccount)
          setBurnerPrivateKey(bindAccount)
          const existResult = await setupCustom('default')
          setMudContext(existResult)
        } else if (!bindAccount) {
          console.log('Set New Account')
          await setupResult.systemCalls.setBindAccount(privateKey)
        }
      } catch (err) {
        console.log('BindAccount Err', err)
        setErrorText('Failed to connect wallet.')
      }

      // setMudContext
      return address
    } catch (error) {
      setErrorText('Failed to connect wallet.')
    }
    return null;
  }

  // registers the client's websocket to handle joining a new game
  const startNewGame = async () => {
    if (username.trim().length === 0) {
      setErrorText("Your username should be non-empty!");
      return;
    }

    // if (!account) {
    const address = await connectWallet();
    setAccount(address);
    // }

    doSol();
    setErrorText("");

    try {
      // registerContract(
      //   setTimer,
      //   systemCalls,
      //   setScores,
      //   setGameStarted,
      //   setErrorText,
      //   setGameCode,
      //   orbSet,
      //   gameState,
      //   setGameState,
      //   username,
      //   false,
      // );

      registerSocket(
        setScores,
        setGameStarted,
        setErrorText,
        setGameCode,
        orbSet,
        gameState,
        setGameState,
        username,
        false,
      );
    } catch (e) {
      // check server status
      setErrorText("Error: Could not connect to server!");
    }
  };

  const doSol = async () => {
    const r = await stGame(username)
    console.log("adduser success:", r)
    setGameCode("12345");
    // setGameStarted(true)
    // console.log("init state:", await adventureHeatbeat())
    console.log("getOrbData: ",await getOrbData())
    console.log("getLeaderboardData: ",await getLeaderboardData())
    console.log("getSnakeBody: ",await getSnakeBody())
    let list = [];
    for (let i = 0; i < 10; i++) {
      list.push({x:60300 + i*100,y: 10000});
    }
    console.log("moveSnake: ",await moveSnake(list))
    console.log("getSnakeBody: ",await getSnakeBody())
  }

  // registers the client's websocket to handle joining a game with a code
  const startGameWithCode = (): void => {
    if (username.trim().length === 0) {
      //check that name is not empty
      setErrorText("Your username should be non-empty!");
      return;
    }
    setErrorText("");
    try {
      // registerSocket(
      //   setScores,
      //   setGameStarted,
      //   setErrorText,
      //   setGameCode,
      //   orbSet,
      //   gameState,
      //   setGameState,
      //   username,
      //   true,
      //   inputGamecode
      // );
    } catch (e) {
      // check server status
      setErrorText("Error: Could not connect to server!");
    }
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
        <div style={{marginTop: "12px"}}>
          <Kbd>{ account ? shortenAddress(account) : 'offline'}</Kbd>
        </div>
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
            if (inputGamecode.length === 0) {
              startNewGame();
            } else {
              startGameWithCode();
            }
          }}
          placeholder="Type your username here:"
          className="username-input"
          aria-label="Username input box"
        />
        <p className="error-text">{errorText}</p>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <button
                className="btn btn-light new-game-button"
                aria-label="New Game Button"
                onClick={startNewGame}
              >
                Create a new game
              </button>
            </div>
            {/* <div className="col-lg-2 col-md-2 col-sm-12">
              <div className="or-text">OR</div>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-12">
              <h4
                className="join-with-gamecode-text"
                aria-label="Prompt: Join with a game code"
              >
                Join with a game code
              </h4>
              <ControlledInput
                value={inputGamecode}
                setValue={setInputGamecode}
                onEnter={startGameWithCode}
                placeholder="Enter gamecode here:"
                className="gamecode-input"
                aria-label="Gamecode input box"
              />
              <br />
              <button
                className="btn btn-outline-light"
                aria-label="Join game button"
                onClick={startGameWithCode}
              >
                Join with a game code
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
