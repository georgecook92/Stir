const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
var cors = require('cors');

const forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
 };

app.use( express.static(__dirname) );

app.use(cors());

app.get('*', (req,res) => {

  if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }

  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log('server started on ' + port);
