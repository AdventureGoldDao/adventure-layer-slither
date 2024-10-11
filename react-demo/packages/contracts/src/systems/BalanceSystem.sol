// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { Balance } from "../codegen/index.sol";

contract BalanceSystem is System {

    address public owner;
    uint256 public gameFee = 0.01 ether; // define game fee

    event GameStartedRecharge(address indexed player);
    event GamePlayedDeduct(address indexed player);

    // constructor(uint256 _gameFee) {
    constructor() {
        owner = msg.sender;
        // gameFee = _gameFee; // init game fee
    }

    // Player pay and start game
    function startGame() public payable {
        require(msg.value >= gameFee, "Insufficient funds to start the game");

        // transfer to owner
        payable(owner).transfer(gameFee);

        // if (msg.value > gameFee) {
        //     payable(msg.sender).transfer(msg.value - gameFee);
        // }

        // Start Game...
        rechargeBalance(msg.sender, gameFee);

        emit GameStartedRecharge(msg.sender);
    }

    // query contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // query player contract balance
    function getPlayerBalance(address player) public view returns (uint256) {
        uint256 currentBalance = Balance.get(player);
        return currentBalance;
    }

    // query current sender balance
    function getCurrentBalance() public view returns (uint256) {
	address player = address(_msgSender());
        uint256 currentBalance = Balance.get(player);
        return currentBalance;
    }

    // set game fee
    function setGameFee(uint256 newFee) public {
        require(msg.sender == owner, "Only owner can set game fee");
        gameFee = newFee;
    }

    // deduct balance
    function deductBalance(address player, uint256 amount) public {
        // get player balance
        uint256 currentBalance = Balance.get(player);
        require(currentBalance >= amount, "Insufficient balance");

        // update balance
        Balance.set(player, currentBalance - amount);
    }

    // define recharge
    function rechargeBalance(address player, uint256 amount) public {
        // get current player balance
        uint256 currentBalance = Balance.get(player);
        // require(currentBalance >= amount, "Insufficient balance");

        // update balance
        Balance.set(player, currentBalance + amount);
    }

    // Example
    function payForGame(uint256 gf) public {
        address player = address(this);
        // deduct
        deductBalance(player, gf);

        // start...
        emit GamePlayedDeduct(player);
    }
}