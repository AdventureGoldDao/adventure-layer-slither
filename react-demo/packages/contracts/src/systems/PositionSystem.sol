// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "../codegen/tables/Counter.sol";
import "../codegen/tables/Position.sol";
import {Counter, CounterData, Position, PositionData} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";
import {addressToEntityKey} from "../addressToEntityKey.sol";

contract PositionSystem is System {

  bytes32[] public allPlayers;

  function getScore() public view returns (CounterData memory c) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    return Counter.get(player);
  }

  function increment() public returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    CounterData memory counter = Counter.get(player);
    uint32 newValue = counter.curScore + 1;
    Counter.setCurScore(player, newValue);
    if(newValue>counter.maxScore){
      Counter.setMaxScore(player, newValue);
    }
    return newValue;
  }

  function move(uint32 direction) public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    Position.setM(player,direction);
  }

  function getPositionData() public view returns (PositionData memory p) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    return Position.get(player);
  }

  function endGame() public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    for (uint256 i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i] == player) {
        allPlayers[i] = allPlayers[allPlayers.length - 1];
        allPlayers.pop();
        break;
      }
    }
    Position.deleteRecord(player);
    Counter.setCurScore(player, uint32(0));
  }

  function stGame() public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    if (!exists(player)) {
      allPlayers.push(player);
      Position.set(player,  uint32(560),  uint32(300), uint32(2));
    }
  }

  function myFunction() external {
    uint256 length = allPlayers.length;
    for (uint256 i = 0; i < length; i++) {
      PositionData memory pData = Position.get(allPlayers[i]);
      if (pData.m == 0) {
        continue;
      } else if (pData.m == 1) {
        Position.setX(allPlayers[i], pData.y - 20);
      } else if (pData.m == 2) {
        Position.setX(allPlayers[i], pData.x + 20);
      } else if (pData.m == 3) {
        Position.setX(allPlayers[i], pData.y + 20);
      } else if (pData.m == 4) {
        Position.setX(allPlayers[i], pData.x - 20);
      }
    }
  }

  function exists(bytes32 player) internal view returns (bool) {
    for (uint256 i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i] == player) {
        return true;
      }
    }
    return false;
  }
}
