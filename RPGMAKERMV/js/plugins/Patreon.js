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
* @desc Allows compatibility with HTML exported games. Note: this will disable one-step authentication.
* @default false
* @type boolean
* @on Enable
* @off Disable

*/
var parameters = PluginManager.parameters('Patreon')
var EmailContentSupport = parameters['email']
var AppNameContentSupport = parameters['AppName']
var ContentSupportResult;
var server;
const url = `https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKER`

async function OpenContentSupportOneStep(){
    var input = parameters['UserInputVariable'];
    var EnabledHTML = parameters['Browser-Support']
    if(EnabledHTML == 'true'){
        $gameVariables.setValue(input, 2);
        OpenContentSupportTwoStep();
    }else{
        $gameVariables.setValue(input, 1);
        GetPatronOneStep();
    }
}

async function OpenContentSupportTwoStep(){
    var input = parameters['UserInputVariable'];
    console.log( $gameVariables.value(input))
    var EnabledHTML = parameters['Browser-Support']
    if(EnabledHTML == 'true'){
        ContentSupportOpenWindow();
    }else{
        ContentSupportOpenBrowser();
    }
}

async function ContentSupportOpenBrowser(){
    require('nw.gui').Shell.openExternal(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERONESTEP`);
}

async function ContentSupportOpenWindow(){
    var win = window.open(`https://patreonsupport.herokuapp.com/ContentSupport/Patreon/Authorize/${EmailContentSupport}/${AppNameContentSupport}/RPGMAKERONESTEP`, '_blank');
    win.focus();
}

async function GetPatronOneStep(){
    var EnabledHTML = parameters['Browser-Support']
    if(EnabledHTML == 'true'){
        ContentSupportTwoStepBrowser();
    }else{
        ContentSupportOneStep();
    }
}

async function GetPatronTwoStep(){
    var EnabledHTML = parameters['Browser-Support']
    if(EnabledHTML == 'true'){
        ContentSupportTwoStepBrowser();
    }else{
        ContentSupportTwoStepNode();
    }
}

async function ContentSupportOneStep(){
    console.log("hi");
    var input = parameters['UserInputVariable'];
    var express = require('express');
    var request = require('request');
    const app = express();
    const port = process.env.PORT || 80;
    require('nw.gui').Shell.openExternal(`http://localhost:80`);
    app.get('/', function(req, res) {
        res.redirect(url);
    });

    app.get('/RPGMAKER/:id', async function(req, res){

        id = req.params.id;
        console.log(id);
        await request.get({
            headers: {'Application' : '$2b$10$u8rfVeLereL3J/wwstgd3eH.dgIG4bf.5j0mnBLvKgAgX583J7mrm'},
            url:     `https://patreonsupport.herokuapp.com/GETContentSupport/RPGMAKER/${EmailContentSupport}/${AppNameContentSupport}/${id}`,
            body:    "RPGMAKER"
          },function(error, response, body){
            ContentSupportResult = body;
              res.redirect('/finished')
              if(isNaN(ContentSupportResult)){
                ContentSupportResult = 0;
              }
          });

      });

      app.get('/finished', async function(req, res){
          console.log("Finished result", ContentSupportResult);
          res.redirect('https://patreonsupport.herokuapp.com/finished');
          $gameVariables.setValue(input, 0);
          if(isNaN(ContentSupportResult)){
            ContentSupportResult = 0;
          }
          closeServer();
      });
    
    server = app.listen(port);
}

async function ContentSupportTwoStepNode(){
    var request = require('request');
    var input = parameters['UserInputVariable'];
    let userinput = $gameVariables.value(input);
    console.log(userinput);
    await request.get({
        headers: {'Application' : '$2b$10$u8rfVeLereL3J/wwstgd3eH.dgIG4bf.5j0mnBLvKgAgX583J7mrm'},
        url:     `https://patreonsupport.herokuapp.com/GETContentSupport/RPGMAKER/${EmailContentSupport}/${AppNameContentSupport}/${userinput}`,
        body:    "RPGMAKER"
      },function(error, response, body){
        ContentSupportResult= body;
          $gameVariables.setValue(input, 0);
          if(isNaN(ContentSupportResult)){
            ContentSupportResult = 0;
          }
      });
}

async function ContentSupportTwoStepBrowser(){
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