var Blink1 = require('node-blink1');


// create blink(1) object without serial number, uses first device:
var blink1 = new Blink1();
blink1.version(function (v) {
	console.log("Found blink1 with version", v);
});
/*
blink1.fadeToRGB(10000, 255, randomInt(0,255), randomInt(0,255), function() 
{
	blink1.setRGB(0,0,0);
});
*/
/*
var i = 0;
var j = 0;
var k  = 0;
setInterval(function () 
{
	console.log("heartbeat");
	
	blink1.fadeToRGB(10000, i, j, k, function() 
	{
		//blink1.setRGB(0,0,0);
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

Flashes(3, 'g');

function Flashes(n, color) {
	var c = 0;	
	var r = 0; // default
	var g = 0; // default
	var b = 0; // default
	if (color == 'r'){ r = 255;}
	else if (color == 'g'){ g = 255; }
	else if (color == 'b'){ b = 255; }
	else if (color == 'y'){ r = 255; g = 255; }
	else { r = 255; g=255; b == 255; }

	while (c < n) {
		//blink1.fadeToRGB(500,r,g,b, function () {blink1.fadeToRGB(500, 0, 0, 0, Flashes(n-1, color));});  //trying to make it recursive
		blink1.setRGB(r, g, b, sleep(500));
		blink1.setRGB(0, 0, 0, sleep(500));		
		c++;
	}
	//return ;
}




function activateLinear(start, end) {

}



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

           		while (currentTime + miliseconds >= new Date().getTime()) {
           		}
		   }
		   
       }