const fs = require ('fs');
const Web3 = require ('web3');
const copiedContractAbi = JSON.parse (fs.readFileSync ('../build/contracts/AutomaticHealing.json', 'utf-8'));

module.exports = function (callback) {
    var provider = new Web3.providers.WebsocketProvider ('ws://localhost:8546'),
        web3 = new Web3 (provider),
        account,
        contractInstance;

    web3.eth.getAccounts ().then (function (accounts) {
        account = accounts[1];
    }).then (function () {
        contractInstance = new web3.eth.Contract (copiedContractAbi.abi, copiedContractAbi.networks['15'].address); // use fixed address
    }).then (function () {
        /*contractInstance.events.allEvents ({}, function (err, event) {
            if (err) console.log ("error", err);
	    console.log ('asfdoikbsd', error);
        }).on ('data', function (event) {
            console.log ('score: ', event.returnValues['1'], '\n');
        }).on ('changed', function (event) {
            console.log ('changed', event);
        }).on ('error', function (event) {
            console.log ('event error', event);
        })*/
	contractInstance.events.anomalyScoreLowerThan50 ({}, (error, events) => {
	    console.log ('alarm: ', events.returnValues.score);
	})
    }).catch((e) => {
            console.error(e);
    });
}

module.exports ();
