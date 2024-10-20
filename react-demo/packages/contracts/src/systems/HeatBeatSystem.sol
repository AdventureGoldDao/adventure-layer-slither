// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import {UserToSnakeDeque} from "../codegen/index.sol";
import {Position,Orb,GameState} from "../common.sol";
import {Users, UsersData, GameCodeToGameState} from "../codegen/index.sol";
import {UserToSnakeDequeSystem } from "./UserToSnakeDeque.sol";
import {GameStateSystem} from "./GameStateSystem.sol";
import {UsersSystem} from "./UsersSystem.sol";

contract HeatBeatSystem is System {
    uint256 constant SNAKE_CIRCLE_RADIUS = 10;
    int256 constant MAP_BOUNDARY = 1500;

    event UserDied(address user);
    event OrbEaten(address user, uint256 orbValue);
    event ScoreUpdated(address user, uint256 newScore);

    function moveSnake(uint32 gameCode,address player, Position memory newHeadPosition) public {
        //get original snake
        Position[] memory originalSnakeBody = UserToSnakeDequeSystem.getSnakeBodyByPlayer(player);
        require(originalSnakeBody.length > 0, "Snake does not exist");
        
        Orb[] memory orbs = GameStateSystem.getGameState(gameCode).orbs;
        require(orbs.length > 0, "Orbs does not exist");

        // Check boundary collision
        if (isOutOfBounds(newHeadPosition)) {
            killSnake(player);
            return;
        }

        // Check orb collision
        for (uint i = 0; i < orbs.length; i++) {
            if (distance(newHeadPosition, orbs[i].position) <= SNAKE_CIRCLE_RADIUS) {
                eatOrb(player, orbs[i]);
            }
        }
        // Move snake
        UserToSnakeDequeSystem.moveSnakeByPositon(player,newHeadPosition);
    }

    function isOutOfBounds(Position memory pos) private pure returns (bool) {
        return pos.x <= -MAP_BOUNDARY || pos.x >= MAP_BOUNDARY || 
               pos.y <= -MAP_BOUNDARY || pos.y >= MAP_BOUNDARY;
    }

    function killSnake(address user) private {
        UsersSystem.removeUser(user);
        emit UserDied(user);
    }

    function eatOrb(address user, Orb memory orb) private {
        uint256 orbValue = orb.isLarge ? 5 : 1;
        UsersSystem.updateUserScore(user, orbValue);
        emit OrbEaten(user, orbValue);
        emit ScoreUpdated(user, UsersSystem.getUserScore(user));
    }

    function distance(Position memory a, Position memory b) private pure returns (uint256) {
        int256 dx = a.x - b.x;
        int256 dy = a.y - b.y;
        return uint256(sqrt((dx * dx) + (dy * dy)));
    }

    function sqrt(int256 x) private pure returns (int256 y) {
        int256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function adventureHeatbeat() public {
        //遍历每个房间
        for(uint256 i=0; i< GameStateSystem.getGameState().length;i++){
            GameState memory gameState = GameStateSystem.getGameState()[i];
            address[] memory players = GameCodeToGameState.getPlayers(gameState.gameCode);
            //遍历每个房间的玩家
            for (uint256 i = 0; i < players.length; i++) {
                address player = players[i];
                Position memory newHeadPosition  = UserToSnakeDequeSystem.getHeaderPosByPlayer(player);
                moveSnake(gameState.gameCode,player,newHeadPosition);
            }
        }
    }
}
