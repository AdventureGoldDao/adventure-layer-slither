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
  },
});

