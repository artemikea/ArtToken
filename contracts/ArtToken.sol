// SPDX-License-Identifier: unlicensed
pragma solidity ^0.8.7;

import "./IArtToken.sol";
import "./Ownable.sol";

contract ArtToken is Ownable {
    string public _name = "ArtToken";
    string public _symbol = "AT";
    uint8 public _decimals = 18;
    uint256 public _totalSupply = 1000000000000000000000000;
    mapping (address => uint256) public _balance;
    mapping (address => mapping (address => uint256)) public _allowed;

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return _balance[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_balance[msg.sender] >= _value, "not enough balance");
        _balance[msg.sender] -= _value;
        _balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function mint(address _to, uint256 _value) public virtual onlyOwner {
        require(_to != address(0));
        _totalSupply += _value;
        _balance[_to] += _value;
        emit Transfer(address (0), _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_allowed[_from][msg.sender] >= _value && _balance[_from] >= _value, "try better");
        _balance[_to] += _value;
        _balance[_from] -= _value;
        _allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to,_value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return _allowed[_owner][_spender];
    }

    receive() external payable {
        emit Received(owner(), msg.value);
        uint256 amount = msg.value / 100;
        _balance[msg.sender] += amount;
        _totalSupply += amount;
        emit Transfer(address (0), msg.sender, amount);
    }

    function sendViaCall(address payable _to) public payable onlyOwner {
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    event Received(address, uint);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}
