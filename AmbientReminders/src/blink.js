var Blink1 = require('node-blink1');
var color = require('onecolor');

// create blink(1) object without serial number, uses first device:
var blink1 = new Blink1();
blink1.version(function (v) {
	console.log("Found blink1 with version", v);
});

/*
var i = 0;
var j = 0;
var k  = 0;
setInterval(function ()
{
	console.log("heartbeat");
	blink1.fadeToRGB(1000, i, j, k, function()
	{
		blink1.fadeToRGB(100, 0,0,0);
	});
	if (i < 255){ i = i + 5}
	else if (i == 255 && j < 255){ j += 5 }
	else if (i == 255 && j == 255 && k < 255){ k += 5 }
}, 100);
*/


//policeCar();
var r = 255;
var b = 0;
var rbbr = "rb";
function policeCar() {
	setInterval(function () {
		//blink1.fadeToRGB(10, r, 0, b);
		blink1.setRGB(r, 0, b);
		if (rbbr == "rb") {
			r -= 255;
			b += 255;
			if (b == 255) { rbbr = "br"; }
		}
		else if (rbbr == "br") {
			r += 255;
			b -= 255;
			if (r == 255) { rbbr = "rb"; }
		}
	}, 100);
}

//Flashes(10, 1000, "#ff0000");
//SlowPulse(10, "#00ff00");
//FastPulse(10, "#0000ff");
function SlowPulse (n, color){
	Flashes(n, 5000, color);
}

function FastPulse (n, color){
	Flashes(n, 1000, color);
}

/**
* TODO: pass a HSL color instead using onecolor
*
* @param n -> (int) Number of pulses
* @param interval -> (int) Speed of pulses
* @param color -> (String) String Hex
**/
function Flashes(n, interval, color) {
	var r = parseInt(color.substring(1,3), 16);
	var g = parseInt(color.substring(3,5), 16);
	var b = parseInt(color.substring(5,7), 16);

	if(n == 0)
		return;

	blink1.fadeToRGB(interval, r, g, b, function (){
		 blink1.fadeToRGB(interval, 0, 0, 0, function(){
			 Flashes(n-1, interval, color)
		 });
	});
}




function activate(start, end, rateOfChange) {
	if (rateOfChange == "linear") { Linear(start, end); }
	else if (rateOfChange == "log") { Log(start, end); }
	else if (rateOfChange == "sinusoidal") { Sinusoidal(start, end); }
}

/**
* TODO: Impleamanting 3 methods... (Linear, Log, Sinusoidal)
**/
function Linear(start, end){ }
function Log(start, end){ }
function Sinusoidal(start, end){ }


function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

// cleanup
function exitHandler(options, err) {
	if (err) {
		console.log(err.stack);
		process.exit();
	}
	else {
		console.log("closing");
		blink1.setRGB(0, 0, 0, function () {
			process.exit();
		});
	}
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

function sleep(miliseconds) {
	return function (){
		var currentTime = new Date().getTime();
		while (currentTime + miliseconds >= new Date().getTime()) { }
	}
}
