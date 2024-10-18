// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import {UserToSnakeDeque} from "../codegen/index.sol";
import {System} from "@latticexyz/world/src/System.sol";
import {Position} from "../common.sol";
contract UserToSnakeDequeSystem is System {

  struct updatePosition {
    Position add;
    Position remove;
  }

  mapping(address => Position[]) private gameUserSnakeBody;

  function getSnakeBody() public view returns (Position[] memory) {
    return gameUserSnakeBody[msg.sender];
  }

  function moveSnake(int x,int y) public returns (updatePosition memory _d){
      Position memory add = Position(x,y);
      gameUserSnakeBody[msg.sender].push(add);
      _d.add = add;
      if (gameUserSnakeBody[msg.sender].length > 10) {
        _d.remove = gameUserSnakeBody[msg.sender][0];
        gameUserSnakeBody[msg.sender].pop();
      }
      return _d;
  }

}
