const { EventEmitter } = require('events');

class MockResponse extends EventEmitter {
    constructor() {
        super();
    }
}
module.exports = MockResponse;
