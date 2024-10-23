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

  struct UpdatePosition {
    uint8 status;
    Orb[] orbs;
    uint8 score;
  }

