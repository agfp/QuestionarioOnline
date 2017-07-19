import axios from 'axios';

export function getQuestionnaire() {
    return new Promise((resolve, reject) => {
        axios
            .get('/static/questionnaires/teste1.json')
            .then(response => {
                const numberedQuestions = [];
                preparePages(response.data, numberedQuestions);
                resolve({
                    questionnaire: response.data,
                    questions: numberedQuestions
                });
            })
            .catch(reject);
    });
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
                numberedQuestions.push(`${counter} - ${item.item}`);
                item.id = counter++;
                item.pending = true;
            });
        } else {
            numberedQuestions.push(`${counter} - ${question.question}`);
            question.id = counter++;
            question.pending = true;
            if (Array.isArray(question.options)) {
                question.options.forEach(option => {
                    if (option.textbox) {
                        numberedQuestions.push(`${counter} - ${question.question} - ${option.item}`);
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
