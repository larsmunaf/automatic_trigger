pragma solidity ^0.5.0;

contract AutomaticHealing {

//    constructor () public {
//        
//    }
    
    uint16 score;

    event anomalyScoreLowerThan50 (address indexed _from, uint16 score);

    function writeScoreIntoBlockchain (uint16 s) public
    {
        score = s;

        //if (score < 50)
        //{
        emit anomalyScoreLowerThan50 (msg.sender, score);
        //}
    }
}
