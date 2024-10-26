// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {System} from "@latticexyz/world/src/System.sol";
import {Users} from "../codegen/index.sol";
import {Position,Orb,OrbSize,UpdatePosition} from "../common.sol";

contract GameStateSystem is System {
  uint256 constant MAX_ORB_COUNT = 150;
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
        if (calculateDistance(add, o.position) <= SNAKE_CIRCLE_RADIUS * SNAKE_CIRCLE_RADIUS) {
          gameUpdatePosition[msg.sender].status = 1;
          gameUpdatePosition[msg.sender].orbs.push(o);
          orbs[j] = orbs[orbs.length - 1];
          orbs.pop();
          gameUpdatePosition[msg.sender].score += o.orbSize == OrbSize.SMALL ? 1 : 5;
        }
      }
    }
    Users.setScore(msg.sender,Users.getScore(msg.sender) + uint32(gameUpdatePosition[msg.sender].score));
  }

  function calculateDistance(Position memory p1, Position memory p2) internal pure returns (uint256) {
    uint256 dx = abs(p1.x - p2.x);
    uint256 dy = abs(p1.y - p2.y);
    return dx * dx + dy * dy;
  }

  function abs(int32 x) internal pure returns (uint256) {
    return uint256(int256(x < 0 ? -x : x));
  }

  function adventureHeatbeat() public {
    uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
    string[8] memory colors = ["#ff0000","#24f51e","#221fdc","#811fdc","#1fd9dc","#ff6d00","#fdff00","#ff00b2"];
    for (uint256 i = orbs.length; i < MAX_ORB_COUNT; i++) {
      int32 x = int32(int(rand / (i + 1) % 280001)) - 140000;
      int32 y = int32(int(rand / (i + 3) % 280001)) - 140000;
      Position memory p = Position(x, y);
      orbs.push(Orb(p, (rand + i) % 10 >= 7 ? OrbSize.LARGE : OrbSize.SMALL, colors[(rand + i) % 8]));
    }
  }

}
