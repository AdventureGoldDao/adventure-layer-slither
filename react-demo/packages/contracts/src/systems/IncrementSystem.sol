// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

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

  function reStartGame() public {
      bytes32 player = addressToEntityKey(address(_msgSender()));
      Counter.setCurScore(player, uint32(0));
  }
}
