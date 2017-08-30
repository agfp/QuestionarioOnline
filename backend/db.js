const pgp = require('pg-promise')();

const databaseUrl = process.env.DATABASE_URL ||
    'postgres://nuclgtpjcqmbbk:fa3af256aa94256d97cbf867ee59796eb9b7ef894ec4a3e6a11ab99aa5dd5a5d@' +
    'ec2-107-20-226-93.compute-1.amazonaws.com:5432/dal73hgiprm63o';

const db = pgp(`${databaseUrl}?ssl=true`);

function getQuestionnaire(key) {
    const query = 'SELECT questionnaire FROM access_codes WHERE access_code = $1';
    return db.oneOrNone(query, key);
}

function saveQuestionnaire(data) {
    const query = `INSERT INTO answers(access_code, start_time, end_time, server_uid, question_set, answers)
                   VALUES ($/key/, $/startTime/, $/endTime/, $/serverUid/, $/set/, $/answers/)`;

    return db.none(query, data);
}

function getAnswers(set, limited) {
    const query = `SET timezone='America/Sao_Paulo';
                   SELECT to_char(start_time AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS start_time,
                          to_char(end_time   AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS') AS end_time,
                          answers
                   FROM answers
                   WHERE question_set = $1
                   ${limited ? 'ORDER BY answers.start_time DESC' : ''}
                   ${limited ? 'LIMIT 5' : ''}`;

    return db.any(query, set);
}

module.exports = {
    getQuestionnaire,
    saveQuestionnaire,
    getAnswers
};
