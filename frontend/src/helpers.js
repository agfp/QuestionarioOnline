import axios from 'axios';

export default {
    getQuestionnaire,
    prepareQuestionnaire
};

function getQuestionnaire() {
    return new Promise((resolve, reject) => {
        axios
            .get('/static/questionnaires/teste1.json')
            .then(response => {
                let result = prepareQuestionnaire(response.data);
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
