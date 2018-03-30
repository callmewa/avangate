/**
 * Created by zwang on 2/12/14.
 */


var crypto = require('crypto');
var util = require('util');
var moment = require('moment');
/**
 *
 * @param l
 * @param c
 * @returns {string}
 */
String.prototype.padRight = function(l,c) {return this+new Array(l-this.length+1).join(c||' ')}

//handles parsing req data and executes next step
/**
 * handles parsing req data and executes next step
 * @param req
 * @param cb
 */
exports.parseReceivedData = function(req, cb){
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){body += chunk});
  req.on('end', function(){
    cb(body);
  })
};

//write res with html
/**
 * send a html http response
 * @param res
 * @param html
 */
exports.sendHtml = function(res, html){
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
};

//write res with html
/**
 * send a json http response
 * @param res
 * @param json
 */
exports.sendJson = function(res, json){
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(json));
  res.end(json);
};


//write res with html
/**
 * send a json http error
 * @param res
 * @param json
 * @param errorCode
 */
exports.sendJsonError = function(res, json, errorCode){
  res.statusCode = errorCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(json));
  res.end(json);
};

//create md5 hash using key and src string
exports.createMd5Hash = function(key, src){
  var hmac = crypto.createHmac('md5', key);
  hmac.update(src);
  var hash = hmac.digest('hex');
  console.log(hash);
  return hash;
};

function prependByteLength(str){
  return Buffer.byteLength(str) + str;
}
exports.prependByteLength = prependByteLength;

function makeId(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 10; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
exports.makeId = makeId;

function tryParseJson(data){
  try{
    return JSON.parse(data);
  } catch (e){
    return data;
  }
}
exports.tryParseJson = tryParseJson;

function log(category, message, priority){
//"[c] d P : m "
  priority = priority ? priority : "INFO";

  var categoryDisplay = ('[' + category + ']').padRight(8);
  var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  var priorityDisplay = priority.padRight(6);

  console.log(util.format('%s %s %s : %s', categoryDisplay, date, priorityDisplay, message));
}

exports.log = log;


function logTrans(id, message, priority){
  log('TRANS', util.format('{%s} %s', id, message), priority);
}

exports.logTrans = logTrans;
