// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Users, UsersData} from "../codegen/index.sol";
import {Position,Orb,UpdatePosition} from "../common.sol";

contract GameStateSystem is System {
  uint constant MAX_ORB_COUNT = 150;
  int32 constant MAX_MAP_RADIUS = 151000;
  int32 constant MIN_MAP_RADIUS = -151000;
  uint32 constant gameCode = 12345;
  uint256 constant MAP_COORDINATE = 140000;
  uint256 constant SNAKE_CIRCLE_RADIUS = 3500;
  mapping(address => UpdatePosition) private gameUpdatePosition;
  Orb[] private orbs;

  function getOrbData() public view returns (Orb[] memory) {
    return orbs;
  }


  function getUpdatePosition(address addr) public view returns (UpdatePosition memory _d) {
    return gameUpdatePosition[addr];
  }

  function stGame(string memory name) public {
    Users.set(msg.sender,0, name);
  }

  function endGame() public {
    delete gameUpdatePosition[msg.sender];
    Users.deleteRecord(msg.sender);
  }

  function moveSnake(Position[] memory list) public {
    delete gameUpdatePosition[msg.sender];
      for (uint256 i = 0; i < list.length; i++) {
        Position memory add = list[i];

        if (add.x >= MAX_MAP_RADIUS || add.x <= MIN_MAP_RADIUS || add.y >= MAX_MAP_RADIUS || add.y <= MIN_MAP_RADIUS) {
          gameUpdatePosition[msg.sender].status = 2;
          return;
        }

        for (uint256 j = 0; j < orbs.length; j++) {
          Orb memory o = orbs[j];
        if (calculateDistance(add, o.position) <= SNAKE_CIRCLE_RADIUS) {
          gameUpdatePosition[msg.sender].status = 1;
          gameUpdatePosition[msg.sender].orbs.push(o);
          orbs[j] = orbs[orbs.length - 1];
          orbs.pop();
          if (keccak256(bytes(o.orbSize)) == keccak256(bytes("SMALL"))) {
            gameUpdatePosition[msg.sender].score += 1;
          }else{
            gameUpdatePosition[msg.sender].score += 5;
          }
          Users.setScore(msg.sender,Users.getScore(msg.sender) + uint32(gameUpdatePosition[msg.sender].score));
        }
      }
    }
  }

  function calculateDistance(Position memory p1, Position memory p2) internal pure returns (uint256) {
    uint256 dx = abs(p1.x - p2.x);
    uint256 dy = abs(p1.y - p2.y);

    return sqrt(dx * dx + dy * dy);
  }

  function sqrt(uint256 x) internal pure returns (uint256 y) {
    if (x == 0) return 0;
    uint256 z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
  }

  function abs(int32 x) internal pure returns (uint256) {
    return uint256(int256(x < 0 ? -x : x));
  }

  function adventureHeatbeat() public {
    uint256 len = orbs.length;
    for (uint256 i = len; i < MAX_ORB_COUNT; i++) {
      Position memory p = Position(randomCoordinate(int(i)), randomCoordinate(int(i) + 3));
      orbs.push(Orb(p, generateOrbSize(int(i)), generateColor(int(i))));
    }
  }

  function generateColor(int i) public view returns (string memory) {
    string[8] memory colors = ["#ff0000","#24f51e","#221fdc","#811fdc","#1fd9dc","#ff6d00","#fdff00","#ff00b2"];
    return colors[generateRandom(i) % 8];
  }

  function randomCoordinate(int i) public view returns (int32) {
    return int32(int(generateRandom(i) % 280001)) - 140000;
  }

  function generateOrbSize(int i) public view returns (string memory) {
    uint randomVal = generateRandom(i) % 100;
    return randomVal <= 75 ? "SMALL" : "LARGE";
  }

  function generateRandom(int i) public view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(block.timestamp,i + 54321, msg.sender)));
  }

}
