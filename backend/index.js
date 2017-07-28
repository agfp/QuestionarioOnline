/* eslint-env node */

const express = require('express');
const path = require('path');
const routes = require('./routes');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionario';

app.use('/', routes);
app.use(express.static(path.join(__dirname, '/public')));

app.set('port', (process.env.PORT || 5000));
// views is directory for all template files
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

MongoClient.connect(mongoUri, (err, db) => {
    if (err) throw err;
    app.locals.db = db;
    app.listen(app.get('port'), () => {
        console.log('Node app is running on port', app.get('port'));
    });
});
