var Blink1 = require('node-blink1');
var color = require('onecolor');

/**
 * onecolor usage sample
 * 
 * How I am doing it:
 * get RGB first because it's the easiest to know what color we get and 
 * then implicitly convert it to HSL and set lightness.
 * -> Can use "red(), green(), blue(), hue(), saturation(), lightness(), value(), alpha()" getters/setters
 *
 * var cc = new color.RGB(255, 0, 0).
 * ligtness(0.5). // Implicit conversion to HSL
 * hex(); // "#800000"
 */

var palette = {
    "cadmiumlemon": "#FFE303",
    "darkolivegreen": "#556B2F",
    "cinnamon": "#7B3F00",
    "steelblue1": "#63B8FF",
    "skyblue1": "#87CEFF"
};


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

/**
 * Simulating police car lights
 */
function policeCar() {
    var r = 255;
    var b = 0;
    var rbbr = "rb";
    var ledn = 1;
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
 * @param {int} n        number of pulses
 * @param {int} fadeMillis speed of pulses, ms
 * @param {String} color    Hex
 * @param {Number} lightness color's lightness will be this percentage of initial lightness - use 0 (off)-1
 * @param {Number} ledn choose led number [optional]
 */
function Flashes(n, fadeMillis, color, lightness, ledn) {
    // default value
    lightness = typeof lightness !== 'undefined' ? lightness : 1;

    var r = hexToR_G_B(Lightnen(color, lightness))[0];
    var g = hexToR_G_B(Lightnen(color, lightness))[1];
    var b = hexToR_G_B(Lightnen(color, lightness))[2];

    if (n === 0) //base case
        return;

    blink1.fadeToRGB(fadeMillis, r, g, b, ledn, function() {
        blink1.fadeToRGB(fadeMillis, 0, 0, 0, ledn, function() {
            Flashes(n - 1, fadeMillis, color, lightness, ledn);
        });
    });

    //Old code:
    // blink1.fadeToRGB(fadeMillis, r, g, b, function() {
    //     blink1.fadeToRGB(fadeMillis, 0, 0, 0, function() {
    //         Flashes(n - 1, fadeMillis, color, lightness, ledn);
    //     });
    // }, ledn);
}
//Flashes(10, 1000, palette.skyblue1); //lightness = 1 by defalt
//Flashes(10, 1000, palette.skyblue1, 0.5);
//Flashes(10, 1000, palette.skyblue1, 1); //still can call Flashes without ledn
//Flashes(10, 1000, palette.skyblue1, 1, 2);


/**
 * One pulse every five seconds
 * @param {int} n     number of pulses
 * @param {String} color Hex
 * @param {Number} lightness color's lightness will be this percentage of initial lightness - use 0 (off)-1
 * @param {Number} ledn choose led number [optional]
 */
function SlowPulse(n, color, lightness, ledn) {
    Flashes(n, 5000, color, lightness, ledn);
}
//SlowPulse(5, palette.steelblue1); //lightness = 1 by defalt
//SlowPulse(5, palette.steelblue1, 0.5);
//SlowPulse(5, palette.steelblue1, 1);
//SlowPulse(5, palette.steelblue1, 1, 2);


/**
 * One pulse every second
 * @param {int} n     number of pulses
 * @param {String} color Hex
 * @param {Number} lightness color's lightness will be this percentage of initial lightness - use 0 (off)-1
 * @param {Number} ledn choose led number [optional]
 */
function FastPulse(n, color, lightness, ledn) {
    Flashes(n, 1000, color, lightness, ledn);
}
//FastPulse(10, palette.cadmiumlemon); //lightness = 1 by defalt
//FastPulse(10, palette.cadmiumlemon, 0.5);
//FastPulse(5, palette.cadmiumlemon, 1);
//FastPulse(5, palette.cadmiumlemon, 1, 2);


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


// TODO:    1 - A̶d̶d̶ ̶m̶o̶r̶e̶ ̶p̶a̶t̶t̶e̶r̶s̶
//          2 - Rank patters
//          3 - Implement 3 methods... (linear, log, sinusoidal)
function linear(interval) {}

function log(interval) {}

function sinusoidal(interval) {}

/**
 * Generate a random Number between low and high
 * @param  {Number} low
 * @param  {Number} high
 * @return {Number}      A random Number between low and high
 */
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
 * Pause the script for miliSeconds
 * @param  {Number} miliSeconds length of pause
 */
function sleep(miliSeconds) {
    return function() {
        var currentTime = new Date().getTime();
        while (currentTime + miliSeconds >= new Date().getTime()) {}
    }
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


/**
 * Reduce RGBHex's lightness to this percentage - use 0 (off)-1
 * @param {String} RGBHex  hex color (RGB)
 * @param {Number} percent reducing lightness of color to this percentage
 * @return {String} color hex
 */
function Lightnen(RGBHex, percent) {
    var L = new color(RGBHex).lightness();
    var c = new color(RGBHex).lightness(L * percent).hex();
    return c;
}