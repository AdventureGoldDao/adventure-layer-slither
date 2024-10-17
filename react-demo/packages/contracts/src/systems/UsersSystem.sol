// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Users, UsersData, GameCodeToGameState} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";

contract UsersSystem is System {

  function getData() public view returns (UsersData memory) {
    return Users.get(msg.sender);
  }

  function stGame(string memory name) public {
    bytes6 gameCode = generateRandomBytes6();
    Users.setGameCode(msg.sender,gameCode);
    Users.setUsername(msg.sender,name);
    addUser(gameCode);
  }

  function addUser(bytes6 gameCode) public {
    if (!gameStateExists(gameCode)) {
      GameCodeToGameState.pushPlayers(gameCode,msg.sender);
    }
  }

  function removeUser(bytes6 gameCode) public {
    address[] memory players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        players[i] = players[0];
        GameCodeToGameState.popPlayers(gameCode);
        break;
      }
    }
  }

  function gameStateExists(bytes6 gameCode) internal view returns (bool) {
    address[] memory players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        return true;
      }
    }
    return false;
  }

  function generateRandomBytes6() public view returns (bytes6) {
    bytes memory alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    bytes memory randomBytes = new bytes(6);
    for (uint256 i = 0; i < 6; i++) {
      uint256 randomIndex = uint256(
        keccak256(
          abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i)
        )
      ) % alphabet.length;
      randomBytes[i] = alphabet[randomIndex];
    }
    return bytes6(randomBytes);
  }
}
