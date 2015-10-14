var Blink1 = require('node-blink1');
var color = require('onecolor');
var moment = require('moment');
var schedule = require('node-schedule');
var later = require("later");

/**
 * onecolor usage example:
 * get RGB hex and then implicitly convert it to HSL and set lightness.
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
    "skyblue1": "#87CEFF",
    "red": "#FF0000",
    "pink": "#FF00FF",
    "purple": '#C300C3',
    "cyan": "#00FFFF",
    "blue": "#0000FF",
    "light_blue": "#80D8FF",
    "green": "#00FF00",
    "yellow": "#FFEB3B",
    "amber": "#FFC107",
    "orange": "#FF9800",
    "deep_orange": "#FF3D00"
};


// create blink(1) object without serial number, uses first device:
var blink1 = new Blink1();
blink1.version(function (v) { console.log("Found blink1 with version", v); });

/**
 * Simulating police car lights
 */
function policeCar() {
    var r = 255;
    var b = 0;
    var rbbr = "rb";
    setInterval(function () {
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
// policeCar();


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

    blink1.fadeToRGB(fadeMillis, r, g, b, ledn, function () {
        blink1.fadeToRGB(fadeMillis, 0, 0, 0, ledn, function () {
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
// SlowPulse(5, palette.steelblue1, 1);


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
// FastPulse(5, palette.cadmiumlemon, 1, 2);


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
        blink1.setRGB(0, 0, 0, function () {
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
    return function () {
        var currentTime = new Date().getTime();
        while (currentTime + miliSeconds >= new Date().getTime()) { }
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


//******************************** SCHEDULING **********************************↓

// TODO:    1 - A̶d̶d̶ ̶m̶o̶r̶e̶ ̶p̶a̶t̶t̶e̶r̶s̶
//          2 - Rank patters
//          3 - Implement 4 methods... (exponential, linear, log, sinusoidal)


/**
 * Activate Blink(1) for the time interval and with the chosen rate of change
 * @param  {int} interval     interval in seconds(for now - testing)
 * @param  {String} rateOfChange "exponential", "linear", "log", "sinusoidal"
 */
function activate(interval, rateOfChange) {
    if (rateOfChange == "linear") {
        linear(interval);
    } else if (rateOfChange == "log") {
        log(interval);
    } else if (rateOfChange == "sinusoidal") {
        sinusoidal(interval);
    } else if (rateOfChange === "exponential") {
        exponential(interval);
    }
}
activate(20, "exponential")


/**
 * Exponentially activates during the given interval
 * @param  {int} interval     interval in seconds(for now - because testing)
 */
function exponential(interval) {
    var start = moment();
    var exp = 1.1;
    var count = Math.floor(Math.log(interval) / Math.log(exp));
    console.log(count);

    while (Math.floor(exp) < interval) {
        var now = moment();
        now.add(interval - Math.floor(exp), 's');
        count -= 1;

        schedule.scheduleJob(now.toDate(), function () {
            Flashes(2, 200, getColorLinear(start, moment(), interval), 1);
            // Flashes(2, 200, getColorExp(1.1, interval, count), 1);
            console.log("Hi there!" + " Color: " + getColorLinear(start, moment(), interval));
        });

        exp *= 1.1;
        console.log("Pulse at: " + now.toDate() + " Color: " + getColorLinear(start, now, interval));
    }
}


function linear() {
    var later = require("later");
    var sched = later.parse.recur().every(10).second();
    later.setTimeout(function () {
        console.log(new Date());
    }, sched);
}

// function linear(interval) {
//     var l = 20;
//     var n = Math.floor(interval / l);
//     var now = moment();
//     Flashes(2, 500, palette.green, 1);
//     for (var index = 0; index < n; index++) {
//         schedule.scheduleJob(now.add(l, 's').toDate(), function () {
//             Flashes(1, 500, palette.blue, 1);
//             console.log("Hi!");
//         });
//         console.log("Pulse at: " + now.toDate());
//     }
// }

// linear();

function log(interval) { }

function sinusoidal(interval) { }


//******************************** HELPER FUNCTIONS **********************************↓

/**
 * Finds out the needed color for exponential function, first 33.33% of the interval Green,
 *  second 33.33% of the interval Yellow, last 33.33% of the interval Red
 * 
 * @param {Number} double
 * @param {int} interval length in seconds
 * @return {hex} color needed for linear function
 */
function getColorExp(exp, interval, count) {
    var n = Math.log(interval) / Math.log(exp);
    if (count < n / 3) {
        return palette.green;
    }
    else if (count < 2 * n / 3) {
        return palette.yellow;
    }
    else {
        return palette.red;
    }
}


/**
 * Finds out the needed color for linear function, first 33.33% of the interval Green,
 *  second 33.33% of the interval Yellow, last 33.33%  of the interval Red
 * 
 * @param {moment} start a moment object
 * @param {moment} now a moment object
 * @param {int} interval length in seconds
 * @return {hex} color needed for linear function
 */
function getColorLinear(start, now, interval) {
    if (now.diff(start, 'seconds') < interval / 3) {
        return palette.green;
    }
    else if (now.diff(start, 'seconds') < 2 * interval / 3) {
        return palette.yellow;
    }
    else {
        return palette.red;
    }
}
