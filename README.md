avangate
========

Nodejs Avangate IPN confirmation

Usage:

```node
var ipn = require("avangate")
    .initWithKey("YOUR SECRET KEY");

// ipn directly extends [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter)
// add a handler for validated IPNs
ipn.on(ipn.EVENTS.VALIDATED,
  function(ipn){
    console.log("Validate:\n" + JSON.stringify(ipn, null, 2));
  });

// add handler for rejected IPNs
ipn.on(ipn.EVENTS.REJECTED,
  function(ipn){
    console.log("Rejected:\n" + JSON.stringify(ipn, null, 2));
  });


//confirm the avangate IPN
ipn.confirmIpn(req, res);

```

Sample Express usage for Avangate IPN confirmation


```node
//This requires body-parse version > 1.2.2
var express = require('express');
var ipn = require('../lib/ipn').initWithKey("YOUR SECRET KEY");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
//NOTE: this tells bodyParser to use the querystring modules instead of qs module
// this is required to parse Avangate IPNS
app.use(bodyParser.urlencoded({extended:false}));

app.post('/', ipn.confirmIpn);
app.listen(8888);
```


additional relevant documentation can be found in [lib/ipn.js]
Checkout [samples/ipn_server.js] and [[test/express_test.js] ] for an working examples



The secret key in this example is: AABBCCDDEEFF
For this example, the response is built in the same way, only using shorter data formats for date values. 
HMAC source string is built from the following:

Field name, Length, Field value

IPN_PID[0]
1
1

IPN_PNAME[0]
16
Software program

IPN_DATE
14
20050303123434

DATE
14
20050303123434

Therefore, the HMAC source string will be:

1116Software program14200503031234341420050303123434

while the HMAC MD5 string will be:

7bf97ed39681027d0c45aa45e3ea98f0

The response to output anywhere in the page defined as the IPN URL has to be:

<EPAYMENT>20050303123434|7bf97ed39681027d0c45aa45e3ea98f0</EPAYMENT>

If the string above is valid, and acknowledged by Avangate, the notification is marked in the Avangate system as "successfully sent".
Contrary to this situation, the IPN notification will be re-sent at increasing time intervals, until successfully confirmed. Also, an error notification will be displayed in the Control Panel Dashboard area.

