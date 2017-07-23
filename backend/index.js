/* eslint-env node */

const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use('/', routes);

app.get('/api', (req, res) => {
    res.render('pages/index');
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '/public')));

// views is directory for all template files
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//     response.render('pages/index');
// });

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
