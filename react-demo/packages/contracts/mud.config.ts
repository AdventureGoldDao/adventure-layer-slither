import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  enums: {
    OrbSize: ["SMALL", "LARGE"]
  },
  tables: {
    Users: {
      schema: {
        player: "address",
        score: "uint32",
        status: "uint8",
        username: "string",
      },
      key: ["player"],
    },
    OrbLists:{
      schema: {
        id: "uint16",
        x: "int32",
        y: "int32",
        orbSize: "OrbSize",
        color: "string",
      },
      key: ["id"],
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

