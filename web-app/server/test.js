const EventEmitter = require('events');
const data = new EventEmitter();
data.on = function(event, callback) {
    if (event === 'data') {
        callback(Buffer.from('data: ' + JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }] }) + '\n\n'));
    } else if (event === 'end') {
        callback();
    }
};
console.log(typeof data.on);
