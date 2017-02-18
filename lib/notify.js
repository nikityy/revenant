// Preventing nc from grabbing arguments, 
// because we will use arguments in our own way.
process.argv = [];

var http = require('http'),
    querystring = require('querystring'),
    nc = require('node-osx-notifier');

module.exports = {
  send: function(title, subtitle, message, url) {
    var postData = querystring.stringify({
      title: title,
      subtitle: subtitle,
      message: message, 
      open: url,
      remove: 0
    });

    var options = {
      hostname: 'localhost',
      port: 1337,
      path: '/info',
      method: 'POST',   
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };

    var that = this;
    var req = http.request(options, function(res) {});

    req.write(postData);
    req.end();
  }
};