var events = require('events');
var util = require('util');

var EventEmitter = events.EventEmitter;


/*
** Constructor
*/
function Pin(wpi, number) {
    EventEmitter.call(this);
    this.n = number;
    this.wpi = wpi;
}

util.inherits(Pin, EventEmitter);

/*
** Methods
*/

/* Modes */
Pin.prototype.mode = function (mode) {
    var modes = this.wpi.modes;

    var map = {
        'input': modes.INPUT,
        'output': modes.OUTPUT,
        'pwm-output': modes.PWM_OUTPUT,
        'gpio-clock': modes.GPIO_CLOCK
    };

    if (!(mode in map)) throw new Error('Pin mode not allowed: ' + mode);

    this.wpi.pinMode(this.n, map[mode]);
    this.currentMode = mode;
    return this; 
};

Pin.prototype.input = function () {
    return this.mode('input');
};

Pin.prototype.output = function () {
    return this.mode('output');
};

Pin.prototype.ensureMode = function (mode) {
    if (this.currentMode !== mode) throw new Error('Action not allowed when Pin is not in ' + mode + ' mode');
};

/* Input mode methods */
Pin.prototype.read = function () {
    this.ensureMode('input');

    var value = this.wpi.digitalRead(this.n);

    if (value !== this.currentValue) {
        this.currentValue = value;

        if (this.inImpulseMode) {
            if (value === 1) {
                if ((Date.now() - this.lastImpulsion) > this.impulsionMaxInterval) {
                    // this.lastImpulsion = Date.now();
                    this.impulsionCount = 1;
                } else {
                    // this.lastImpulsion = Date.now();
                    this.impulsionCount++;
                }
            } else {
                this.lastImpulsion = Date.now();
            }
        } else {
            this.emit('update', value);
            this.emit(value === 1 ? 'rising' : 'falling');
        }
    } else if (value === 0 && this.inImpulseMode && this.impulsionCount && (Date.now() - this.lastImpulsion) > this.impulsionMaxInterval) {
        this.emit('impulsions', this.impulsionCount);
        this.impulsionCount = 0;
        this.lastImpulsion = 0;
    }

    return value;
};

/* Output mode methods */
Pin.prototype.write = function (value) {
    this.ensureMode('output');

    this.wpi.digitalWrite(this.n, value);

    if (value !== this.currentValue) {
        this.currentValue = value;
        this.emit('update', value);
        this.emit(value === 1 ? 'rising' : 'falling');
    }

    return this;
};

Pin.prototype.up = function () {
    return this.write(1);
};

Pin.prototype.down = function () {
    return this.write(0);
};

/* PullUpDown */
Pin.prototype.pullUpDownMode = function (mode) {
    this.ensureMode('input');
    
    var map = {
        off: this.wpi.PUD_OFF,
        down: this.wpi.PUD_DOWN,
        up: this.wpi.PUD_UP
    };

    if (!(mode in map)) throw new Error('PullUpDown mode mode not allowed: ' + mode);

    this.wpi.pullUpDnControl(this.n, map[mode]);
    return this; 
};

Pin.prototype.pullUp = function () {
    return this.pullUpDownMode('up');
};

Pin.prototype.pullDown = function () {
    return this.pullUpDownMode('down');
};

Pin.prototype.release = function () {
    return this.pullUpDownMode('off');
};

/* Impulsions */
Pin.prototype.impulseMode = function () {
    this.inImpulseMode = true;
    this.impulsionMaxInterval = 350;
    this.impulsionCount = 0;
    this.lastImpulsion = 0;
    return this;
};


/*
** Exports
*/
module.exports = Pin;
