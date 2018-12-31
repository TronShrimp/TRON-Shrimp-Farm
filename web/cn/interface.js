contractAddress = 'TH3eYUrotXiAbEBbfjHvnxC3dQPA4ZbZWe';
var myContract;
var canSell = true;

function contractBalance(callback){
    tronWeb.trx.getBalance(contractAddress).then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function buyEggs(trx,callback){
    myContract.buyEggs().send({callValue: trx}).then(result => {
        callback();
    }).catch((err) => {
        console.log(err)
    });
}


function getFreeShrimp(callback){
    myContract.getFreeShrimp().send().then(result => {
        callback();
    }).catch((err) => {
        console.log(err)
    });
}


function hatchEggs(ref,callback){
    myContract.hatchEggs(ref).send().then(result => {
        callback();
    });
}


function sellEggs(callback){
    if (canSell) {
        canSell = false;
        console.log('Selling');
        myContract.sellEggs().send().then(result => {
            callback();
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot sell yet...')
    };
}


function calculateEggBuy(trx,contractBalance,callback){
    myContract.calculateEggBuy(trx,contractBalance).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}


function calculateEggBuySimple(trx,callback){
    myContract.calculateEggBuySimple(trx).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}


function calculateEggSell(eggs,callback){
    myContract.calculateEggSell(eggs).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function claimedEggs(callback){
    myContract.claimedEggs().call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}


function EGGS_TO_HATCH_1SHRIMP(callback){
    myContract.EGGS_TO_HATCH_1SHRIMP().call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function devFee(amount,callback){
    myContract.devFee(amount).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function getBalance(callback){
    myContract.getBalance().call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function getEggsSinceLastHatch(address,callback){
    myContract.getEggsSinceLastHatch(address).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}


function getMyEggs(callback){
    myContract.getMyEggs().call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function getMyShrimp(callback){
    myContract.getMyShrimp().call().then(result => {
        if (result == '0x') {
            result = 0;
        }
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function lastHatch(address,callback){
    myContract.lastHatch(address).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function marketEggs(callback){
    myContract.marketEggs().call().then(result => {
        console.log(result)
        console.log(tronWeb.toDecimal(result))
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}


