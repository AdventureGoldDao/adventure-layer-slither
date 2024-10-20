// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Users, UsersData, GameCodeToGameState} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";

contract UsersSystem is System {

  //get score
  function getData() public view returns (UsersData memory) {
    return Users.get(msg.sender);
  }

  function stGame(string memory name) public {
    uint32 gameCode = uint32(generateRandom() % 10000);
    Users.setGameCode(msg.sender,gameCode);
    Users.setUsername(msg.sender,name);
    addUser(gameCode);
  }

  function addUser(uint32 gameCode) public {
    if (gameStateExistsAndRemove(gameCode,false)) {
      GameCodeToGameState.pushPlayers(gameCode,msg.sender);
    }
  }

  function gameStateExistsAndRemove(uint32 gameCode,bool remove) public returns (bool) {
    address[] memory players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        if (remove){
          GameCodeToGameState.updatePlayers(gameCode,uint256(i),GameCodeToGameState.getItemPlayers(gameCode,0));
          GameCodeToGameState.popPlayers(gameCode);
        }
        return false;
      }
    }
    return true;
  }

  function generateRandom() public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
  }
}
