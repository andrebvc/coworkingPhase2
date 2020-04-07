/*
*@name: Coworking Web App Phase 2
*@Course Code:SODV1201
*@class: Software Development Diploma Program.
*@author: Andre Albuquerque.
*/

// Require the modules
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require("path");
const port = 3000;

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(__dirname + '/'));

app.listen(port, () => console.log('Example app listening on port ' + port))


// GET methods for all the pages
app.get('/index.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/index.html'))
});

app.get('/Users.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/Users.html'))
});

app.get('/OwnersDetails.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/OwnersDetails.html'))
});

app.get('/ListProperties.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/ListProperties.html'))
});

app.get('/Manage.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/Manage.html'))
});

app.get('/ManageProperties.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/ManageProperties.html'))
});

app.get('/Workspaces.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/Workspaces.html'))
});

app.get('/ManageWorkspaces.html', (req, res) => { 
    res.sendFile(path.join(__dirname, '/ManageWorkspaces.html'))
});



// Check if a file containing the registered properties and workspaces exists or not
var existsUsers = fs.existsSync('users.json');
var existsProperties = fs.existsSync('properties.json');
// var existsWorkspaces = fs.existsSync('workspaces.json');

if (existsUsers) { // Read the users file
    console.log('Loading users file...');
    var mydata = fs.readFileSync('users.json', 'utf8');
    // Parse it back to object
    usersObject = JSON.parse(mydata);
    } else {
    // If non existant, create the array object
    console.log('Created users object')
    var usersObject = { users: [] };
}

if (existsProperties) { // Read the properties file
    console.log('Loading properties file...');
    var mydata2 = fs.readFileSync('properties.json', 'utf8');
    // Parse it back to object
    propertiesObject = JSON.parse(mydata2);
    } else {
    // If non existant, create the array object
    console.log('Created properties object')
    var propertiesObject = { properties: [] };
}

///// Register Users /////
app.post('/Users.html', urlencodedParser, registerUser);

function registerUser(req,res){
    response = {
        user:req.body.username,
        useremail:req.body.email,
        telephone:req.body.phone,
        userpassword:req.body.password,
        reg:req.body.register
    }
    if(req.body.register == "0"){
        var usertype = "User";
    }
    else var usertype = "Owner";

    usersObject.users.push ( { 
        User:req.body.username,
        userEmail:req.body.email,
        phoneNumber:req.body.phone,
        userPassword:req.body.password,
        userType:usertype
    });
      //convert JS object to JSON format
      let data = JSON.stringify(usersObject, null, 2);  
      fs.writeFile('users.json', data, finished);
      console.log('users.JSON has been updated')
      function finished(err){}

    return res.redirect('/Users.html');

}

///// Add properties /////
app.post('/Manage.html', urlencodedParser, addProperty);

function addProperty(req,res){
    response = {
        user:req.body.username,
        property:req.body.propertyname,
        propaddress:req.body.address,
        propneighborhood:req.body.neighborhood,
        area:req.body.squarefeet,
        hasgarage:req.body.garage,
        publictransport:req.body.transport,
    }
    
    let tempOwner = req.body.username;
    let tempPassword = req.body.password;
    let isOwner = false;

    for (let i = 0; i < usersObject.users.length; i++){ // Traverse the users JSON object
        if (usersObject.users[i].User == tempOwner && usersObject.users[i].userPassword == tempPassword){
            if (usersObject.users[i].userType == "Owner"){
                isOwner = true;
                console.log("Property added.");
                break;
            }
            else{ 
                console.log("User is not an Owner.");
                break;
            } 
            
        }
    }
    
    if(isOwner == true)
    {
        propertiesObject.properties.push ( { 
            user:req.body.username,
            property:req.body.propertyname,
            propaddress:req.body.address,
            propneighborhood:req.body.neighborhood,
            area:req.body.squarefeet,
            hasgarage:req.body.garage,
            publictransport:req.body.transport,
            workspaces:[]
        });
        //convert JS object to JSON format
        let data = JSON.stringify(propertiesObject, null, 2);  
        fs.writeFile('properties.json', data, finished);
        console.log('properties.JSON has been updated')
        function finished(err){}
        
    }else{
        // Write here if User or Password is wrong
        console.log("Incorrect Username and/or Password");
        
    }
    return res.redirect('/Manage.html');
}

///// Add Workspaces /////
app.post('/Workspaces.html', urlencodedParser, addWorkspace);

function addWorkspace(req,res){
    response = {
        owner:req.body.owner,
        property:req.body.propertyname,
        meetingrooms:req.body.meetingrooms,
        meetingroomsseats:req.body.meetingroomsseats,
        privaterooms:req.body.privaterooms,
        privateroomsseats:req.body.privateroomsseats,
        opendesks:req.body.opendesksseats,
        opendesksseats:req.body.opendesksseats,
        date:req.body.date,
        leaseterm:req.body.leaseterm,
        price:req.body.price
    }
    
    let tempOwner = req.body.owner;
    let tempPassword = req.body.password;
    let tempPropertyName = req.body.propertyname;
    let isOwner = false;
    let j = 0;
    for (let i = 0; i < usersObject.users.length; i++){ // Traverse the users JSON object
        
        if (usersObject.users[i].User == tempOwner && usersObject.users[i].userPassword == tempPassword && usersObject.users[i].userType == "Owner"){
            
            for (j; j < propertiesObject.properties.length; j++){ // Traverse the properties object
                
                if (tempOwner == propertiesObject.properties[j].user && tempPropertyName == propertiesObject.properties[j].property){
                    isOwner = true;
                    console.log("Workspaces added.");
                    break;
                }
            }
        }
        if(isOwner){
        break;
        }
    }
    console.log(req.body.smoke);
    if(isOwner){
        if(req.body.smoke == "yes"){
        
            propertiesObject.properties[j].workspaces.push ( { 
                id:propertiesObject.properties[j].workspaces.length+1,
                owner:req.body.owner,
                property:req.body.propertyname,
                meetingrooms:req.body.meetingrooms,
                meetingroomsseats:req.body.meetingroomsseats,
                privaterooms:req.body.privaterooms,
                privateroomsseats:req.body.privateroomsseats,
                opendesks:req.body.opendesksseats,
                opendesksseats:req.body.opendesksseats,
                smoking: "Yes",
                date:req.body.date,
                leaseterm:req.body.leaseterm,
                price:req.body.price
        });}
        else{
            propertiesObject.properties[j].workspaces.push ( { 
                id:propertiesObject.properties[j].workspaces.length+1,
                owner:req.body.owner,
                property:req.body.propertyname,
                meetingrooms:req.body.meetingrooms,
                meetingroomsseats:req.body.meetingroomsseats,
                privaterooms:req.body.privaterooms,
                privateroomsseats:req.body.privateroomsseats,
                opendesks:req.body.opendesksseats,
                opendesksseats:req.body.opendesksseats,
                smoking: "No",
                date:req.body.date,
                leaseterm:req.body.leaseterm,
                price:req.body.price
            });}
        
        //convert JS object to JSON format
        let data = JSON.stringify(propertiesObject, null, 2);  
        fs.writeFile('properties.json', data, finished);
        console.log('properties.JSON has been updated')
        function finished(err){}
    }else{
        // Write here if User or Password is wrong
        console.log("Not able to add the workspace. Check for username, password, property name and Owner capabilities.");
    }
      return res.redirect('/Workspaces.html');
}

///// Remove Properties /////
app.post('/ManageProperties.html', urlencodedParser, removeProperties);

function removeProperties(req,res){
    response = {
        owner:req.body.username,
        password:req.body.password,
        property:req.body.propertyname
    }
    let tempOwner = req.body.username;
    let tempPassword = req.body.password;
    let tempPropertyName = req.body.propertyname;
    let isOwner = false;
    let j = 0;

    for (let i = 0; i < usersObject.users.length; i++){ // Traverse the users JSON object
        
        if (usersObject.users[i].User == tempOwner && usersObject.users[i].userPassword == tempPassword && usersObject.users[i].userType == "Owner"){
            
            for (j; j < propertiesObject.properties.length; j++){ // Traverse the properties object
                
                if (tempOwner == propertiesObject.properties[j].user && tempPropertyName == propertiesObject.properties[j].property){
                    isOwner = true;
                    console.log("Property removed.");
                    break;
                }
            }
        }
        if(isOwner){
        break;
        }
    }
    if(isOwner){
        propertiesObject.properties[j].property = "deleted";
        propertiesObject.properties[j].user = "deleted";

        //convert JS object to JSON format
        let data = JSON.stringify(propertiesObject, null, 2);  
        fs.writeFile('properties.json', data, finished);
        console.log('properties.JSON has been updated')
        function finished(err){}
    }else{
        // Write here if User or Password is wrong
        console.log("Not able to find property or credentials are incorrect.");
    }
      return res.redirect('/ManageProperties.html');

}

///// Remove Workspaces /////
app.post('/ManageWorkspaces.html', urlencodedParser, removeWorkspaces);

function removeWorkspaces(req,res){
    response = {
        owner:req.body.username,
        password:req.body.password,
        property:req.body.id
    }
    let tempOwner = req.body.username;
    let tempPassword = req.body.password;
    let tempPropertyName = req.body.propertyname;
    let tempID = req.body.id;
    console.log("Temp ID = " + tempID);
    let isOwner = false;
    let i = 0;
    let j = 0;
    let k = 0;
    let check = "deleted";
    for (i; i < usersObject.users.length; i++){ // Traverse the users JSON object
        
        if (usersObject.users[i].User == tempOwner && usersObject.users[i].userPassword == tempPassword && usersObject.users[i].userType == "Owner"){
            console.log("First Check.");
            for (j; j < propertiesObject.properties.length; j++){ // Traverse the properties object
                
                if (tempOwner == propertiesObject.properties[j].user && tempPropertyName == propertiesObject.properties[j].property){
                    console.log("Second check");
                    for (k; k < propertiesObject.properties[j].workspaces.length; k++){
                        if(propertiesObject.properties[j].workspaces[k].id == tempID){
                            isOwner = true;
                            propertiesObject.properties[j].workspaces[k].id = check;
                            console.log("Workspace removed.");
                            break;
                        }
                    }
                }
            }
        }
        if(isOwner){
        break;
        }
    }
    if(isOwner){
       
        //convert JS object to JSON format
        let data = JSON.stringify(propertiesObject, null, 2);  
        fs.writeFile('properties.json', data, finished);
        console.log('properties.JSON has been updated')
        function finished(err){}
    }else{
        // Write here if User or Password is wrong
        console.log("Not able to find property/workspace or credentials are incorrect.");
    }
      return res.redirect('/ManageWorkspaces.html');

}
