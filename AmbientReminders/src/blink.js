var Blink1 = require('node-blink1');


// create blink(1) object without serial number, uses first device:
var blink1 = new Blink1();
blink1.version(function(v)
{
	console.log( "Found blink1 with version",	v);
});

blink1.fadeToRGB(10000, 255, randomInt(0,255), randomInt(0,255), function() 
{
	blink1.setRGB(0,0,0);
});

setInterval(function () 
{
	console.log("heartbeat");
	
	blink1.fadeToRGB(10000, 255, randomInt(0,255), randomInt(0,255), function() 
	{
		blink1.setRGB(0,0,0);
	});
}, 30000);

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// cleanup
function exitHandler(options, err) 
{
	if (err)
	{
		console.log(err.stack);
		process.exit();
	}
	else
	{
		console.log("closing");
		blink1.setRGB(0,0,0,function () 
		{
			process.exit();
		});
	}
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));