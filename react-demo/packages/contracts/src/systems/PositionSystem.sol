// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Counter, CounterData, Position, PositionData } from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";
import {addressToEntityKey} from "../addressToEntityKey.sol";

contract PositionSystem is System {

  bytes32[] public allPlayers;

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

  function getPositionData() public view returns (PositionData memory _p) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    PositionData memory _pData = Position.get(player);
    return _pData;
  }

  function endGame() public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    PositionSystem.remove(player);
    Counter.setCurScore(player, uint32(0));
  }

  function startGame(bytes32 player) public {
    if (!exists(player)) {
      allPlayers.push(player);
      Position.set(player, PositionData({x: 560, y: 300, m: 0}));
      Position.setM(player,uint32(2));
    }
  }

  function remove(bytes32 player) internal {
    for (uint256 i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i] == player) {
        allPlayers[i] = allPlayers[allPlayers.length - 1];
        allPlayers.pop();
        break;
      }
    }
    Position.deleteRecord(player);
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
