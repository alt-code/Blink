var ical = require('ical');
var fs   = require('fs');

var data = fs.readFileSync('./test-data/parnin.ics');
var cal = ical.parseICS(data.toString());

for (var key in cal)
{
	if (cal.hasOwnProperty(key)) 
	{
		var evt = cal[key];
		if( evt.start )
		{
			console.log( evt.summary, evt.start );
		}
	}
}