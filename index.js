'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const nunjucks = require('nunjucks');
const request = require("request");
const urlencode = require('urlencode');

const basePath = process.env.BASE_PATH || '/';
const rootPath = path.resolve(__dirname, './dist/budgetkey-app-generic-item');

const app = express();
app.use(basePath, express.static(rootPath, {
  index: false,
  maxAge: '1d',
}));

nunjucks.configure(rootPath, {
  autoescape: true,
  express: app
});

app.set('port', process.env.PORT || 8000);

app.get(basePath + '*', function(req, res) {
  let injectedScript = '';

  // set language
  var lang = typeof(req.query.lang) !== "undefined" ? req.query.lang : 'he';
  injectedScript += `BUDGETKEY_LANG=${JSON.stringify(lang)};`;

  var theme = typeof(req.query.theme) !== "undefined" ? req.query.theme : 'budgetkey';
  var themeFileName = `theme.${theme}.${lang}.json`;
  let themeJson = null;
  if (themeFileName) {
    // try the themes root directory first - this allows mount multiple themes in a single shared docker volume
    if (fs.existsSync(path.resolve('/themes', themeFileName))) {
      themeJson = JSON.parse(fs.readFileSync(path.resolve('/themes', themeFileName)));
      // fallback to local file - for local development / testing
    } else if (fs.existsSync(path.resolve(__dirname, themeFileName))) {
      themeJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, themeFileName)));
    }
    if (themeJson) {
      for (var key in themeJson) {
        injectedScript += `${key}=${JSON.stringify(themeJson[key])};`;
      }
      injectedScript += `BUDGETKEY_THEME_ID=${JSON.stringify(req.query.theme)};`;
    }
  }

  var siteName = (themeJson && themeJson.BUDGETKEY_APP_GENERIC_ITEM_THEME) ?
                 themeJson.BUDGETKEY_APP_GENERIC_ITEM_THEME.siteName :
                 'מפתח התקציב';

  let doc_id = req.params[0];
  request({
    url: 'https://next.obudget.org/get/' + urlencode(doc_id),
    json: true
  }, function (error, response, body) {
    if (response.statusCode === 200 && body !== null && body.value) {
      body = body.value;
      if (body.__redirect) {
        res.redirect(basePath + body.__redirect + (theme?('?theme='+theme):''));
      } else {
        res.render('index.html', {
          base: basePath,
          prefetchedItem: JSON.stringify(body),
          title: siteName + ' - ' + body.page_title,
          injectedScript: injectedScript,
          doc_id: doc_id
        });
      }
    } else {
      res.sendStatus(response.statusCode);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Listening port ' + app.get('port'));
});
