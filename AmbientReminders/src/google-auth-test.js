var google       = require('googleapis');
var urlshortener = google.urlshortener('v1');
var calendar     = google.calendar('v3');



// JWT-based authenication
var key = require('./Blink-Cal-ebfb705f33e6.json');
var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key,
  ['https://www.googleapis.com/auth/calendar.readonly',
   'https://www.googleapis.com/auth/urlshortener'], 
  null);



// get API token (which is still good for like an hour)
jwtClient.authorize(function(err, tokens) 
{
  if (err) 
  {
    console.log(err);
    return;
  }

  // Perform simple service call:  Get the long url of a shortened url
  var params = { shortUrl: 'http://goo.gl/xKbRu3', auth: jwtClient };
	urlshortener.url.get(params, function (err, response) 
	{
	  	if (err) 
	  	{
		    console.log('Encountered error', err);
  		} 
  		else 
  		{
    		console.log('Long url is', response.longUrl);
  		}
	});

  // Perform more difficult service call - calendar event.
  var params = { calendarId: 'primary', auth: jwtClient };
  calendar.events.list(params, function (err, response)
  {
      if (err) 
      {
        console.log('Encountered error', err);
      } 
      else 
      {
        console.log('Events', response);
      }
  });

});

