// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Users, UsersData, GameCodeToGameState} from "../codegen/index.sol";
import {OrbSize} from "../codegen/common.sol";
import {Position,Orb,GameState} from "../common.sol";

contract GameStateSystem is System {
  uint constant MAX_ORB_COUNT = 150;
  uint256 constant MAP_COORDINATE = 140000;

  mapping(uint32 => GameState) private gameStateData;


  function getLeaderboardData(uint32 gameCode) public view returns (GameState memory) {
    return gameStateData[gameCode];
  }

  function getDataPlayers(uint32 gameCode) public view returns (address[] memory) {
    return GameCodeToGameState.getPlayers(gameCode);
  }

  function updateGameState(uint32 gameCode) public {
    address[] memory _players = GameCodeToGameState.getPlayers(gameCode);
    if (gameStateData[gameCode].leaderboard.length > 0) {
      delete gameStateData[gameCode].leaderboard;
    }
    for (uint256 i = 0; i < _players.length; i++) {
      address player = _players[i];
      require(player != address(0), "Invalid player address");
      gameStateData[gameCode].leaderboard.push(Users.get(player));
    }
    uint256 len = gameStateData[gameCode].orbs.length;
    for (uint256 i = 0; i < MAX_ORB_COUNT - len; i++) {
      int idx = int(i + len);
      gameStateData[gameCode].orbs.push(
        Orb(
          Position(randomCoordinate(idx), randomCoordinate(idx + 3)),
          generateOrbSize(idx), generateColor(idx)
        )
      );
    }
  }

  function generateColor(int i) public view returns (string memory) {
    string[8] memory colors = ["#ff0000","#24f51e","#221fdc","#811fdc","#1fd9dc","#ff6d00","#fdff00","#ff00b2"];
    return colors[generateRandom(i) % 8];
  }

  function randomCoordinate(int i) public view returns (int) {
    return int(generateRandom(i) % 280001) - 140000;
  }

  function generateOrbSize(int i) public view returns (string memory) {
    uint randomVal = generateRandom(i) % 100;
    return randomVal <= 75 ? "SMALL" : "LARGE";
  }

  function generateRandom(int i) public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp,i + 54321, msg.sender)));
  }

}
