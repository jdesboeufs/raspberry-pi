var pi = require('../');

pi.setup('wpi');

var btn1 = pi.pin(0).input().impulseMode();
var btn2 = pi.pin(2).input();

btn1.on('impulsions', function (count) {
    console.log('[btn1] Impulsions: %d', count);
});

btn2.on('update', function (value) {
    console.log('[btn2] New state: %s', value);
});

pi.startPolling(50); // Interval in ms
