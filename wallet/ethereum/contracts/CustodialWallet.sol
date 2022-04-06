// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;


contract CustodialWallet {

    address owner;
    uint balance;
    bool public isBase = false;
    event DepositEvent(address _owner, uint amount, address _wallet);
    event WithdrawEvent(address _owner, uint amount, address _wallet);

    constructor() {
        isBase = true;
    }

    modifier onlyOwner {
        require(msg.sender == owner,"ERROR: Only owner can perforn this action!");
        _;
    }

    function initilize(address _owner, uint _balance) external {
        require(isBase == false,"ERROR: Base contract cannot be initilized!");
        require(owner == address(0) ,"ERROR: Base contract cannot be initilized!");
        owner = _owner;
        balance = _balance;
    }

    function transferTo(address _to, uint amount) public onlyOwner payable {
        require(balance > amount,"ERROR: in sufficient balance");
        balance = balance - amount;
        (bool success,) = _to.call{value: amount}("");
        require(success, "Failed to send Ether");
    }
}

