const routes = require('express').Router();
const questionnaires = require('./api/questionnaire');
const helpers = require('./helpers');

routes.get('/', (req, res) => {
    res.render('home/index');
});

routes.get('/questionario/:key', (req, res) => {
    helpers.validateKey(req)
        .then(() => res.render('pages/index'))
        .catch(() => res.status(403).send());
});

routes.post('/questionario/:key', (req, res) => {
    helpers.validateKey(req)
        .then(() => res.render('pages/index'))
        .catch(() => res.status(403).send());
});


// routes.use('/api/questionnaires', questionnaires);

module.exports = routes;
