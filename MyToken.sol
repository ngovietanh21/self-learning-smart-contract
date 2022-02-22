// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/Context.sol";
import "./access_control/AccessControl.sol";
import "./IBEP20.sol";
import "./utils/SafeMath.sol";

contract BEP20Token is Context, IBEP20, AccessControl {
    using SafeMath for uint256;

    bytes32 public constant ADMIN = keccak256("ADMIN");
    bytes32 public constant DIRECTOR = keccak256("DIRECTOR");
    bytes32 public constant DEPUTY_DIRECTOR = keccak256("DEPUTY_DIRECTOR");

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    uint256 private _totalSupply;
    uint8 private _decimals;
    string private _symbol;
    string private _name;
    address private _owner;

    constructor() {
        // _name = {{TOKEN_NAME}};
        // _symbol = {{TOKEN_SYMBOL}};
        // _decimals = {{DECIMALS}};
        // _totalSupply = {{TOTAL_SUPPLY}};
        _setRoleAdmin(ADMIN, ADMIN);
        _setRoleAdmin(DIRECTOR, ADMIN);
        _setRoleAdmin(DEPUTY_DIRECTOR, ADMIN);

        _grantRole(ADMIN, _msgSender());
        _balances[_msgSender()] = _totalSupply;

        emit Transfer(address(0), _msgSender(), _totalSupply);
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function getOwner() external view returns (address) {
        return _owner;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "BEP20: transfer amount exceeds allowance"));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "transfer from the zero address");
        require(recipient != address(0), "transfer to the zero address");

        if (hasRole(DEPUTY_DIRECTOR, sender)) {
             require(amount < 1000, "DEPUTY_DIRECTOR maxium 1000");
        } else if (!hasRole(DIRECTOR, sender)) {
            revert("Cannot tranfer token");
        }
        _balances[sender] = _balances[sender].sub(amount, "transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "approve from the zero address");
        require(spender != address(0), "approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}