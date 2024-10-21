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

  function initSnakeBody() public {
    if (gameUserSnakeBody[msg.sender].length == 0) {
      for (int32 i = 0; i < 20; i++) {
        gameUserSnakeBody[msg.sender].push(Position(60000, 10000 + i * 500));
      }
    }
  }

  function getNewBodyPartPosition(int len) public returns (Position[] memory _d) {
    uint256 len2 = gameUserSnakeBody[msg.sender].length;
    int xDiff = gameUserSnakeBody[msg.sender][len2 - 1].x - gameUserSnakeBody[msg.sender][len2 - 2].x;
    int yDiff = gameUserSnakeBody[msg.sender][len2 - 1].y - gameUserSnakeBody[msg.sender][len2 - 2].y;
    for (int i = 0; i < len; i++) {
      Position memory p = Position(int32(gameUserSnakeBody[msg.sender][len2 - 1].x + xDiff * i), int32(gameUserSnakeBody[msg.sender][len2 - 1].y + yDiff * i));
      gameUpdatePosition[msg.sender].add.push(p);
      gameUserSnakeBody[msg.sender].push(p);
    }
    return _d;
  }

  function stGame(string memory name) public {
    Users.setUsername(msg.sender,name);
    addUser();
  }

  function addUser() public {
    if (gameStateExistsAndRemove(false)) {
      GameCodeToGameState.pushPlayers(gameCode,msg.sender);
      initSnakeBody();
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


  function moveSnake(Position[] memory list) public{
    delete gameUpdatePosition[msg.sender];
    for (uint i = 0; i < list.length; i++) {
      Position memory add = list[i];

      if (add.x >= MAX_MAP_RADIUS || add.x <= MIN_MAP_RADIUS || add.y >= MAX_MAP_RADIUS || add.y <= MIN_MAP_RADIUS) {
        gameUpdatePosition[msg.sender].status = 2;
      }

      gameUserSnakeBody[msg.sender].push(add);

      uint256 idx = Orbs.getValue(positionToEntityKey(add));
      if (idx != 0) {
        Orbs.deleteRecord(positionToEntityKey(add));
        Orb memory o = gameStateData.orbs[idx];
        if (keccak256(bytes(o.orbSize)) == keccak256(bytes("SMALL"))) {
          Users.setScore(msg.sender,Users.getScore(msg.sender) + 1);
          gameUpdatePosition[msg.sender].status = 1;
          getNewBodyPartPosition(1);
        }else{
          Users.setScore(msg.sender,Users.getScore(msg.sender) + 5);
          gameUpdatePosition[msg.sender].status = 1;
          getNewBodyPartPosition(5);
        }
        gameStateData.orbs[idx] = gameStateData.orbs[gameStateData.orbs.length - 1];
        gameStateData.orbs.pop();
      }

      for (uint k = 1; k < gameUserSnakeBody[msg.sender].length; k++) {
        gameUserSnakeBody[msg.sender][k - 1] = gameUserSnakeBody[msg.sender][k];
      }
      gameUserSnakeBody[msg.sender].pop();
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
    for (uint256 i = 0; i < MAX_ORB_COUNT - len; i++) {
      int idx = int(i + len);
      Position memory p = Position(randomCoordinate(idx), randomCoordinate(idx + 3));
      Orbs.set(positionToEntityKey(p),i);
      gameStateData.orbs.push(Orb(p, generateOrbSize(idx), generateColor(idx)));
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
