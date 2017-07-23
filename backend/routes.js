const routes = require('express').Router();
const q1 = require('./questionnaires/q1.json');

routes.use('/api', (req, res) => {
    res.status(200).json(q1);
});

module.exports = routes;
