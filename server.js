/**
 * Created by adam on 25/12/2016.
 */
var express = require('express');
var app = express();

app.use(express.static('dist'));

app.listen(8000, function () {
  console.log('app listening on port 8000!');
});
