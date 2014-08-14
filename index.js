'use strict';

var util = require('util');

function format(message) {
  var pattern = '[%s][%s][%s][%s] %s';
  var userMessage = util.format.apply(null, [message.msg].concat(message.args));
  var app = [
    message.context.app,
    message.context.pid,
  ].filter(Boolean).join('/');
  var source = [
    message.context.host,
    app,
  ].filter(Boolean).join(':');
  var msg = util.format(
    pattern,
    message.date.toISOString(),
    source || 'N/A',
    message.level.name.toUpperCase(),
    message.context.component || 'N/A',
    userMessage
  );
  if (this.colors) {
    msg = message.level.color(msg);
  }
  if (message.err) {
    msg += '\n' + message.err.stack;
  }
  return msg + '\n';
}

function ConsoleTransport(opts) {
  opts = opts || {};
  this.colors = opts.colors === undefined
              ? process.stdout.isTTY
              : opts.colors;
  this.level = opts.level || 7;
}

ConsoleTransport.prototype.log = function log(message) {
  var stream = message.level.code < 4
             ? process.stderr
             : process.stdout;
  stream.write(format.call(this, message));
};

module.exports = function create(opts) {
  return new ConsoleTransport(opts);
};
