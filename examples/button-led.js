var pi = require('../');

pi.setup('wpi');

pi.pin(5)
    .on('rising', function() {})
    .on('falling', function() {})
    .on('update', function(value) {})
    .listen(100);

pi.pin(5).read();
pi.pin(3).write(1);
// pi.pin(5).get();
// pi.pin(4).set(value);
pi.pin(3).up();
pi.pin(3).down();

pi.pin(1)
    .mode('input')
    .pullUp()
    .pullDown()
    .release();


// LED 1
var led = pi.pin(5).mode('output');

// Switch 1
var sw = pi.pin(2).mode('input').pullDown();


sw.on('rising', function {
    led.write(1);
});

sw.on('falling', function {
    led.write(1);
});

// Alternative
sw.on('update', function(value) {
    led.write(value);
})

pi.startPolling(100); // Interval in ms
