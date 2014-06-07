/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  socket.on('send:newBank', function (data) {
    socket.broadcast.emit('send:newBank', {
      bank: data.bank
    });
  });
};
