var xml2js = require('xml2js');
var parser = new xml2js.Parser({trim: true});
var fs = require('fs');
var date = new Date();
var Blink1 = require('node-blink1');
var blink1 = new Blink1();
var simpleTimer = require('node-timers/simple');
var simple = simpleTimer();
var fileName = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
    '(' + date.getHours() + 'h' + date.getMinutes() + 'm)';
var wstream = fs.createWriteStream('./data/' + fileName + '.txt');
var s = require('net').Socket();
var i = 60000;
s.bufferSize = 4096;
simple.start();
s.connect(4242, '127.0.0.1',
function()
{
	console.log("Connected");

    s.write('<SET ID="ENABLE_SEND_EYE_LEFT" STATE="1" />\r\n');
    s.write('<SET ID="ENABLE_SEND_PUPIL_LEFT" STATE="1" />\r\n');
    s.write('<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n');
	s.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');

});
var array = [];
var startBlink = false;
var begin = 0;
var end = 0;
var averageTime = 0;
var totalTime = 0;
var numberInts = 0;
s.on('data', function(d){
    var time = simple.time() + '';
    parser.parseString(d, function(err, data) {

        if( data.REC && data.REC.hasOwnProperty("$") )
        {
            var diam = 1000 * data.REC.$.LPUPILD + '';
            var lpv = data.REC.$.LPV + '';
            var eyeX = data.REC.$.FPOGX;
            var eyeY = data.REC.$.FPOGY;
            if(lpv == 1) {
                if(startBlink == false) {
                    begin = time;
                    startBlink = true;
                }
                end = time;
            } else {
                totalTime += (end - begin);
                numberInts += 1;
                startBlink = false;
            }
            if(time > i) {
                i += 60000;
                averageTime = totalTime / numberInts;
                light(averageTime);
                startBlink = false;
            }
            console.log(lpv);
            console.log(time);
            wstream.write(lpv + '\t' + time + '\t' + diam + '\t' + eyeX + '\t' + eyeY + '\r\n');
        }

    })
});

function light(blink) {
    if (blink > 4000) {
        blink1.setRGB(255,0,0);
    } else {
        blink1.setRGB(0, 255, 0);
    }
}
