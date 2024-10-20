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