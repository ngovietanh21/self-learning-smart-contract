// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./utils/Context.sol";
import "./access_control/AccessControl.sol";
import "./IBEP20.sol";
import "./utils/SafeMath.sol";

contract MyToken is Context, IBEP20, AccessControl {
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
        _name = "MYToken";
        _symbol = "MYT";
        _decimals = 18;
        _totalSupply = 1000000000000000000000000;
        
        _setRoleAdmin(ADMIN, ADMIN);
        _setRoleAdmin(DIRECTOR, ADMIN);
        _setRoleAdmin(DEPUTY_DIRECTOR, ADMIN);

        _owner = _msgSender();
        _grantRole(ADMIN, _owner);
        _balances[_owner] = _totalSupply;
        
        emit Transfer(address(0), _owner, _totalSupply);
    }

    function totalSupply() external override view returns (uint256) {
        return _totalSupply;
    }

    function decimals() external override view returns (uint8) {
        return _decimals;
    }

    function symbol() external override view returns (string memory) {
        return _symbol;
    }

    function name() external override view returns (string memory) {
        return _name;
    }

    function getOwner() external override view returns (address) {
        return _owner;
    }

    function balanceOf(address account) external override view returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external override view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "BEP20: transfer amount exceeds allowance"));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "transfer from the zero address");
        require(recipient != address(0), "transfer to the zero address");

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