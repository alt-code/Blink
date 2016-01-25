//var blink = require('./blink.js')
var xml2js = require('xml2js');
var parser = new xml2js.Parser({trim: true});
var Blink1 = require('node-blink1');
var blink1 = new Blink1();
blink1.version(function(v) {
    console.log("Found blink1 with version", v);
});
//blink.policeCar();



var s = require('net').Socket();
s.bufferSize = 4096;
s.connect(4242, '127.0.0.1',
function()
{
	console.log("Connected");


	//s.write('<SET ID="ENABLE_SEND_CURSOR" STATE="1" />\r\n');
	//s.write('<SET ID="ENABLE_SEND_TIME" STATE="1" />\r\n');

	//s.write('<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n');
	//s.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');

	//s.write('<SET ID="CALIBRATE_SHOW" STATE="1" />\r\n');
	//s.write('<SET ID="CALIBRATE_START" STATE="1" />\r\n');

	//s.write('<SET ID="ENABLE_SEND_COUNTER" STATE="1" />\r\n');
	//s.write('<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n');
	//s.write('<SET ID="ENABLE_SEND_USER_DATA" STATE="1" />\r\n');

	//s.write('<SET ID="CALIBRATE_SHOW" STATE="1" />\r\n');
	//s.write('<SET ID="CALIBRATE_START" STATE="1" />\r\n');
	//s.write('<SET ID="TRACKER_DISPLAY" STATE="1" />\r\n');

    s.write('<SET ID="ENABLE_SEND_PUPIL_LEFT" STATE="1" />\r\n');
	//s.write('<SET ID="ENABLE_SEND_EYE_LEFT" STATE="1" />\r\n');

	s.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');
	//s.write('<GET ID="ENABLE_SEND_DATA"/>\r\n');

});

s.on('data', function(d){
	//console.log(s.bytesRead);

    //console.log(d.toString());
	parser.parseString(d, function(err, data) {

        if( data.REC && data.REC.hasOwnProperty("$") )
        {
            var x = data.REC.$.LPV;
			console.log(x);
			checkBlink(x);
        }
        //console.log(data.REC["$"].LPV);
    })

});
function checkBlink(y){
    if (y === "0") {
        blink1.setRGB(255,255,255);
    } else {
        blink1.setRGB(0, 0, 0);
    }
}

s.on('error', function(error){
    console.log(error());
});


s.on('close', function ()
{
	console.log("closed");
});
