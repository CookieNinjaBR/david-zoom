//include required modules
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');

const express = require('express');
const app = express();
var cors = require('cors')
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
var email, userid, resp;
const port = 3005;

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);


//get the form 
app.get('/', (req,res) => res.send(req.body));

//use userinfo from the form and make a post request to /userinfo
app.post('/userinfo', (req, res) => {
  //store the email address of the user in the email variable
    email = req.body.email;
  //check if the email was stored in the console
  console.log(email);
  //Store the options for Zoom API which will be used to make an API call later.
  var options = {
    //You can use a different uri if you're making an API call to a different Zoom endpoint.
    uri: "https://api.zoom.us/v2/users/"+email, 
    qs: {
        status: 'active' 
    },
    auth: {
        'bearer': token
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
    },
    json: true //Parse the JSON string in the response
};

//Use request-promise module's .then() method to make request calls.
rp(options)
    .then(function (response) {
      //printing the response on the console
        console.log('User has', response);
        //console.log(typeof response);
        resp = response
        //Adding html to the page
        var title1 ='<center><h3>Your token: </h3></center>' 
        var result1 = title1 + '<code><pre style="background-color:#aef8f9;">' + token + '</pre></code>';
        var title ='<center><h3>User\'s information:</h3></center>' 
        //Prettify the JSON format using pre tag and JSON.stringify
        var result = title + '<code><pre style="background-color:#aef8f9;">'+JSON.stringify(resp, null, 2)+ '</pre></code>'
        res.send(result1 + '<br>' + result);
 
    })
    .catch(function (err) {
        // API call failed...
        console.log('API call failed, reason ', err);
    });
});

var corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.post("/newmeeting", cors(corsOptions), (req, res) => {
    email = "kazemarusora@gmail.com";
    // email = "dvdshinjo@gmail.com";
    var options = {
      method: "POST",
      uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
      body: {
        topic: "test create meeting",
        type: 1,
        settings: {
          host_video: "true",
          participant_video: "true"
        }
      },
      auth: {
        bearer: token
      },
      headers: {
        "Access-Control-Allow-Origin" : "*",
      },
      json: true //Parse the JSON string in the response
    };
  
    rp(options)
      .then(function(response) {
        console.log("response is: ", response);
        res.send("create meeting result: " + JSON.stringify(response));
      })
      .catch(function(err) {
        // API call failed...
        console.log("API call failed, reason ", err);
      });
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));