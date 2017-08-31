const routes = require('express').Router();
const db = require('../db');
const excelbuilder = require('msexcel-builder');

const secretPath = 'ot7jz9f39r7h';
const downloadPath = `${__dirname}/../download`;

console.log(downloadPath);

routes.get(`/${secretPath}/:set/download`, (req, res) => {
    db.getAnswers(req.params.set)
        .then(response => {
            const workbook = excelbuilder.createWorkbook(downloadPath, `${req.params.set}.xlsx`);
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
                const file = `${downloadPath}/${req.params.set}.xlsx`;
                res.download(file);
            });
        });
});

routes.get(`/${secretPath}/:set`, (req, res) => {
    db.getAnswers(req.params.set, true)
        .then(response => {
            res.render(`admin/${req.params.set}`, {
                data: response,
                download: `/admin/${secretPath}/${req.params.set}/download`
            });
        });
});

module.exports = routes;
