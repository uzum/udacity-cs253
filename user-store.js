/*jslint node:true*/
'use strict';

var SECRET = "secret";

var crypto = require('crypto');

var hash = function(text){
  var hmacStream = crypto.createHmac("sha256", SECRET);
  return text + "|" + hmacStream.update(text).digest("hex");
};

var hashWithSalt = function(password, salt){
  var hashStream = crypto.createHash("sha256");
  return hashStream.update(password + salt).digest("hex") + "|" + salt;
};

var randomSalt = function(){
  return Math.random().toString(36).substring(2, 7);
};

var uniqueUserId = 0;
var users = [];
module.exports = {
  create: function(user){
    uniqueUserId++;
    users.push({
      id: uniqueUserId,
      username: user.username,
      password: hashWithSalt(user.password, randomSalt())
    });
    return hash(String(uniqueUserId));
  },

  find: function(username, password){
    return users.filter(function(_user){
      if(_user.username === username){
        var salt = _user.password.split("|")[1];
        return hashWithSalt(password, salt) === _user.password;
      }
      return false;
    })[0] || null;
  },

  cookieValue: function(user){
    return hash(String(user.id));
  },
  
  verifyCookie: function(cookie){
    if(!cookie) return null;
    var components = cookie.split('|');
    if(cookie === hash(components[0])){
      return users.filter(function(user){
        return user.id === Number(components[0]);
      })[0] || null;
    }
  },

  availableUsername: function(username){
    return users.every(function(user){
      return user.username !== username;
    });
  }
};