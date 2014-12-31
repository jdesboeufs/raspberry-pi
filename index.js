var Pin = require('./lib/pin');
var wpi;

try {
    wpi = require('wiring-pi');
} catch (err) {
    throw new Error('Fake wiringPi bindings not implemented yet!');
}

var pins = [];

exports.setup = function (mode) {
    wpi.setup(mode);
};

exports.pin = function (number) {
    if (!pins[number]) {
        pins[number] = new Pin(wpi, number);
    }
    return pins[number];
};

exports.readAll = function () {
    pins.forEach(function (pin) {
        if (pin.currentMode === 'input') {
            pin.read();
        }
    });
};

exports.startPolling = function (interval) {
    setInterval(exports.readAll, interval);
};
