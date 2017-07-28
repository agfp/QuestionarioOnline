const routes = require('express').Router();
const questionnaires = require('./api/questionnaire');

routes.get('/questionario/:key', (req, res) => {
    res.render('index');
});

routes.use('/api/questionnaires', questionnaires);

module.exports = routes;
