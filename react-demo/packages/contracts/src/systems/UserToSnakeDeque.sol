// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {UserToSnakeDeque} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";

contract UserToSnakeDequeSystem is System {

  function getSnakeBody() internal view returns (bytes32[] memory snakeBody) {
    return UserToSnakeDeque.get(msg.sender);
  }

  function moveSnake(bytes32 add) public {
    UserToSnakeDeque.push(msg.sender,add);
    UserToSnakeDeque.pop(msg.sender);
  }

}
