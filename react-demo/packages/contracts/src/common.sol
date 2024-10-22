// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {UsersData} from "./codegen/tables/Users.sol";

  struct Position {
    int32 x;
    int32 y;
  }
  struct Orb {
    Position position;
    string orbSize;
    string color;
  }

  struct GameState {
    UsersData[] leaderboard;
    Orb[] orbs;
  }

  struct UpdatePosition {
    uint8 status;
    uint8[] orbIds;
    uint8 score;
  }



  function positionToEntityKey(Position memory p) pure returns (bytes32) {
    int x = p.x / 10000;
    int y = p.x / 10000;
    return keccak256(abi.encode(x, y));
  }
