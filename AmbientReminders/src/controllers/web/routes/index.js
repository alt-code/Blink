var express = require('express');
var router = express.Router();

var Blink1 = require('node-blink1');

var blink1 = new Blink1();
blink1.version(function(v) {
    console.log("Found blink1 with version", v);
});





/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { 'title': 'Blink1' });
});

router.post('/Blink/on', function (req, res, next) {
  res.render('index', { 'title': 'Blink1' });
  blink1.setRGB(255,0,0);
});

router.post('/Blink/off', function (req, res, next) {
  res.render('index', { 'title': 'Blink1' });
  blink1.setRGB(0,0,0);
});

module.exports = router;
