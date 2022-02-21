// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/Context.sol";
import "./access_control/AccessControl.sol";

contract MyToken is AccessControl {
    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant DIRECTOR = keccak256("DIRECTOR");
    bytes32 public constant DEPUTY_DIRECTOR = keccak256("DEPUTY_DIRECTOR");

    constructor() {
        _setRoleAdmin(ADMIN, ADMIN);
        _setRoleAdmin(DIRECTOR, ADMIN);
        _setRoleAdmin(DEPUTY_DIRECTOR, ADMIN);
        
        _grantRole(ADMIN, _msgSender());
    }
}