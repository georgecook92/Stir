var mongoose = require('mongoose');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGODB_URI ||
'mongodb://localhost/stir';

// Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    var connection = mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });



module.exports = connection;
