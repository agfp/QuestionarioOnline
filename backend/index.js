/* eslint-env node */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

app.use('/', routes);
app.use(express.static(path.join(__dirname, '/public')));

app.set('port', (process.env.PORT || 5000));
// views is directory for all template files
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
