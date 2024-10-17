// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Users, GameCodeToGameState} from "../codegen/index.sol";
import {OrbSize} from "../codegen/common.sol";
import {Position,Orb,GameState} from "../common.sol";

contract GameStateSystem is System {
  uint constant MAX_ORB_COUNT = 150;
  uint256 constant MAP_COORDINATE = 140000;

  string[] colors = [
      "#ff0000",
      "#24f51e",
      "#221fdc",
      "#811fdc",
      "#1fd9dc",
      "#ff6d00",
      "#fdff00",
      "#ff00b2"
  ];

  mapping(uint32 => GameState) private gameStateData;

  function getLeaderboardData(uint32 gameCode) public view returns (GameState memory) {
    return gameStateData[gameCode];
  }

  function getDataPlayers(uint32 gameCode) public view returns (address[] memory) {
    return GameCodeToGameState.getPlayers(gameCode);
  }

  function updateGameState(uint32 gameCode) public {
    address[] memory _players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i <= _players.length; i++) {
      gameStateData[gameCode].leaderboard[i] = Users.get(_players[i]);
    }
    uint256 len = gameStateData[gameCode].orbs.length;
    for (uint256 i = 0; i <= MAX_ORB_COUNT - len; i++) {
      gameStateData[gameCode].orbs.push(
        Orb(
          Position(randomCoordinate(i), randomCoordinate(i)),
          generateOrbSize(i), generateColor(i)));
    }
  }

  function generateColor(uint256 i) public view returns (string memory) {
    uint256 idx = (uint256(keccak256(abi.encodePacked(block.timestamp,i,block.prevrandao)))) % colors.length;
    return colors[idx];
  }

  function randomCoordinate(uint256 i) public view returns (int) {
    uint256 randomHash = uint256(keccak256(abi.encodePacked(block.timestamp,i,block.prevrandao)));
    uint256 randomWithinRange = randomHash % (MAP_COORDINATE * 2 + 1);
    int256 randomResult = int256(randomWithinRange - MAP_COORDINATE);
    return randomResult;
  }

  function generateOrbSize(uint256 i) public view returns (string memory) {
    uint randomVal = (uint256(keccak256(abi.encodePacked(block.timestamp,i,block.prevrandao)))) % 100;
    return randomVal <= 75 ? "SMALL" : "LARGE";
  }


}
