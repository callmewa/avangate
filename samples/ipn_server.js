/**
 * Created by zwang on 1/17/14.
 *
 * IPN PROCESSING SERVER
 *
 * process and confirm IPN requests from avangate
 * via POST url /ipn
 */


var http = require('http');
var common = require('../lib/common');
var ipn = require('../lib/ipn').initWithKey("YOUR_SECRET_KEY");

// add handler for Validated IPNs
ipn.on(ipn.EVENTS.VALIDATED,
  function(ipn){
    console.log("Validate:\n" + JSON.stringify(ipn, null, 2));
  });

// add handler for rejected IPNs
ipn.on(ipn.EVENTS.REJECTED,
  function(ipn){
    console.log("Rejected:\n" + JSON.stringify(ipn, null, 2));
  });

exports.app = function(req, res){

  switch(req.method){
    case 'POST':
      switch(req.url){
        case '/':
          break;
        case '/ipn':
          ipn.confirmIpn(req, res);
          break;
      }
      break;
    case 'GET':
      switch(req.url){
        case '/':
          common.sendHtml(res, "OK");
          break;
        case '/ipn':
          common.sendHtml(res, "OK");
          break;
      }
      break;
  }

};

//setup server
var server = http.createServer(exports.app);
process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err.stack , err);
});

var port = 3000;
server.listen(port, function() {
  console.log("Server listening on port {port}.".replace('{port}', port));
  });
