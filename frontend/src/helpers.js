import api from './api';

export default {
    getQuestionnaire,
    prepareQuestionnaire,
    hashCode
};

function getQuestionnaire() {
    return new Promise((resolve, reject) => {
        api.getQuestionnaire()
            .then(response => {
                let result = prepareQuestionnaire(response);
                resolve(result);
            })
            .catch(reject);
    });
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
        counter = prepareQuestions(page, counter, numberedQuestions);
    });
}

function prepareQuestions(questions, counter, numberedQuestions) {
    questions.forEach(question => {
        if (Array.isArray(question.matrix)) {
            numberedQuestions.push(`[${question.question}]`);
            question.matrix.forEach(item => {
                numberedQuestions.push(`${counter + 1} - ${item.item}`);
                item.id = counter++;
                item.pending = true;
            });
        } else {
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
