import { defineWorld } from "@latticexyz/world";

export default defineWorld({
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
      schema: {
        player: "address",
        value: "uint256",
      },
      key: ["player"],
    },
  },
});

