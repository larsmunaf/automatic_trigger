const fs = require ('fs');
const Web3 = require ('web3');
const copiedContractAbi = JSON.parse (fs.readFileSync ('../build/contracts/AutomaticHealing.json', 'utf-8'));

module.exports = function (callback) {
    var provider = new Web3.providers.WebsocketProvider ('ws://localhost:8546'),
        web3 = new Web3 (provider),
        account,
        contractInstance;

    web3.eth.getAccounts ().then (function (accounts) {
        account = accounts[0];
    }).then (function () {
        contractInstance = new web3.eth.Contract (copiedContractAbi['MyContract']['AutomaticHealing'].abi, '0xBb315A9a14DA97f8171Eb4FB1c41B524C2fe921B'); // use fixed address
    }).then (function () {
	console.log ('hallhalluu');
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
	contractInstance.getPastEvents ('anomalyScoreLowerThan50', {
	    fromBlock: 0,
	    toBlock: 'latest'
	}, (error, events) => {
	    console.log (events);
	    console.log (error);
	})
    }).catch((e) => {
            console.error(e);
    });
}

module.exports ();