
### Ambient Reminders: Final Report <br/>
**Title:** Ambient Reminders <br/>
**Mentor:** Dr. Christopher J Parnin <br/>
**Course:** CSC499 – 3 credit hours <br/>
**Prerequisites:** CSC114, CSC116 <br/>
**Semester:** Fall 2015

**Description:** <br/>
     Reminders can be distracting when the user is in the middle of doing their task and an alarm goes off, and this is completely opposite of reminders’ intention. Ambient reminder is an approach to keep user up to date on the upcoming event of their schedule without being a distraction while the user is doing the previous task. Ambient light displays and reminders are not new but they have never been used in a practical manner because of their limitations, like the location of user in their office. The goal of this research is to study more about different ways ambient reminders can be implemented and to discover ways to make it more usable in everyday life. This will be an exploratory study into ambient reminders. We will be using the study to program USB dongles, (and mobile apps,) and using lights and vibrations to make a prototype. We will get some insights on the idea and also have some participants to do a small study on the feedback from real users and validate the approach.
     
**Summary of semester:** <br/>
* **First 3 weeks:** It took a while to set up a [clean working environment](https://github.com/alt-code/Blink/blob/master/AmbientReminders/README.md) to be able to start working on the main goals. It can be a little bit harder to get it to work on linux (USB libraries) but it is tested on Linux, Mac, Windows and there is no problem. [[#8](https://github.com/alt-code/Blink/issues/8)]
* **The rest of semester:** 
    - Weekly meetings with [Dr. Chris Parnin] (http://www.chrisparnin.me/) to discuss and dicide how I need to proceed toward our goal of a complete end-to-end system working.
    - Added different patterns for alarms (PoliceCar, Pulse + slow/fast) [[#5](https://github.com/alt-code/Blink/issues/5)]
    - Added lightness (HSL color-space) to the patterns with the help of [onecolor] (https://www.npmjs.com/package/onecolor) library. + helper functions for color-space conversions. [[#9](https://github.com/alt-code/Blink/issues/9)]
    - Added multi led support to pulse function. [[#11](https://github.com/alt-code/Blink/issues/11)]
    - Added linear activation function which will trigger `pulse` during the given sessionLength every 60 seconds. [[#21](https://github.com/alt-code/Blink/issues/21)]
    - Added `getColorGeneral` functions to calculate what color should be used in each moments of the given `sessionLength` (This was a bit tricky imo)
    - Added The exponential activation function + it's color calculator function
    - Added solid activation function + replaced all color calculator functions with one that works for linear, solid, exponential, `generalGetColor`. [[#20](https://github.com/alt-code/Blink/issues/20)]
    - Refactoring and accepting longer `sessionLenght`s in linear (and solid)
    - Used a strategy pattern to wrap up the code - somewhat OO approach [[#24] (https://github.com/alt-code/Blink/issues/24)]
    - Added a warning to the end of each session - policeCar for 5 seconds at the end of solid alarm/Stay red at the end of linear.
    - Accepting longer sessionLengths in minute.
    - Using command line parameters for controlling settings [[#22](https://github.com/alt-code/Blink/issues/22)]
    - Refactoring and small fixes. [[#27](https://github.com/alt-code/Blink/issues/27), [#32](https://github.com/alt-code/Blink/issues/32), [#32](https://github.com/alt-code/Blink/issues/32)]
    - Added ligtness to commandline parameters.
    - Added simple node.js web server to help control state of reminder. [[#30](https://github.com/alt-code/Blink/issues/30)]
    - Added buttons to trigger `solid`/`linear` alarms for `sessionLength` of 30 minutes.
    - Added off button on the web server. [[#38](https://github.com/alt-code/Blink/issues/38)]
    - Added text input for `sessionLength`.
* **Libraries:** <br/>
    - [node-blink1](https://www.npmjs.com/package/node-blink1): A Node.js library for the blink(1).
    - [onecolor](https://www.npmjs.com/package/onecolor)]: Javascript color object with implicit color space conversions. 
    - [node-schedule](https://www.npmjs.com/package/node-schedule): A cron-like and not-cron-like job scheduler for Node.
    - [later](https://www.npmjs.com/package/later): Determine later (or previous) occurrences of recurring schedules

**Plan for the future:** <br/>
     In my free time I will be adding more features to the web server to control more settings, etc. 
     Please add an issue for any idea on what features migth be useful to have.
     
At the end I want to thank [Dr. Chris Parnin](http://www.chrisparnin.me/) for guiding me through this research project and helping me gain experience in the areas that I didn't have experience.

<br/>
Samim Mirhosseini aka. [ssmirr](https://github.com/ssmirr), <br/>
December 15, 2015
