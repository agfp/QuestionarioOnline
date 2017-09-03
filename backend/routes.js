const routes = require('express').Router();
const admin = require('./controllers/admin');
const questionario = require('./controllers/questionario');

routes.get('/', (req, res) => {
    res.render('home/index');
});

routes.use('/admin', admin);
routes.use('/questionario', questionario);

module.exports = routes;
