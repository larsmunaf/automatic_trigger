pragma solidity >0.4.23;
//pragma experimental ABIEncoderV2;

contract PositionTracking {

    struct position {
        uint x;
        uint y;
    }

    event PositionValue(address indexed _from, uint _value_x, uint _value_y);

    position public currentPos = position ({x:0, y:0});

    mapping (address => position) route;

    function setRandomPosition (uint pos_x, uint pos_y) public returns (uint) {
        currentPos = position ({x:pos_x, y:pos_y});
        emit PositionValue(msg.sender, pos_x, pos_y);
    }

    string message = "position has changed";

    function notify () public returns (string memory) {
        emit PositionValue(msg.sender, currentPos.x, currentPos.y);
        return message;
    }
}
