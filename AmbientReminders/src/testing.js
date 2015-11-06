var Blink1 = require('node-blink1');
var color = require('onecolor');
var Promise = require('promise');
var schedule = require('node-schedule');
var moment = require('moment');
var later = require("later");


var sched = later.parse.recur().every(.1).minute();
var pulse = later.setInterval(function () {
    console.log(moment().toDate());
}, sched);