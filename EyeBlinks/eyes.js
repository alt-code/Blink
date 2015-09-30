var blink = require('./blink.js')
var xml2js = require('xml2js');
var parser = new xml2js.Parser({trim: true});
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
		console.log(data.REC.$.LPV);
	})

});

s.on('error', function(error){
    console.log(error());
});


s.on('close', function ()
{
	console.log("closed");
});
