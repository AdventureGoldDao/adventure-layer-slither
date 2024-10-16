import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    OrbSize: ["SMALL", "LARGE"],
  },
  tables: {
    Users: {
      schema: {
        player: "address",
        username: "bytes32",
        gameCode: "bytes32",
        score: "uint32",
      },
      key: ["player"],
    },
    GameCodeToGameState: { //整个游戏的状态
      schema: {
        gameCode: "bytes6",
        players: "address[]",
        leaderboard: "uint32[]",
        orbs: "bytes32[]", //房间里的所有星星 [{position:{x:1,y:2},color:"",orbSize:""}]
      },
      key: ["gameCode"],
    },
    UserToOthersPositions:{ //将每个用户映射到其他玩家的蛇身部位的位置集合
      schema: {
        gameCode: "bytes6",
        snakes: "bytes32[]",
      },
      key: ["gameCode"]
    },
    UserToOwnPositions: { //将每个用户映射到自己蛇身部位的位置集合
      schema: {
        player: "address",
        snake: "bytes32[]",// [{x:1,y:2},{x:2,y:2}...]
      },
      key: ["player"],
    },
    UserToSnakeDeque: { //将每个用户映射到其蛇身部位的双端队列，蛇的身体部位按顺序排列
      schema: {
        player: "address",
        snakeBody: "bytes32[]",// [{x:1,y:2},{x:2,y:2}...]
      },
      key: ["player"],
    },
    Balance: {
      schema: {
        player: "address",
        value: "uint256",
      },
      key: ["player"],
    },
  },
});

