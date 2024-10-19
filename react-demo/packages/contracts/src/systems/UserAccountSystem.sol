// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { UserAccountMapping } from "../codegen/index.sol";

contract UserAccountSystem is System {

    function getBindAccount() public view returns (string memory) {
      address player = msg.sender; // address(_msgSender());
      string memory account = UserAccountMapping.getAccount(player);
      return account;
    }

    function setBindAccount(string memory account) public {
        // get player
        address player = msg.sender; // address(_msgSender());

        // update account
        UserAccountMapping.setAccount(player, account);
    }
}
