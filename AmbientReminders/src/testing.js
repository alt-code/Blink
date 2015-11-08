var Blink1 = require('node-blink1');
var color = require('onecolor');
var Promise = require('promise');
var schedule = require('node-schedule');
var moment = require('moment');
var later = require("later");


// var sched = later.parse.recur().every(.1).minute();
// var pulse = later.setInterval(function () {
//     console.log(moment().toDate());
// }, sched);

// var tools = require('./blink');
// tools.FastPulse(10, "#ff0000", 1);

// var exec = require('child_process').exec,
//     child;


// child = exec('node blink.js',
//   function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });
// 

// module.exports = moment;

var sched = later.parse.recur().every(1.5).minute();

console.log(moment().toDate());
var pulse = later.setInterval(function() {
        console.log(console.log(moment().toDate()));
}, sched);