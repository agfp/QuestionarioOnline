const routes = require('express').Router();
const moment = require('moment');
const helpers = require('./helpers');
const db = require('./db');

function notFound(res) {
    res.status(404);
    res.send('Questionário não encontrado');
}

routes.get('/', (req, res) => {
    res.render('home/index');
});

routes.get('/questionario', (req, res) => {
    notFound(res);
});

routes.get('/questionario/:key', (req, res) => {
    if (req.params.key.length === 10) {
        db.getQuestionnaire(req.params.key)
            .then(response => {
                if (response) {
                    res.render(`questionnaires/${response.questionnaire}`, {
                        token: helpers.createToken()
                    });
                }
                else {
                    notFound(res);
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500);
                res.send('Database error');
            });
    }
    else {
        notFound(res);
    }
});

routes.post('/questionario/:key', (req, res) => {
    const d = helpers.parseToken(req.body.token);
    d.key = req.params.key;
    d.endTime = moment().format();
    d.clientUid = req.body.uid;
    d.set = req.body.set;
    d.answers = JSON.stringify(req.body.answers);
    db.saveQuestionnaire(d)
        .then(() => {
            res.status(200).send();
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = routes;
