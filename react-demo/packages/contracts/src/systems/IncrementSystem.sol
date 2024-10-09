// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Counter } from "../codegen/index.sol";

contract IncrementSystem is System {
  function increment() public returns (uint32) {
    uint32 counter = Counter.getValue(_msgSender());
    uint32 newValue = counter + 1;
    Counter.set(_msgSender(), newValue);
    return newValue;
  }
  function setMaxScore(uint32 newscore) public returns (uint32) {
    uint32 score = Counter.getValue(_msgSender());
    if(newscore>score){
      score = newscore;
      Counter.setValue(_msgSender(), score);
    }
    return score;
  }
}
