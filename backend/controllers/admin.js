const routes = require('express').Router();
const db = require('../db');
const Excel = require('exceljs');

const secretPath = 'ot7jz9f39r7h';

routes.get(`/${secretPath}/:set/download`, (req, res) => {
    db.getAnswers(req.params.set)
        .then(response => {
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet('Respostas');
            const length = response[0].answers.length;
            const headers = ['Fim', 'Início'].concat(Array.from(new Array(length), (x, i) => i + 1));
            worksheet.addRow(headers);
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center' };
            worksheet.getColumn(1).width = 20;
            worksheet.getColumn(2).width = 20;
            response.forEach(row => {
                const r = [row.end_time, row.start_time].concat(row.answers);
                worksheet.addRow(r);
            });
            res.attachment(`Respostas-${req.params.set}.xlsx`);
            workbook.xlsx.write(res);
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
