/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  // post bank
  socket.on('post bank', function (data) {
    socket.broadcast.emit('post bank', {
      bank: data.bank
    });
  });
  // update bank
  socket.on('update bank', function (data) {
    socket.broadcast.emit('update bank', {
      bank: data.bank
    });
  });
  // delete bank
  socket.on('delete bank', function (data) {
    socket.broadcast.emit('delete bank', {
      bank: data.bank
    });
  });
};
