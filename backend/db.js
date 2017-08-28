const pgp = require('pg-promise')();

const databaseUrl = process.env.DATABASE_URL ||
    'postgres://nuclgtpjcqmbbk:fa3af256aa94256d97cbf867ee59796eb9b7ef894ec4a3e6a11ab99aa5dd5a5d@' +
    'ec2-107-20-226-93.compute-1.amazonaws.com:5432/dal73hgiprm63o';

const db = pgp(`${databaseUrl}?ssl=true`);

function getQuestionnaire(key) {
    const cmd = 'SELECT questionnaire FROM access_codes WHERE access_code = $1';
    return db.oneOrNone(cmd, key);
}

function saveQuestionnaire(data) {
    const cmd = `INSERT INTO answers(access_code, start_time, end_time, server_uid, question_set, answers)
                 VALUES ($/key/, $/startTime/, $/endTime/, $/serverUid/, $/set/, $/answers/)`;

    return db.none(cmd, data);
}

module.exports = {
    getQuestionnaire,
    saveQuestionnaire
};
