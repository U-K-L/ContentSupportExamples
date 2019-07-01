/*:
* @plugindesc Connects to your patreon account to check if player is pledged to you.
* @author U.K.L.
* @param email
* @desc Place your ContentSupport email inside this parameter.
* @default name@email.com
 @param AppName
* @desc Place your ContentSupport client name inside this parameter.
* @default name@email.com
 @param UserInputVariable
* @desc The variable to store user input.
* @default 3
* @type number
@param Browser-Support
* @desc Allows compatibility with HTML exported games. Recommended to use for HTML only.
* @default false
* @type boolean
* @on Enable
* @off Disable

*/
var parameters = PluginManager.parameters('Patreon')
var EmailContentSupport = parameters['email']
var AppNameContentSupport = parameters['AppName']
var ContentSupportResult;
var ContentSupportUserID = 0;
var server;
const url = `https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKER`
var ContentSupportCounter = 0;

async function OpenContentSupportOneStep(){
    var input = parameters['UserInputVariable'];
    var EnabledHTML = parameters['Browser-Support']
    if(EnabledHTML == 'true'){
        $gameVariables.setValue(input, 2);
        ContentSupportOpenWindowOneStep()
    }else{
        $gameVariables.setValue(input, 1);
        GetPatronOneStep();
    }
}

async function OpenContentSupportTwoStep(){
    ContentSupportCounter = 0;
    var input = parameters['UserInputVariable'];
    console.log( $gameVariables.value(input))
    var EnabledHTML = parameters['Browser-Support']

    if(EnabledHTML == 'true'){
        ContentSupportOpenWindowTwoStep()
    }else{
        ContentSupportOpenBrowser()
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
    var EnabledHTML = parameters['Browser-Support']
    if(EnabledHTML == 'false'){
        require('nw.gui').Shell.openExternal(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERNOSTEP`);
    }
}

async function GetPatronTwoStep(){
    ContentSupportTwoStep();
}

async function ContentSupportGetIP(){
    var input = parameters['UserInputVariable'];
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
            $gameVariables.setValue(input, 0);
        }
    }
    };
    xhttp.open("GET", "https://api6.ipify.org?format=json", true);
    xhttp.send();
}


async function ContentSupportGetUserID(ip){
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
    var input = parameters['UserInputVariable'];
    url2 = `https://patreonsupport.herokuapp.com/GETContentSupport/RPGMAKER/${EmailContentSupport}/${AppNameContentSupport}/${ContentSupportUserID}`
    var xhttp = new XMLHttpRequest({mozSystem: true});

    xhttp.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){

        ContentSupportResult = this.responseText;
        if(isNaN(this.responseText)){
            ContentSupportResult = 0;
            $gameVariables.setValue(input, 0);
        }else{
            ContentSupportResult = this.responseText;
            $gameVariables.setValue(input, 0);
        }

        console.log("Request taken", this.responseText);
    }
}
    xhttp.open(`GET`, url2);
    xhttp.setRequestHeader('Application', '$2b$10$u8rfVeLereL3J/wwstgd3eH.dgIG4bf.5j0mnBLvKgAgX583J7mrm');
    xhttp.send();
}

async function ContentSupportTwoStep(){
    var input = parameters['UserInputVariable'];
    let userinput = $gameVariables.value(input);
    console.log("Request started");
    url2 = `https://patreonsupport.herokuapp.com/GETContentSupport/RPGMAKER/${EmailContentSupport}/${AppNameContentSupport}/${userinput}`
    var xhttp = new XMLHttpRequest({mozSystem: true});
    xhttp.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){}
        console.log(this.responseText);
        ContentSupportResult = this.responseText;
        $gameVariables.setValue(input, 0);
        console.log("New variable values");
    }
    xhttp.open(`GET`, url2);
    xhttp.setRequestHeader('Application', '$2b$10$u8rfVeLereL3J/wwstgd3eH.dgIG4bf.5j0mnBLvKgAgX583J7mrm');
    xhttp.send();
}



function getPatronPledgedStatus(){
    return ContentSupportResult;
}

function closeServer(){

    server.close();
}
//initPatron();

//exports.data = requestContentSupport;