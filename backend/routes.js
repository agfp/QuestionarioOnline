const routes = require('express').Router();
const admin = require('./api/admin');
const questionario = require('./api/questionario');

routes.get('/', (req, res) => {
    res.render('home/index');
});

routes.use('/admin', admin);
routes.use('/questionario', questionario);

module.exports = routes;
