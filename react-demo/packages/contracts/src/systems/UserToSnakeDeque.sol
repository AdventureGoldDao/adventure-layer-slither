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

        // 手动移动数组元素，删除第一个元素
        for (uint i = 1; i < gameUserSnakeBody[msg.sender].length; i++) {
            gameUserSnakeBody[msg.sender][i - 1] = gameUserSnakeBody[msg.sender][i];
        }
        gameUserSnakeBody[msg.sender].pop(); // 移除最后一个元素
      }
      return _d;
  }

  function getSnakeBodyByPlayer(address player) public view returns (Position[] memory) {
    return gameUserSnakeBody[player];
  }

  function getHeaderPosByPlayer(address player) public view returns (Position memory) {
    return gameUserSnakeBody[player][0];
  }
  
  function moveSnakeByPositon(address player, Position memory newHeadPosition) public {
      //TOOD 完善
      gameUserSnakeBody[player].push(newHeadPosition);
      
  }

}
