// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Users, UsersData, GameCodeToGameState, Orbs} from "../codegen/index.sol";
import {Position,Orb,GameState,UpdatePosition,positionToEntityKey} from "../common.sol";

contract GameStateSystem is System {
  uint constant MAX_ORB_COUNT = 150;
  int32 constant MAX_MAP_RADIUS = 153300;
  int32 constant MIN_MAP_RADIUS = -153300;
  uint32 constant gameCode = 12345;
  uint256 constant MAP_COORDINATE = 140000;
  mapping(address => Position[]) private gameUserSnakeBody;
  mapping(address => UpdatePosition) private gameUpdatePosition;
  GameState private gameStateData;

  function getLeaderboardData() public view returns (UsersData[] memory) {
    return gameStateData.leaderboard;
  }


  function getOrbData() public view returns (Orb[] memory) {
    return gameStateData.orbs;
  }

  function getDataPlayers() public view returns (address[] memory) {
    return GameCodeToGameState.getPlayers(gameCode);
  }

  function getSnakeBody(address addr) public view returns (Position[] memory) {
    return gameUserSnakeBody[addr];
  }
  function getUpdatePosition(address addr) public view returns (UpdatePosition memory) {
    return gameUpdatePosition[addr];
  }

  function stGame(string memory name) public {
    Users.setUsername(msg.sender,name);
    addUser();
  }

  function addUser() public {
    if (gameStateExistsAndRemove(false)) {
      GameCodeToGameState.pushPlayers(gameCode,msg.sender);
    }
  }

  function endGame() public {
    Users.deleteRecord(msg.sender);
    delete gameUserSnakeBody[msg.sender];
    gameStateExistsAndRemove(true);
  }

  function gameStateExistsAndRemove(bool remove) public returns (bool) {
    address[] memory players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        if (remove){
          if (players.length - 1 == i){
            GameCodeToGameState.popPlayers(gameCode);
          }else{
            address a = GameCodeToGameState.getItemPlayers(gameCode,players.length -1);
            GameCodeToGameState.popPlayers(gameCode);
            GameCodeToGameState.updatePlayers(gameCode,uint256(i),a);
          }
        }
        return false;
      }
    }
    return true;
  }


  function moveSnake(Position[] memory list) public {
    delete gameUpdatePosition[msg.sender];
    for (uint i = 0; i < list.length; i++) {
      Position memory add = list[i];

      if (add.x >= MAX_MAP_RADIUS || add.x <= MIN_MAP_RADIUS || add.y >= MAX_MAP_RADIUS || add.y <= MIN_MAP_RADIUS) {
        gameUpdatePosition[msg.sender].status = 2;
        return;
      }

      uint256 idx = Orbs.getValue(positionToEntityKey(add));
      if (idx != 0) {
        Orbs.deleteRecord(positionToEntityKey(add));
        Orb memory o = gameStateData.orbs[idx];
        gameUpdatePosition[msg.sender].status = 1;
        gameUpdatePosition[msg.sender].orbIds.push(uint8(idx));
        if (keccak256(bytes(o.orbSize)) == keccak256(bytes("SMALL"))) {
          gameUpdatePosition[msg.sender].score += 1;
        }else{
          gameUpdatePosition[msg.sender].score += 5;
        }
        Users.setScore(msg.sender,Users.getScore(msg.sender) + gameUpdatePosition[msg.sender].score);
        gameStateData.orbs[idx] = gameStateData.orbs[gameStateData.orbs.length - 1];
        gameStateData.orbs.pop();
      }
    }
  }

  function adventureHeatbeat() public {
    address[] memory _players = GameCodeToGameState.getPlayers(uint32(12345));
    if (gameStateData.leaderboard.length > 0) {
      delete gameStateData.leaderboard;
    }
    for (uint256 i = 0; i < _players.length; i++) {
      gameStateData.leaderboard.push(Users.get(_players[i]));
    }
    uint256 len = gameStateData.orbs.length;
    for (uint256 i = len; i < MAX_ORB_COUNT; i++) {
      Position memory p = Position(randomCoordinate(int(i)), randomCoordinate(int(i) + 3));
      Orbs.set(positionToEntityKey(p),i);
      gameStateData.orbs.push(Orb(p, generateOrbSize(int(i)), generateColor(int(i))));
    }
  }

  function generateColor(int i) public view returns (string memory) {
    string[8] memory colors = ["#ff0000","#24f51e","#221fdc","#811fdc","#1fd9dc","#ff6d00","#fdff00","#ff00b2"];
    return colors[generateRandom(i) % 8];
  }

  function randomCoordinate(int i) public view returns (int32) {
    return int32(int(generateRandom(i) % 280001)) - 140000;
  }

  function generateOrbSize(int i) public view returns (string memory) {
    uint randomVal = generateRandom(i) % 100;
    return randomVal <= 75 ? "SMALL" : "LARGE";
  }

  function generateRandom(int i) public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp,i + 54321, msg.sender)));
  }

}
