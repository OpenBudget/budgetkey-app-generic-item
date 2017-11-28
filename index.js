'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const nunjucks = require('nunjucks');
const request = require("request");
const urlencode = require('urlencode');

const basePath = process.env.BASE_PATH || '/';
const rootPath = path.resolve(__dirname, './dist');
const disableCache = process.env.DISABLE_CACHE || false;

const app = express();
if (disableCache) {
  app.disable('view cache');
}

nunjucks.configure(rootPath, {
  autoescape: true,
  noCache: disableCache,
  express: app
});

app.set('port', process.env.PORT || 8000);

app.get(basePath + '*', function(req, res) {
  var filePath = path.resolve(rootPath, req.params[0]);
  if (fs.existsSync(filePath)) {
    var stats = fs.lstatSync(filePath);
    if (stats.isFile()) {
      return res.sendFile(filePath);
    }
  }

  var theme = typeof(req.query.theme) !== "undefined" ? req.query.theme : '';
  var themeFilePath = theme !== '' ? path.resolve(__dirname, 'theme.'+req.query.theme+'.json') : null;
  var themeScript = '';
  if (themeFilePath && fs.existsSync(themeFilePath)) {
    var themeJson = JSON.parse(fs.readFileSync(themeFilePath));
    for (var key in themeJson) {
      themeScript += key+"="+JSON.stringify(themeJson[key])+";";
    }
  }

  request({
    url: 'https://next.obudget.org/get/' + urlencode(req.params[0]),
    json: true
  }, function (error, response, body) {
    if (response.statusCode === 200 && body !== null && body.value) {
      body = body.value;
      res.render('index.html', {
        base: basePath,
        prefetchedItem: JSON.stringify(body),
        title: body.page_title,
        themeScript: themeScript
      });
    } else {
      res.sendStatus(response.statusCode);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
