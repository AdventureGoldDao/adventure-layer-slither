// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {UsersData} from "./codegen/tables/Users.sol";

  struct Position {
    int x;
    int y;
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
    Position add;
    Position remove;
  }



  function positionToEntityKey(Position memory p) pure returns (bytes32) {
    int x = p.x / 100;
    int y = p.x / 100;
    return keccak256(abi.encode(x, y));
  }
