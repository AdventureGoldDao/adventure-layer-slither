import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  tables: {
    Counter: {
      schema: {
        player: "bytes32",
        curScore: "uint32",
        maxScore: "uint32",
      },
      key: ["player"],
    },
    Position: {
      schema: {
        player: "bytes32",
        x: "uint32",
        y: "uint32",
        m: "uint32",
      },
      key: ["player"]
    },
    Balance: {
      // 玩家地址 (用户的钱包地址)
      schema: {
        player: "address",
        value: "uint256",
      },
      // 数据模式：玩家的余额
      key: ["player"],
    },
  },
});

