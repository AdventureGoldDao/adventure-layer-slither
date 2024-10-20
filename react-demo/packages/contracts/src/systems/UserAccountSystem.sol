// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { UserAccountMapping } from "../codegen/index.sol";

contract UserAccountSystem is System {

    function getBindAccount() public view returns (string memory) {
      address player = msg.sender; // address(_msgSender());
      return UserAccountMapping.getAccount(player);
      // return account;
    }

    function getBindAccountBy() public view returns (string memory) {
      address player = address(_msgSender());
      return UserAccountMapping.getAccount(player);
    }

    function getUserBindAccount(address player) public view returns (string memory) {
      return UserAccountMapping.get(player);
    }

    function setBindAccount(string memory account) public {
        // get player
        address player = msg.sender; // address(_msgSender());

        // update account
        UserAccountMapping.setAccount(player, account);
    }
}
