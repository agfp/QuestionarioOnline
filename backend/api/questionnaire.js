const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.status(404).send();
});

routes.get('/:key', (req, res) => {
    const db = req.app.locals.db;
    if (req.params.key && req.params.key.length >= 2) {
        const findArg = {
            allowedIds: req.params.key
        };
        db.collection('config').find(findArg).toArray((err, docs) => {
            if (docs.length > 0) {
                res.json(docs);
            } else {
                res.status(404).send();
            }
        });
    } else {
        res.status(404).send();
    }
});

module.exports = routes;
