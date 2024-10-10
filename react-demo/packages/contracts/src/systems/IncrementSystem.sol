// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter } from "../codegen/index.sol";
import { addressToEntityKey } from "../addressToEntityKey.sol";

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint32 counter = Counter.getValue(player);
    uint32 newValue = counter + 1;
    Counter.set(player, newValue);
    return newValue;
  }
  function setMaxScore(uint32 newscore) public returns (uint32) {
    bytes32 player = addressToEntityKey(address(_msgSender()));
    uint32 score = Counter.getValue(player);
    if(newscore>score){
      score = newscore;
      Counter.setValue(player, score);
    }
    return score;
  }
}
