import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  tables: {
    Users: {
      schema: {
        player: "address",
        score: "uint32",
        username: "string",
      },
      key: ["player"],
    },
    GameCodeToGameState: { //整个游戏的状态
      schema: {
        gameCode: "uint32",
        players: "address[]",
      },
      key: ["gameCode"],
    },
    Balance: {
      schema: {
        player: "address",
        value: "uint256",
      },
      key: ["player"],
    },
    UserAccountMapping: {
      schema: {
        player: "address",
        account: "string",
      },
      key: ["player"],
    },
    PrivateKeyMapping: {
      schema: {
        privateKey: "bytes32",
        player: "address",
      },
      key: ["privateKey"],
    },
  },
});

