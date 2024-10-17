// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {Users, UsersData, GameCodeToGameState} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";
import {MAX_ORB_COUNT, Orb,Position,randomCoordinate,generateOrbSize,generateColor} from "../orb.sol";
contract GameCodeToGameStateSystem is System {

  struct GameStateData {
    UsersData[] leaderboard;
    Orb[] orbs;
  }

  function getLeaderboardData(bytes6 gameCode) internal view returns (GameStateData memory _d) {
    address[] memory _players = GameCodeToGameState.getPlayers(gameCode);
    _d.leaderboard = new UsersData[];
    for (uint256 i = 0; i < _players.length; i++) {
       _d.leaderboard[i] = Users.get(_players[i]);
    }
  }

  function generateOrbs(bytes6 gameCode) public {
    for (uint i = 0; i < MAX_ORB_COUNT - uint(GameCodeToGameState.lengthOrbs); i++) {
      Position memory pos = Position(randomCoordinate(),randomCoordinate());
      GameCodeToGameState.pushOrbs(gameCode, bytes32(Orb(pos, generateOrbSize(), generateColor())));
    }
  }

}
