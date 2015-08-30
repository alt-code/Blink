# Blink

Runtime requires [node.js](https://nodejs.org/download/).

To install dependences, run: `npm install`, simple program running with `node main.js`.

### iCal

Played around real quick with getting google apis working. *For now*, it is far easier to just work with "ical" events. At best, the google api just gives you a big list of events anyway. It is way easier to test with iCal files or have users type in calendar urls in comparison to getting them and us to mess with `OAuth`.

Parsing is handling by:
https://www.npmjs.com/package/ical

[moment.js](http://momentjs.com/) is a great library for dealing with time, e.g., check if date is within three days of today:

```
moment(evt.start).isBetween(moment(), moment().add(3,'days'))
```

### Blink1

Looks like decent node.js client library for blink1 here:
https://www.npmjs.com/package/node-blink1
