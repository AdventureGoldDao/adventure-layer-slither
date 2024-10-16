// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {GameCodeToGameState, GameCodeToGameStateData} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";

contract GameCodeToGameStateSystem is System {

  function getLeaderboardData(bytes6 gameCode) internal view returns (GameCodeToGameStateData memory) {
    return GameCodeToGameState.get(gameCode);
  }

  function addUser(bytes6 gameCode) public {
    if (!exists(gameCode)) {
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

  function exists(bytes6 gameCode) internal view returns (bool) {
    address[] memory players = GameCodeToGameState.getPlayers(gameCode);
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        return true;
      }
    }
    return false;
  }

}
