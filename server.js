var express = require('express');

var app = express();
const PORT = process.env.PORT || 3000;

//forwarding all https traffic to http - this is due to the map api only running on http
app.use(function(req,res,next) {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
      next();
  }
});

app.use( express.static( 'public' ) );

app.listen( PORT,
  function () {
    console.log("Listening on port " + PORT);
} );
