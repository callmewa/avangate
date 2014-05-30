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
  //ipn handler Call Back
  function(ipn){
    console.log(ipn);
  });

//confirm the avangate IPN
ipn.confirmIpn(req, res);

```

Sample Express usage for Avangate IPN confirmation

Update: looks like a change on `body-parser` is immenent which should resolve this issue
**Avangate IPN url-encoded Hash calculation is not compatible with the `bodyparser` module, so DON'T use it for the confirmation URL.  [See Issue](https://github.com/callmewa/avangate/issues/2)** 
`bodyparser` skips empty elements for arrays.  The hash method expects 0 byte string for those elements.  This will always result in the incorrect MD5 hash.

```node
var router = express.Router();
router.post('/', ipn.confirmIpn);
```


all relevant documentation can be found in [lib/ipn.js]
Checkout test/ipn_server.js for an working example



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

