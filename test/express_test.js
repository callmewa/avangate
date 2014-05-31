/**
 * Created by zwang on 5/29/14.
 */
/**
 * Created by zwang on 5/29/14.
 */
var express = require('express');
var request = require('request');
var ipn = require('../lib/ipn').initWithKey("YOUR_SECRET_KEY");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/', ipn.confirmIpn);
app.listen(8888);




request.post('http://127.0.0.1:8888/', {form:{key:'value'}},
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the response
    }
  });

request.post('http://127.0.0.1:8888/', {json:{a:'b'}},
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the response
    }
  });