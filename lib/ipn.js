/**
 * Created by zwang on 1/17/14.
 */

var moment = require('moment');
var qs = require('querystring');
var common = require('./common'),
  prependByteLength = common.prependByteLength;
var EventEmitter = require('events').EventEmitter;


//make this an EventEmitter
exports = module.exports = new EventEmitter();

var avangateConfig = {
  key: "YOUR SECRET KEY"
};

var EVENTS = exports.EVENTS = {
  VALIDATED: 'validated'
};

/**
 * initialize lib with Avangate secret key
 * @param skey
 */
exports.initWithKey = function(skey){
  avangateConfig.key = skey;
  return this;
};

/**
 * req.body is the ipn object
 * @param req
 * @param res
 */
function confirmWithReply(req, res){
  //get ipn object from request body
  var ipn = req.body;
  console.log(ipn);

  //current Date in the YmdHis format. (ex: 20081117145935)
  var date = moment.utc().format("YYYYMMDDHHmmss");

  //create md5 hash for IPN
  var ipnHash = common.createMd5Hash(avangateConfig.key, exports.buildIpnSrc(ipn));

  //check if ipn has correct hash
  if(ipnHash === ipn["HASH"])
  {
    //emit json ipn to listeners
    exports.emit(EVENTS.VALIDATED, ipn);
    //confirm the IPN
    var hash = common.createMd5Hash(avangateConfig.key, exports.buildConfirmSrc(ipn, date));
    //construct confirmation response
    var msg = '<EPAYMENT>' + date + '|' + hash + '</EPAYMENT>';
    //return response message
    common.sendHtml(res, msg);
  }
  else{
    common.sendHtml(res, "Invalid Origin");
  }
}


/**
 * receives IPN order and confirms if IPN is valid
 * @param req
 * @param res
 */
exports.confirmIpn = function(req, res){
  //if express body parser is used
  if(req.body){
    confirmWithReply(req, res);
  }
  //else manually parse the data
  else{
    common.parseReceivedData(req, function(data){
      req.body = qs.parse(data);
      confirmWithReply(req, res);
    });
  }
};

/**
 * constructs the confirmation string src used for MD5 verification
 * @param srcObj
 * @param date
 * @returns {string}
 */
exports.buildConfirmSrc = function (srcObj, date){

  var obj = {
    IPN_PID : srcObj["IPN_PID[]"],
    IPN_PNAME : srcObj["IPN_PNAME[]"],
    IPN_DATE : srcObj.IPN_DATE,
    DATE: date
  };

  var srcStr = "";
  for(var field in obj){
    if(obj.hasOwnProperty(field)){
      console.log(Buffer.byteLength(obj[field]) + "|" +  field + " " + obj[field]);
      srcStr += prependByteLength(obj[field]);
    }
  }
  console.log(srcStr);
  return srcStr;
};


/**
 * construct the IPN source for MD5 hash
 * @param srcObj
 * @returns {string}
 */
exports.buildIpnSrc = function(srcObj){

  var srcStr = "";

  for(var field in srcObj){

    var value = "";
    //don't include the file HASH itself
    if (field === "HASH"){
      continue;
    }
    //if field is array capture all members
    if(Array.isArray(srcObj[field]))
    {
      value = srcObj[field].map(function(str){
        return prependByteLength(str);
      }).join("");
    }else{//is a string
      value = prependByteLength(srcObj[field]);
    }

    srcStr += value;
    console.log(field + " " + value);
  }
  console.log(srcStr);
  return srcStr;
};
