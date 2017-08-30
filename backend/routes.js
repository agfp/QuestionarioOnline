const routes = require('express').Router();
const moment = require('moment');
const helpers = require('./helpers');
const db = require('./db');
const excelbuilder = require('msexcel-builder');

function notFound(res) {
    res.status(404);
    res.send('Questionário não encontrado');
}

routes.get('/ot7jz9f39r7cnmik6nvc8d48/:set/download', (req, res) => {
    db.getAnswers(req.params.set)
        .then(response => {
            const workbook = excelbuilder.createWorkbook('./download/', `${req.params.set}.xlsx`);
            const sheet1 = workbook.createSheet('Respostas', response[0].answers.length + 2, response.length + 1);
            sheet1.set(1, 1, 'Início');
            sheet1.font(1, 1, { bold: 'true' });
            sheet1.set(2, 1, 'Fim');
            sheet1.font(2, 1, { bold: 'true' });
            for (let index = 0; index < response[0].answers.length; index++) {
                sheet1.set(3 + index, 1, index + 1);
                sheet1.font(3 + index, 1, { bold: 'true' });
            }
            for (let row = 0; row < response.length; row++) {
                sheet1.set(1, 2 + row, response[row].start_time);
                sheet1.set(2, 2 + row, response[row].end_time);
                for (let index = 0; index < response[row].answers.length; index++) {
                    sheet1.set(3 + index, 2 + row, response[row].answers[index]);
                }
            }
            workbook.save(() => {
                const file = `${__dirname}/download/${req.params.set}.xlsx`;
                res.download(file);
            });
        });
});

routes.get('/ot7jz9f39r7cnmik6nvc8d48/:set', (req, res) => {
    db.getAnswers(req.params.set, true)
        .then(response => {
            res.render(`admin/${req.params.set}`, {
                data: response,
                download: `/ot7jz9f39r7cnmik6nvc8d48/${req.params.set}/download`
            });
        });
});

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
                        parameters: JSON.stringify({
                            key: req.params.key,
                            token: helpers.createToken()
                        })
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
    d.set = req.body.set;
    d.answers = JSON.stringify(req.body.answers);

    console.log(d);

    db.saveQuestionnaire(d)
        .then(() => {
            res.status(200).send();
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
});

module.exports = routes;
