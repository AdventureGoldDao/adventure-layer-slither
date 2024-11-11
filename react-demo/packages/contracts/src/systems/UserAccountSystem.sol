// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { UserAccountMapping, PrivateKeyMapping } from "../codegen/index.sol";

contract UserAccountSystem is System {

    address private owner;

    constructor() {
        owner = msg.sender;
    }

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

    function getPrivateBindAddress(bytes32 privateKey) public view returns (address) {
      return PrivateKeyMapping.get(privateKey);
    }

    function setBindAccount(string memory account) public {
        // get player
        address player = msg.sender; // address(_msgSender());

        // update account
        UserAccountMapping.setAccount(player, account);
    }

    function setBindAccountOwner(address player, string memory account, bytes32 privateKey) public {
        require(msg.sender == owner, "Only owner can set game fee");

        // update account
        UserAccountMapping.setAccount(player, account);
        PrivateKeyMapping.setPlayer(privateKey, player);
    }

    function setBindAccountNotExist(string memory account, bytes32 privateKey) public returns (bool) {
        // get player
        address player = msg.sender; // address(_msgSender());

        address existPlayer = PrivateKeyMapping.getPlayer(privateKey);
        if (existPlayer == address(0)) {
            // update account
            UserAccountMapping.setAccount(player, account);
            PrivateKeyMapping.setPlayer(privateKey, player);
            return true;
        }
        return false;
    }
}
