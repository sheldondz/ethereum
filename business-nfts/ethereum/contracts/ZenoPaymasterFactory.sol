// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "./ZenoPaymaster.sol";

contract ZenoPaymasterFactory {

    address public implementation;
    mapping(uint => address) private deployedPaymasters;

    event NewBusinessPaymaster(address wallet, address owner);

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function clone(address _implementation) internal returns (address instance) {
        bytes20 targetBytes = bytes20(_implementation);
        assembly {
            let ptr := mload(0x40)
            mstore(ptr,0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr,0x14), targetBytes)
            mstore(add(ptr,0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            instance := create(0, ptr, 0x37)
        }
        require(instance != msg.sender);
    }

    function createBusinessPaymasterContract(uint businessId) public  returns (address paymaster) {
        paymaster = clone(implementation);
        deployedPaymasters[businessId] = paymaster;
        emit NewBusinessPaymaster(paymaster, msg.sender);
    }

    function getDeployedPaymasters(uint businessId) public view returns (address) {
        require(businessId > 0, "invalid business id");
        return deployedPaymasters[businessId];
    }
}
