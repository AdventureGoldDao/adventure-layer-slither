// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {OrbSize} from "./codegen/common.sol";

  struct Position {
    int32 x;
    int32 y;
  }

  struct Orb {
    Position position;
    OrbSize orbSize;
  }


