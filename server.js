var express = require('express');
var mongooseConnect = require('./app/database/mongooseConnect.js');

var app = express();
const PORT = process.env.PORT || 3000;

app.use( express.static( 'public' ) );

app.listen( PORT,
  function () {
    console.log("Listening on port " + PORT);
} );
