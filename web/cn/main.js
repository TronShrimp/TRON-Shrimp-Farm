var modal
var modalContent
var lastNumEggs=-1
var lastNumShrimp=-1
var lastSecondsUntilFull=100
lastHatchTime=0
var eggstohatch1=864
var lastUpdate=new Date().getTime()
var modalID=0
function main(){
    // console.log('test')
    modal = document.getElementById('myModal');
    modalContent=document.getElementById('modal-internal')
    waitForTronWeb()
}
async function waitForTronWeb(){
    if (typeof(window.tronWeb) === 'undefined') {
        console.log('Waiting for tronWeb...');
        setTimeout(waitForTronWeb, 1000);
    } else {
        myContract = await tronWeb.contract().at(contractAddress);
        setTimeout(function(){
            controlLoop()
            controlLoopFaster()
        },1000);
    }
}
function controlLoop(){
    refreshData()
    setTimeout(controlLoop,2500)
}
function controlLoopFaster(){
    liveUpdateEggs()
    // console.log('clf')
    setTimeout(controlLoopFaster,30)
}

function stripDecimals(str, num){
	if (str.indexOf('.') > -1){
		var left = str.split('.')[0];
		var right = str.split('.')[1];
		return left + '.' + right.slice(0,num);
	}
	else {
		return str;
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 

function refreshData(){

    var balanceElem = document.getElementById('contractBal');
    
    contractBalance(function(result){
        rawStr = numberWithCommas(tronWeb.fromSun(result));
        balanceElem.textContent = '合约余额: ' + stripDecimals(rawStr, 1) + ' TRX';
    });

    var sellsforexampledoc=document.getElementById('sellsforexample')
    calculateEggSell(86400,function(sun){
        devFee(sun,function(fee){
            console.log('examplesellprice ',sun)
            sellsforexampledoc.textContent='1 个卵卖 ' + tronWeb.fromSun(sun) + ' TRX';
        });
    });
    lastHatch(tronWeb.defaultAddress['base58'],function(lh){
        lastHatchTime=lh
    });
    EGGS_TO_HATCH_1SHRIMP(function(eggs){
        eggstohatch1=eggs
    });
    getMyEggs(function(eggs){
        if(lastNumEggs!=eggs){
            lastNumEggs=eggs
            lastUpdate=new Date().getTime()
            updateEggNumber(eggs/eggstohatch1)//formatEggs(eggs))

        }
        var timeuntilfulldoc=document.getElementById('timeuntilfull')
        secondsuntilfull=eggstohatch1-eggs/lastNumShrimp
        console.log('secondsuntilfull ',secondsuntilfull,eggstohatch1,eggs,lastNumShrimp)
        lastSecondsUntilFull=secondsuntilfull
        timeuntilfulldoc.textContent=secondsToString(secondsuntilfull)
        if(lastNumShrimp==0){
            timeuntilfulldoc.textContent='?'
        }
    });
    getMyShrimp(function(shrimp){
        lastNumShrimp=shrimp
        var gfsdoc=document.getElementById('getfreeshrimp')
        if(shrimp>0){
            gfsdoc.style.display="none"
        }
        else{
            gfsdoc.style.display="inline-block"
        }
        var allnumshrimp=document.getElementsByClassName('numshrimp')
        for(var i=0;i<allnumshrimp.length;i++){
            if(allnumshrimp[i]){
                allnumshrimp[i].textContent=translateQuantity(shrimp)
            }
        }
        var productiondoc=document.getElementById('production')
        productiondoc.textContent=formatEggs(lastNumShrimp*60*60)
    });
    updateBuyPrice()
    updateSellPrice()
    var prldoc=document.getElementById('playerreflink')
    prldoc.textContent=window.location.origin+"?ref="+tronWeb.defaultAddress['base58']
    var copyText = document.getElementById("copytextthing");
    copyText.value=prldoc.textContent
}
function updateEggNumber(eggs){
    var hatchshrimpquantitydoc=document.getElementById('hatchshrimpquantity')
    hatchshrimpquantitydoc.textContent=translateQuantity(eggs,0)
    var allnumeggs=document.getElementsByClassName('numeggs')
    for(var i=0;i<allnumeggs.length;i++){
        if(allnumeggs[i]){
            allnumeggs[i].textContent=translateQuantity(eggs)
        }
    }
}
function hatchEggs1(){
    ref=getQueryVariable('ref')
    if (!tronWeb.isAddress(ref)){
        ref=tronWeb.defaultAddress['base58']
    }
    console.log('hatcheggs ref ',ref)
    hatchEggs(ref,displayTransactionMessage())
}
function liveUpdateEggs(){
    if(lastSecondsUntilFull>1 && lastNumEggs>=0 && lastNumShrimp>0 && eggstohatch1>0){
        currentTime=new Date().getTime()
        if(currentTime/1000-lastHatchTime>eggstohatch1){
            return;
        }
        difference=(currentTime-lastUpdate)/1000
        additionalEggs=Math.floor(difference*lastNumShrimp)
        updateEggNumber((lastNumEggs+additionalEggs)/eggstohatch1)//formatEggs(lastNumEggs+additionalEggs))
    }
}
function updateSellPrice(){
    var eggstoselldoc=document.getElementById('sellprice')
    //eggstoselldoc.textContent='?'
   getMyEggs(function(eggs){
        calculateEggSell(eggs,function(sun){
            devFee(sun,function(fee){
                console.log('sellprice ',sun)
                eggstoselldoc.textContent=formatTrxValue(tronWeb.fromSun(sun-fee))
            });
        });
   });
}

function updateBuyPrice(){
    var eggstobuydoc=document.getElementById('eggstobuy')
    var trxspenddoc=document.getElementById('ethtospend')
    suntospend = tronWeb.toSun(trxspenddoc.value)
    calculateEggBuySimple(suntospend,function(eggs){
        devFee(eggs,function(fee){
            eggstobuydoc.textContent=formatEggs(eggs-fee)
        });
    });
}
function buyEggs2(){
    var trxspenddoc=document.getElementById('ethtospend')
    suntospend = tronWeb.toSun(trxspenddoc.value)
    buyEggs(suntospend,function(){
        displayTransactionMessage();
    });
}
function formatEggs(eggs){
    return translateQuantity(eggs/eggstohatch1)
}
function translateQuantity(quantity,precision){
    quantity=Number(quantity)
    finalquantity=quantity
    modifier=''

    //console.log('??quantity ',typeof quantity)
    if(quantity>1000000){
        modifier='M'
        finalquantity=quantity/1000000
    }
    if(quantity>1000000000){
        modifier='B'
        finalquantity=quantity/1000000000
    }
    if(quantity>1000000000000){
        modifier='T'
        finalquantity=quantity/1000000000000
    }
    if(precision == undefined){
        precision=0
        if(finalquantity<10000){
            precision=1
        }
        if(finalquantity<1000){
            precision=2
        }
        if(finalquantity<100){
            precision=3
        }
        if(finalquantity<10){
            precision=4
        }
    }
    if(precision==0){
        finalquantity=Math.floor(finalquantity)
    }
    return finalquantity.toFixed(precision)+modifier;
}
function removeModal2(){
    $('#adModal').modal('toggle');
}
function removeModal(){
        modalContent.innerHTML=""
        modal.style.display = "none";
}
function displayTransactionMessage(){
    displayModalMessage("交易已提交")
}
function displayModalMessage(message){
    modal.style.display = "block";
    modalContent.textContent=message;
    setTimeout(removeModal,3000)
}
function weiToDisplay(trxprice){
    return formatTrxValue(tronWeb.toSun(trxprice))
}
function formatTrxValue(trxstr){
    return parseFloat(parseFloat(trxstr).toFixed(5));
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function copyRef() {
  var copyText = document.getElementById("copytextthing");
  copyText.style.display="block"
  copyText.select();
  document.execCommand("Copy");
  copyText.style.display="none"
  displayModalMessage("复制至剪贴板")
  //alert("Copied the text: " + copyText.value);
}

function secondsToString(seconds)
{
    seconds=Math.max(seconds,0)
    var numdays = Math.floor(seconds / 86400);

    var numhours = Math.floor((seconds % 86400) / 3600);

    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);

    var numseconds = ((seconds % 86400) % 3600) % 60;
    var endstr=""

    return numhours + "h " + numminutes + "m "//+numseconds+"s";
}
function disableButtons(){
    var allnumshrimp=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumshrimp.length;i++){
        if(allnumshrimp[i]){
            allnumshrimp[i].style.display="none"
        }
    }
    var allnumshrimp=document.getElementsByClassName('btn-md')
    for(var i=0;i<allnumshrimp.length;i++){
        if(allnumshrimp[i]){
            allnumshrimp[i].style.display="none"
        }
    }
}
function enableButtons(){
    var allnumshrimp=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumshrimp.length;i++){
        if(allnumshrimp[i]){
            allnumshrimp[i].style.display="inline-block"
        }
    }
        var allnumshrimp=document.getElementsByClassName('btn-md')
    for(var i=0;i<allnumshrimp.length;i++){
        if(allnumshrimp[i]){
            allnumshrimp[i].style.display="inline-block"
        }
    }
}
function onlyLetters(text){
    return text.replace(/[^0-9a-zA-Z\s\.!?,]/gi, '')
}
function checkOnlyLetters(str){
    var pattern=new RegExp('^[0-9a-zA-Z\s\.!?,]*$')
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
}
function onlyurl(str){
     return str.replace(/[^0-9a-zA-Z\.?&\/\+#=\-_:]/gi, '')
}
function validurlsimple(str){
    var pattern=new RegExp('^[a-z0-9\.?&\/\+#=\-_:]*$')
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
}
function ValidURL(str) {
  var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i'); // fragment locater
  if(!pattern.test(str)) {
    alert("Please enter a valid URL.");
    return false;
  } else {
    return true;
  }
}
function callbackClosure(i, callback) { 
    return function() {
        return callback(i); 
    } 
}