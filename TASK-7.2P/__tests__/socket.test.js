// socket.test.js
const { expect } = require('chai');
const { io } = require('socket.io-client');

let server;

before(function(done) {
  // increase timeout for server start on CI
  this.timeout(5000);
  // Require your server; it should export the HTTP server instance
  try {
    delete require.cache[require.resolve('../server')];
  } catch(e) {}
  server = require('../server');
  // if server is already listening, proceed
  setTimeout(done, 300);
});

after(function(done) {
  if (server && server.close) {
    server.close(() => done());
  } else {
    done();
  }
});

describe('Socket.IO number event', function() {
  this.timeout(5000);

  it('emits numeric payloads to connected clients', (done) => {
    const socket = io('http://localhost:3000', { transports: ['websocket'] });

    function onNumber(n) {
      try {
        expect(n).to.be.a('number');
        socket.off('number', onNumber);
        socket.close();
        done();
      } catch (err) {
        done(err);
      }
    }

    socket.on('connect', () => {
      socket.on('number', onNumber);
    });

    socket.on('connect_error', (err) => {
      done(err);
    });
  });
});
