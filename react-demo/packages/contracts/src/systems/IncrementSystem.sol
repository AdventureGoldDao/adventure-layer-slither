// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Counter, Position, PositionData } from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";
import {addressToEntityKey} from "../addressToEntityKey.sol";

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint32 counter = Counter.getCurScore(player);
    uint32 newValue = counter + 1;
    Counter.setCurScore(player, newValue);
    uint32 maxScore = Counter.getMaxScore(player);
    if(newValue>maxScore){
      Counter.setMaxScore(player, newValue);
    }
    return newValue;
  }

  function reStartScore() public {
      bytes32 player = addressToEntityKey(address(_msgSender()));
      Counter.setCurScore(player, uint32(0));
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

  function reStartGame() public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    PositionData memory pData = Position.get(player);
    pData.x = 560;
    pData.y = 300;
    pData.m = 2;
    Position.set(player, pData);
    reStartScore();
  }

  function myFunction() public {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    PositionData memory pData = Position.get(player);
    if (pData.m == 1) {
      Position.setX(player, pData.y - 20);
    } else if (pData.m == 2) {
      Position.setX(player, pData.x + 20);
    } else if (pData.m == 3) {
      Position.setX(player, pData.y + 20);
    } else if (pData.m == 4) {
      Position.setX(player, pData.x - 20);
    }
  }


}
