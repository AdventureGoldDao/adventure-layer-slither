import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  tables: {
    Counter: {
      schema: {
        player: "address",
        value: "uint32",
      },
      key: ["player"],
    },
  },
});
