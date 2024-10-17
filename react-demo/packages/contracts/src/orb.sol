// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

uint constant MAX_ORB_COUNT = 150;
int constant MAP_MIN_COORDINATE = -1400;
int constant MAP_MAX_COORDINATE = 1400;

struct Orb {
  Position position;
  OrbSize size;
  string color;
}

struct Position {
  int x;
  int y;
}
enum OrbSize { SMALL, LARGE }

function randomCoordinate() private view returns (int) {
  return int(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % uint256(MAP_MAX_COORDINATE - MAP_MIN_COORDINATE + 1)) + MAP_MIN_COORDINATE;
}

function generateOrbSize() private view returns (OrbSize) {
  uint randomVal = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 100;
  return randomVal <= 75 ? OrbSize.SMALL : OrbSize.LARGE;
}

function generateColor() private view returns (string memory) {
  bytes32 randomBytes = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender));
  bytes memory hexColor = new bytes(6);
  for (uint i = 0; i < 6; i++) {
    hexColor[i] = bytes1(uint8(48 + uint8(randomBytes[i]) % 16)); // Generate a random hex character
  }
  return string(hexColor);
}
