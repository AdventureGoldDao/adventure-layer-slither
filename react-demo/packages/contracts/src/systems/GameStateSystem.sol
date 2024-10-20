// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Users, UsersData, GameCodeToGameState, Orbs} from "../codegen/index.sol";
import {OrbSize} from "../codegen/common.sol";
import {Position,Orb,GameState,UpdatePosition,positionToEntityKey} from "../common.sol";

contract GameStateSystem is System {
  uint constant MAX_ORB_COUNT = 150;
  uint32 constant gameCode = 12345;
  uint256 constant MAP_COORDINATE = 140000;
  mapping(address => Position[]) public gameUserSnakeBody;
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

  function initSnakeBody() public {
    if (gameUserSnakeBody[msg.sender].length == 0) {
      for (int i = 1; i <= 6; i++) {
        gameUserSnakeBody[msg.sender].push(Position(int(60000) - i * 100,int(10000)));
      }
    }
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
      gameStateExistsAndRemove(true);
  }

  function gameStateExistsAndRemove(bool remove) public returns (bool) {
    address[] memory players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        if (remove){
          Users.deleteRecord(msg.sender);
          delete gameUserSnakeBody[msg.sender];
          if (players.length -1 == i){
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


  function moveSnake(int x,int y) public returns (UpdatePosition memory _d){
    Position memory add = Position(x,y);
    gameUserSnakeBody[msg.sender].push(add);
    _d.add = add;

    uint256 idx = Orbs.getValue(positionToEntityKey(add));
    if (idx != 0) {
      Orbs.deleteRecord(positionToEntityKey(add));
      Orb memory o = gameStateData.orbs[idx];
      if (keccak256(bytes(o.orbSize)) == keccak256(bytes("SMALL"))) {
        Users.setScore(msg.sender,Users.getScore(msg.sender) + 1);
      }else{
        Users.setScore(msg.sender,Users.getScore(msg.sender) + 2);
      }
      delete gameStateData.orbs[idx];
    }

    if (gameUserSnakeBody[msg.sender].length >= 6) {
      _d.remove = gameUserSnakeBody[msg.sender][0];
      for (uint i = 1; i < gameUserSnakeBody[msg.sender].length; i++) {
        gameUserSnakeBody[msg.sender][i - 1] = gameUserSnakeBody[msg.sender][i];
      }
      gameUserSnakeBody[msg.sender].pop();
    }
    return _d;
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
