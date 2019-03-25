const fs = require ('fs');
const Web3 = require ('web3');
const path = require ('path');
const anomalyScoreSenderSol = require (path.join(__dirname, '../build/contracts/AutomaticHealing.json'), 'utf-8');

module.exports = function (callback) {
    var provider = new Web3.providers.WebsocketProvider ('ws://localhost:8546');
    var web3 = new Web3(provider);
    
    console.log ('started...');

    /* set account, compile and execute our contract */
    web3.eth.getAccounts ().then (function (accounts) {
        account = accounts[0]; // deprecated, addresses must be used instead
    }).then (function () {
            compiledContractInstance = new web3.eth.Contract(anomalyScoreSenderSol.abi, anomalyScoreSenderSol.networks['15'].address); // use fixed address
	    //compiledContractInstance.options.address = newContractInstance.options.address
	    setInterval (setAnomalyScore, 2000);

	    function setAnomalyScore () {
       		var randAnomalyScore = Math.round (Math.random () * (200 - 0) + 0);
       		compiledContractInstance.methods.writeScoreIntoBlockchain (randAnomalyScore).send ({
        		from: account
        	}).on ('error', (err) => {console.log (err)});
        		console.log ('wrote anomaly score');
    		}

	    })
};

module.exports ();

