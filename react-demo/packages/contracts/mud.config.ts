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
  },
});

