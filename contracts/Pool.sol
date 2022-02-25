// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/Context.sol";
import "./access_control/AccessControl.sol";
import "./utils/SafeMath.sol";
import "./IBEP20.sol";

contract Pool is Context, AccessControl {
    IBEP20 private _token;

    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant DIRECTOR = keccak256("DIRECTOR");
    bytes32 public constant DEPUTY_DIRECTOR = keccak256("DEPUTY_DIRECTOR");

    constructor(IBEP20 token) {
        _token = token;

        _setRoleAdmin(ADMIN, ADMIN);
        _setRoleAdmin(DIRECTOR, ADMIN);
        _setRoleAdmin(DEPUTY_DIRECTOR, ADMIN);

        _grantRole(ADMIN, _token.getOwner());
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        _checkRequire(_msgSender(), amount);
        return _token.transfer(recipient, amount);
    }

    function _checkRequire(address sender, uint256 amount) private view {
        uint256 maxiumAmount = 0;
        bool requireMaxiumAmount = true;
        if (hasRole(DEPUTY_DIRECTOR, sender)) {
            requireMaxiumAmount = true;
            maxiumAmount = 1000;
        }
        if (hasRole(ADMIN, sender) || hasRole(DIRECTOR, sender)) {
            requireMaxiumAmount = false;
        }
        if (requireMaxiumAmount) {
            if (maxiumAmount == 0) {
                revert("Cannot tranfer money");
            }
            require(amount <= maxiumAmount, "Cannot tranfer maxium amount");
        }
    }
}