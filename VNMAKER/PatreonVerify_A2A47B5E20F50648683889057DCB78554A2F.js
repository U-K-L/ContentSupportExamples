//Enter your email from the website here!
var EmailContentSupport = 'Kuroten01@gmail.com' 
//Enter the client name from the website here!
var AppNameContentSupport = 'ContentSupport'
//Set this to false to internal browser. Set to true to open external browser. SHOULD ALWAYS BE TRUE FOR HTML GAMES.
var EnabledHTML = true

//The global variable which will be used for the common event.
var ContentSupportInput = 2 //NOTE: It starts at 0. So this is 3. 
var ContentSupportAmount = 3;

///DO NOT TOUCH BELOW.....
var ContentSupportResult;
var ContentSupportUserID = 0;
const url = `https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKER`;
var ContentSupportCounter = 0;

async function OpenContentSupportOneStep(){
    ContentSupportCounter = 0;
    var input = ContentSupportInput;
    if(EnabledHTML == true){
        GameManager.variableStore.numbers[input] = 2;
        ContentSupportOpenWindowOneStep()
    }else{
        GameManager.variableStore.numbers[input] = 1;
        GetPatronOneStep();
    }
}

async function OpenContentSupportTwoStep(){
    ContentSupportCounter = 0;
    var input = ContentSupportInput;
    console.log(GameManager.variableStore.numbers[input]);

    if(EnabledHTML == true){
        ContentSupportOpenWindowTwoStep();
    }else{
        ContentSupportOpenBrowser();
    }
}

async function ContentSupportOpenBrowser(){
    require('nw.gui').Shell.openExternal(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERONESTEP`);
}

async function ContentSupportOpenWindowTwoStep(){
    var win = window.open(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERONESTEP`, '_blank');
    win.focus();
}

async function ContentSupportOpenWindowOneStep(){
    var win = window.open(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERNOSTEP`, '_blank');
    win.focus();
}

async function GetPatronOneStep(){
    if(EnabledHTML == false){
        require('nw.gui').Shell.openExternal(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERNOSTEP`);
    }
}

async function GetPatronTwoStep(){
    ContentSupportTwoStep();
}

async function ContentSupportGetIP(){
    var input = ContentSupportInput;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let {ip} = JSON.parse(this.responseText);
        if(ip && ContentSupportCounter < 3){
            console.log(ip);
            ContentSupportGetUserID(ip);
            ContentSupportCounter += 1;
        }
        else{
            GameManager.variableStore.numbers[input] = 0;
        }
    }
    };
    xhttp.open("GET", "https://api6.ipify.org?format=json", true);
    xhttp.send();
}


async function ContentSupportGetUserID(ip){
    var input = ContentSupportInput;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        if(isNaN(ContentSupportUserID)){
            ContentSupportUserID = -1;
        }
        else{
            console.log(this.responseText);
            ContentSupportUserID = this.responseText;
        }
    }
    };
    xhttp.open("POST", `https://patreonsupport.herokuapp.com/RPGMAKER/patreon/GetUserID/${ip}`);
    xhttp.send();
}

function ContentSupportReturnUserID(){
    return ContentSupportUserID;
}
async function ContentSupportOneStep(){
    console.log("Sent Request");
    console.log(ContentSupportUserID);
    var input = ContentSupportInput;
    url2 = `https://patreonsupport.herokuapp.com/GETContentSupport/RPGMAKER/${EmailContentSupport}/${AppNameContentSupport}/${ContentSupportUserID}`
    var xhttp = new XMLHttpRequest({mozSystem: true});

    xhttp.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){

        ContentSupportResult = this.responseText;
        if(isNaN(this.responseText)){
            ContentSupportResult = 0;
            GameManager.variableStore.numbers[input] = 0;
        }else{
            ContentSupportResult = this.responseText;
            GameManager.variableStore.numbers[input] = 0;
        }

        console.log("Request taken", this.responseText);
    }
}
    xhttp.open(`GET`, url2);
    xhttp.setRequestHeader('Application', '$2b$10$u8rfVeLereL3J/wwstgd3eH.dgIG4bf.5j0mnBLvKgAgX583J7mrm');
    xhttp.send();
}

async function ContentSupportTwoStep(){
    var input = ContentSupportInput;
    let userinput = GameManager.variableStore.numbers[input];
    console.log("Request started");
    url2 = `https://patreonsupport.herokuapp.com/GETContentSupport/RPGMAKER/${EmailContentSupport}/${AppNameContentSupport}/${userinput}`
    var xhttp = new XMLHttpRequest({mozSystem: true});
    xhttp.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){}
        console.log(this.responseText);
        ContentSupportResult = this.responseText;
        GameManager.variableStore.numbers[input] = 0;
        console.log("New variable values");
    }
    xhttp.open(`GET`, url2);
    xhttp.setRequestHeader('Application', '$2b$10$u8rfVeLereL3J/wwstgd3eH.dgIG4bf.5j0mnBLvKgAgX583J7mrm');
    xhttp.send();
}



function getPatronPledgedStatus(){
    var input = ContentSupportAmount;
    GameManager.variableStore.numbers[input] = ContentSupportResult;
}
