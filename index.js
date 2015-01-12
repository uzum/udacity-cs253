/*jslint node:true*/
'use strict';

var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use('/', require('./router'));

app.listen(3000);
