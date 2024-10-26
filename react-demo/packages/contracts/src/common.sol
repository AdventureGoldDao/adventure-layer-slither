// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

  enum OrbSize { SMALL, LARGE }

  struct Position {
    int32 x;
    int32 y;
  }
  struct Orb {
    Position position;
    OrbSize orbSize;
    string color;
  }

  struct UpdatePosition {
    uint8 status;
    Orb[] orbs;
    uint8 score;
  }

