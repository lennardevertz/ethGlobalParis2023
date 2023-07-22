// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.16;

// This contract allows assertions on any form of data to be made using the UMA Optimistic Oracle V3 and stores the
// proposed value so that it may be retrieved on chain. The dataId is intended to be an arbitrary value that uniquely
// identifies a specific piece of information in the consuming contract and is replaceable. Similarly, any data
// structure can be used to replace the asserted data.

contract Registry {
    mapping(bytes32 => address) public owners;
    mapping(address => bool) private admins;
    address public contractOwner = msg.sender;

    event Register(bytes32 indexed userId);

    function setOracle(address oracleAddress) external {
        require(msg.sender == contractOwner, "Not the owner.");
        admins[oracleAddress] = true;
    }

    function addOwner(
        bytes32 userId,
        address asserter
    ) external {

        require(admins[msg.sender], "Not called by oracle.");
        
        owners[userId] = asserter;
        
        emit Register(userId);
    }

    // For a given assertionId, returns a boolean indicating whether the data is accessible and the data itself.
    function getRegistration(bytes32 userId) public view returns (address) {
        return owners[userId];
    }

}
