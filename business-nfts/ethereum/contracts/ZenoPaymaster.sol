// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@opengsn/contracts/src/BasePaymaster.sol";

contract ZenoPaymaster is BasePaymaster {
    address public signer;

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
    external
    override
    virtual
    returns (bytes memory context, bool revertOnRecipientRevert) {
        (signature, maxPossibleGas);

        require(approvalData.length == 65, "invalid approvalData signature");

        bytes32 requestHash = getRequestHash(relayRequest);
        require(signer == ECDSA.recover(requestHash, approvalData), "wrong approvalData signature");

        return ("", false);
    }

    function getRequestHash(GsnTypes.RelayRequest calldata relayRequest) public pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                packForwardRequest(relayRequest.request),
                packRelayData(relayRequest.relayData)
            )
        );
    }

    function packForwardRequest(IForwarder.ForwardRequest calldata req) public pure returns (bytes memory) {
        return abi.encode(req.from, req.to, req.value, req.gas, req.nonce, req.data);
    }

    function packRelayData(GsnTypes.RelayData calldata d) public pure returns (bytes memory) {
        return abi.encode(d.gasPrice, d.pctRelayFee, d.baseRelayFee, d.relayWorker, d.paymaster, d.paymasterData, d.clientId);
    }

    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external override virtual {
        (context, success, gasUseWithoutPost, relayData);
    }

    function versionPaymaster() external view override virtual returns (string memory){
        return "2.2.0+opengsn.vpm.ipaymaster";
    }

    function setSigner(address _signer) public onlyOwner {
        signer = _signer;
    }
}