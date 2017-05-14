import app from './app';
import * as debugModule from 'debug';
import * as http from 'http';
import * as serverIO from 'socket.io';

const debug = debugModule('node-express-typescript:server');

//SECURE SERVER
// const options = {
//   key: fs.readFileSync('./sslcert/private.key'),
//   cert: fs.readFileSync('./sslcert/certificate.pem')
// }
// const port = normalizePort(process.env.PORT || '8083');
// const server = https.createServer(options, app)
// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening); 


// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

// create server and listen on provided port (on all network interfaces).
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//Setup Socket io
let io = serverIO(server);

export let ioGlobal = io.of('/socket/global');
ioGlobal.on('connection', (socket) => {
  socket.on('subscribe', () => {
    socket.join("states");
  });
  socket.on('unsubscribe', () => {
    socket.leave("states");
  });
});

export let ioZones = io.of('/socket/zones');
ioZones.on('connection', (socket) => {
  socket.on('subscribe', (data) => {
    socket.join(data.zone);
  });
  socket.on('unsubscribe', (data) => {
    socket.leave(data.zone);
  });
});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any): number | string | boolean {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  console.log('Listening on ' + bind);
}
