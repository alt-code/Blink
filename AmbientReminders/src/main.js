var ical = require('ical');
var fs   = require('fs');
var moment = require('moment');

var data = fs.readFileSync('./test-data/parnin.ics');
var cal = ical.parseICS(data.toString());

for (var key in cal)
{
	if (cal.hasOwnProperty(key)) 
	{
		var evt = cal[key];
		if( evt.start && moment(evt.start).isBetween(moment(), moment().add(3,'days')) )
		{
			console.log( evt.summary, evt.start );
		}
	}
}
