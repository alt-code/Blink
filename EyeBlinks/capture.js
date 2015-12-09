var xml2js = require('xml2js');
var parser = new xml2js.Parser({trim: true});
var fs = require('fs');
var date = new Date();
var simpleTimer = require('node-timers/simple');
var simple = simpleTimer();
var fileName = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
    '(' + date.getHours() + 'h' + date.getMinutes() + 'm)';
var wstream = fs.createWriteStream('./data/' + fileName + '.txt');
var s = require('net').Socket();
s.bufferSize = 4096;
simple.start();
s.connect(4242, '127.0.0.1',
function()
{
	console.log("Connected");
    //Gets blink data
    s.write('<SET ID="ENABLE_SEND_EYE_LEFT" STATE="1" />\r\n');
    //gets pupil diameter
    s.write('<SET ID="ENABLE_SEND_PUPIL_LEFT" STATE="1" />\r\n');
    //Gets fixation POG
    s.write('<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n');
	s.write('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n');

});
wstream.write('blink' + '\t' + 'time' + '\t' + 'pupil diam' + '\t' + 'eyeX' + '\t' + 'eyeY' + '\r\n');
s.on('data', function(d){
    var time = simple.time() + '';
    parser.parseString(d, function(err, data) {

        if( data.REC && data.REC.hasOwnProperty("$") )
        {
            var diam = 1000 * data.REC.$.LPUPILD + '';
            var lpv = data.REC.$.LPV + '';
            var eyeX = data.REC.$.FPOGX;
            var eyeY = data.REC.$.FPOGY;

            console.log(lpv);
            console.log(time);
            wstream.write(lpv + '\t' + time + '\t' + diam + '\t' + eyeX + '\t' + eyeY + '\r\n');
        }

    })
});
