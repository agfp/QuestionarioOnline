const txt = document.getElementById('parameters').text;
const PARAMETERS = JSON.parse(txt);

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março',
    'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro',
    'Outubro', 'Novembro', 'Dezembro'
];

function getStorageItem(answers) {
    return {
        token: PARAMETERS.token,
        answers
    };
}

function loadStorageItem(storage) {
    PARAMETERS.token = storage.token;
}

function prepareQuestionnaire(questionnaire) {
    let questions = [];
    preparePages(questionnaire, questions);
    return {
        questionnaire,
        questions
    };
}

function preparePages(pages, numberedQuestions) {
    let counter = 0;
    pages.forEach(page => {
        counter = prepareQuestions(page.questions, counter, numberedQuestions);
    });
    // numberedQuestions.forEach(r => {
    //     console.log(r);
    // });
}

function prepareQuestions(questions, counter, numberedQuestions) {
    questions.forEach(question => {
        if (Array.isArray(question.matrix)) {
            if (!Array.isArray(question.headers)) {
                question.headers = [
                    'Nunca',
                    'Raramente',
                    'Algumas vezes',
                    'Muitas vezes',
                    'Todo tempo',
                    'Não se aplica'
                ];
            }
            numberedQuestions.push(`--- ${question.question}`);
            question.matrix.forEach(item => {
                numberedQuestions.push(`${counter + 1} - ${item.item}`);
                item.id = counter++;
                item.pending = true;
            });
            numberedQuestions.push('---');
        }
        else if (question.multiple) {
            numberedQuestions.push(`--- ${question.question}`);
            question.options.forEach(option => {
                numberedQuestions.push(`${counter + 1} - ${option.item}`);
                option.id = counter++;
            });
            numberedQuestions.push('---');
        }
        else {
            numberedQuestions.push(`${counter + 1} - ${question.question}`);
            question.id = counter++;
            question.pending = true;
            if (Array.isArray(question.options)) {
                question.options.forEach(option => {
                    if (option.textbox) {
                        numberedQuestions.push(`${counter + 1} - ${question.question} - ${option.item}`);
                        option.id = counter++;
                        option.pending = true;
                    }
                    if (Array.isArray(option.subquestions)) {
                        counter = prepareQuestions(option.subquestions, counter, numberedQuestions);
                    }
                });
            }
        }
    });
    return counter;
}

/* eslint 'no-bitwise': 'off' */
function hashCode(str) {
    let hash = 0;
    let i;
    let chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return ((hash + 2147483647) + 1).toString(36);
}

export default {
    prepareQuestionnaire,
    hashCode,
    getStorageItem,
    loadStorageItem,
    MONTHS,
    PARAMETERS
};
