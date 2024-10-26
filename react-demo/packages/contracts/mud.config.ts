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

