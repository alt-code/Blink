var Blink1 = require('node-blink1');
var color = require('onecolor');

/**
 * colorone usage sample
 * 
 * How I am doing it:
 * get RGB first because it's the easiest to know what color we get and 
 * then implicitly convert it to HSV and set value.
 * -> Can use "red(), green(), blue(), hue(), saturation(), lightness(), value(), alpha()" getters/setters
 *
 * var cc = new color.RGB(255, 0, 0).
 * value(0.5). // Implicit conversion to HSV
 * hex(); // "#800000"
 */



// create blink(1) object without serial number, uses first device:
var blink1 = new Blink1();
blink1.version(function(v) {
    console.log("Found blink1 with version", v);
});

/*
var i = 0;
var j = 0;
var k  = 0;
setInterval(function ()
{
    console.log("heartbeat");
    blink1.fadeToRGB(1000, i, j, k, function()
    {
        blink1.fadeToRGB(100, 0,0,0);
    });
    if (i < 255){ i = i + 5}
    else if (i == 255 && j < 255){ j += 5 }
    else if (i == 255 && j == 255 && k < 255){ k += 5 }
}, 100);
*/



var r = 255;
var b = 0;
var rbbr = "rb";

function policeCar() {
    setInterval(function() {
        //blink1.fadeToRGB(10, r, 0, b);
        blink1.setRGB(r, 0, b);
        if (rbbr === "rb") {
            r -= 255;
            b += 255;
            if (b === 255) {
                rbbr = "br";
            }
        } else {
            r += 255;
            b -= 255;
            if (r === 255) {
                rbbr = "rb";
            }
        }
    }, 100);
}
//policeCar();


/**
 * Fades color from #000000 to Hex color and back to #000000 for n times
 * Note: values less than 0.4 seem to be laggy with fadeToRGB -- better use > 0.5
 * @param {int} n        number of pulses
 * @param {int} fadeMillis speed of pulses, ms
 * @param {String} color    Hex
 * @param {Number} value decimal indicating "Brightness" of Blink(1) 0-1
 * @param {Number} lightness decimal indicating lightness/darkness of LED color use 0.5-1 //not very useful? //less than 0.5 conflict with 'value'?
 */
function Flashes(n, fadeMillis, color, value, lightness) {
    //default values
    value = typeof value !== 'undefined' ? value : 1;
    lightness = typeof lightness !== 'undefined' ? lightness : 0.5;

    var r = hexToR_G_B(HSV_HSL_Converter(color, value, lightness))[0];
    var g = hexToR_G_B(HSV_HSL_Converter(color, value, lightness))[1];
    var b = hexToR_G_B(HSV_HSL_Converter(color, value, lightness))[2];

    if (n === 0) //base case
        return;

    blink1.fadeToRGB(fadeMillis, r, g, b, function() {
        blink1.fadeToRGB(fadeMillis, 0, 0, 0, function() {
            Flashes(n - 1, fadeMillis, color, value, lightness);
        });
    });
}
//Flashes(10, 1000, "#ff0000"); //Flashes(10, 1000, "#ff0000", 0.3);
//Flashes(10, 1000, "#ff0000", 0.3);
//Flashes(10, 1000, "#0000ff", 0.3, 0.8);


/**
 * One pulse every five seconds
 * @param {int} n     number of pulses
 * @param {String} color Hex
 * @param {Number} value decimal indicating "Brightness of Blink(1)"
 * @param {Number} lightness decimal indicating lightness/darkness of LED color use 0.5-1
 */
function SlowPulse(n, color, value, lightness) {
    Flashes(n, 5000, color, value, lightness);
}
//SlowPulse(5, "#00ff00"); //value = 1 by defalt
//SlowPulse(5, "#00ff00", 0.5);
//SlowPulse(5, "#00ff00", 1, 0.8);


/**
 * One pulse every second
 * @param {int} n     number of pulses
 * @param {String} color Hex
 * @param {Number} value decimal indicating "Brightness of Blink(1)"
 * @param {Number} lightness decimal indicating lightness/darkness of LED color use 0.5-1
 */
function FastPulse(n, color, value, lightness) {
    Flashes(n, 1000, color, value, lightness);
}
//FastPulse(10, "#0000ff"); //value = 1 by defalt
//FastPulse(10, "#0000ff", 0.5);
//FastPulse(5, "#0000ff", 1, 0.5);


/**
 * Activate Blink(1) for the time interval and with the chosen rate of change
 * @param  {int} interval     interval in minutes
 * @param  {String} rateOfChange "linear", "log", "sinusoidal"
 */
function activate(interval, rateOfChange) {
    if (rateOfChange == "linear") {
        linear(interval);
    } else if (rateOfChange == "log") {
        log(interval);
    } else if (rateOfChange == "sinusoidal") {
        sinusoidal(interval);
    }
}


// TODO: Impleamanting 3 methods... (linear, log, sinusoidal)
function linear(interval) {}

function log(interval) {}

function sinusoidal(interval) {}


function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

// cleanup
function exitHandler(options, err) {
    if (err) {
        console.log(err.stack);
        process.exit();
    } else {
        console.log("closing");
        blink1.setRGB(0, 0, 0, function() {
            process.exit();
        });
    }
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));

/**
 * Pause the for miliSeconds
 * @param  {Number} miliSeconds length of pause
 */
function sleep(miliSeconds) {
    return function() {
        var currentTime = new Date().getTime();
        while (currentTime + miliSeconds >= new Date().getTime()) {}
    }
}

/**
 * Convert RGB to HSV/HSL and set it's value and lightness
 * @param {String} RGBHex RGB color hex
 * @param {Number} value  this is a decimal 0-1 indicating value of HSV color
 * @param {Number} lightness this is a decimal 0-1 indicating lightness of HSL color / Better use 0.5-1
 * @return {String} HSV hex
 */
function HSV_HSL_Converter(RGBHex, value, lightness) {
    var c = new color(RGBHex).value(value).lightness(lightness).hex();
    return c;
}

/**
 * Assign Red, Green, Blue of a hex String to [R, G, B]
 * @param  {String} hex The hex value of color
 * @return {Array}     [Red, Green, Blue] of the color in RGB
 */
function hexToR_G_B(hex) {
    return [parseInt(hex.substring(1, 3), 16),
        parseInt(hex.substring(3, 5), 16),
        parseInt(hex.substring(5, 7), 16)
    ];
}