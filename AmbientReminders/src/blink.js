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

// create blink(1) object without serial number, uses first device:
var blink1 = new Blink1();
blink1.version(function (v) {
    console.log("Found blink1 with version", v);
});

// cleanup
function exitHandler(options, err) {
    if (err) {
        console.log(err.stack);
        process.exit();
    } else {
        console.log("closing");
        // blink1.setRGB(0, 0, 0, function () {
        //     process.exit();
        // });
        process.exit();
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

var args = process.argv.slice(2);
var type = args[0];
var length = args[1];

if (type === "linear") {
    linear(length);
} else if (type === "exponential") {
    exponential(length);
}

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

//******************************** PATTERS **********************************↓
/**
 * Simulating police car lights
 * @param  {number} interval [seconds]
 */
function policeCar(interval) {
    var r = 255;
    var b = 0;
    var rbbr = "rb";
    var pulse = setInterval(function () {
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

    var now = moment();
    schedule.scheduleJob(now.add(interval, 's').toDate(), function () {
        clearInterval(pulse);
        blink1.setRGB(0, 0, 0);
    });
}



/**
 * Fades color from #000000 to Hex color and back to #000000 for n times
 * @param {int} n        number of pulses
 * @param {int} fadeMillis speed of pulses, ms
 * @param {String} color    Hex
 * @param {Number} lightness color's lightness will be this percentage of initial lightness - use 0 (off)-1
 * @param {Number} ledn choose led number [optional]
 */
function Flashes(n, fadeMillis, color, lightness, ledn) {
    // default value: lightness = 1
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
}



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


//******************************** SCHEDULING **********************************↓
// TODO:    Ranking patters

/**
 * Activate Blink(1) for the time interval and with the chosen rate of change
 * @param  {int} interval     interval in seconds(for now - testing)
 * @param  {String} rateOfChange "exponential", "linear", "log", "sinusoidal"
 */
function activate(interval, rateOfChange) {
    if (rateOfChange == "linear") {
        linear(interval);
    } else if (rateOfChange == "sinusoidal") {
        sinusoidal(interval);
    } else if (rateOfChange === "exponential") {
        exponential(interval);
    }
}
// activate(20, "exponential")


/**
 * Exponentially activates during the given interval
 * @param  {int} interval     interval in seconds(for now - because testing)
 */
function exponential(interval) {
    var start = moment();
    var end = start.add(interval, 's');
    var exp = 1.1;
    var count = Math.floor(Math.log(interval) / Math.log(exp));
    console.log(count);

    while (Math.floor(exp) < interval) {
        var now = moment();
        now.add(interval - Math.floor(exp), 's');
        count -= 1;

        schedule.scheduleJob(now.toDate(), function () {
            Flashes(2, 200, generalGetColor(start, moment(), interval), 1);
            // Flashes(2, 200, getColorExp(1.1, interval, count), 1);
            console.log("Hi there!" + " Color: " + generalGetColor(start, moment(), interval));
        });

        exp *= 1.1;
        console.log("Pulse at: " + now.toDate() + " Color: " + generalGetColor(start, now, interval));
    }

    schedule.scheduleJob(end.toDate(), function () {
        // policeCar(5);        //I think this would work as well
        blink1.setRGB(255, 0, 0, function () {
            blink1.fadeToRGB(5000, 0, 0, 0);
        });
    });
}
// exponential(10);


//Note: interval is changed to minutes!
function linear(interval) {
    var start = moment();
    var stop = moment().add(interval, 'minutes');
    var sched = later.parse.recur().every(60).second();
    var pulse = later.setInterval(function () {
        console.log(new Date());
        Flashes(1, 1000, generalGetColor(start, moment(), interval * 60), 1);
    }, sched);

    schedule.scheduleJob(stop.toDate(), function () {
        pulse.clear();
        //policeCar(5);     //I think this would work as well
        blink1.setRGB(255, 0, 0, function () {
            blink1.fadeToRGB(5000, 0, 0, 0);
        });
    });
}
// linear(10);


function sinusoidal(interval) { 
    //TODO?
}

//Note: takes minutes now!
function solid(interval) {
    var start = moment();
    var end = moment().add(interval, 'minutes');
    var sched = later.parse.recur().every(3).second();
    var pulse = later.setInterval(function () {
        console.log(new Date());
        var r = hexToR_G_B(generalGetColor(start, moment(), interval * 60))[0];
        var g = hexToR_G_B(generalGetColor(start, moment(), interval * 60))[1];
        var b = hexToR_G_B(generalGetColor(start, moment(), interval * 60))[2];
        blink1.setRGB(r, g, b);
    }, sched);

    schedule.scheduleJob(end.toDate(), function () {
        pulse.clear();
        blink1.setRGB(0, 0, 0);
        //FastPulse(5, palette.red, 1);
        policeCar(5);
    });
}
solid(1);


function pomodoroSolid() {
    solid(25);
}
// pomodoroSolid();


//******************************** HELPER FUNCTIONS **********************************↓

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


/**
 * Generate a random Number between low and high
 * @param  {Number} low
 * @param  {Number} high
 * @return {Number}      A random Number between low and high
 */
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


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
    } else if (count < 2 * n / 3) {
        return palette.yellow;
    } else {
        return palette.red;
    }
}


/**
 *  Finds out the needed color for all activation functions
 *  If called in linear: first 33.33% of the interval Green, second 33.33% of the interval Yellow, last 33.33%  of the interval Red
 *  If called in exponential: the color will change exponentially from green to yellow, to red
 * 
 * @param {moment} start a moment object
 * @param {moment} now a moment object
 * @param {int} interval length in seconds
 * @return {hex} color needed for linear function
 */
function generalGetColor(start, now, interval) {
    if (now.diff(start, 'seconds') <= interval / 3) {
        return palette.green;
    } else if (now.diff(start, 'seconds') <= 2 * interval / 3) {
        return palette.yellow;
    } else {
        return palette.red;
    }
}


//******************************** Testing **********************************↓

/*
var pulseAlarm = {
    alarm: function () {
        var start = moment();
        var end = moment().add(interval, 'minutes');
        var sched = later.parse.recur().every(3).second();
        var pulse = later.setInterval(function () {
            console.log(new Date());
            var r = hexToR_G_B(generalGetColor(start, moment(), interval * 60))[0];
            var g = hexToR_G_B(generalGetColor(start, moment(), interval * 60))[1];
            var b = hexToR_G_B(generalGetColor(start, moment(), interval * 60))[2];
            blink1.setRGB(r, g, b);
        }, sched);

        schedule.scheduleJob(end.toDate(), function () {
            pulse.clear();
            blink1.setRGB(0, 0, 0);
            //FastPulse(5, palette.red, 1);
            policeCar(5);
        });
    }
};

var solidAlarm = {
    alarm: function () {
        //TODO
    }
}

linear(pulseAlarm);
*/