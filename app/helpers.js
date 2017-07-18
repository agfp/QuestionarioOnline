import axios from 'axios';

export function getQuestionnaire() {
    return new Promise(function(resolve, reject) {
        axios
            .get('/questionnaires/teste1.json')
            .then(function(response) {
                preparePages(response.data);
                resolve(response.data);
            })
            .catch(reject);
    });
}

function preparePages(questionario) {
    let init = 0;
    questionario.forEach(page => {
        init = prepareQuestions(page, init);
    });
}

function prepareQuestions(questions, counter) {
    questions.forEach(question => {
        if (Array.isArray(question.matrix)) {
            console.log(`[${question.question}]`);
            question.matrix.forEach(item => {
                console.log(`${counter} - ${item.item}`);
                item.id = counter++;
                item.pending = true;
            });
        } else {
            console.log(`${counter} - ${question.question}`);
            question.id = counter++;
            question.pending = true;
            if (Array.isArray(question.options)) {
                question.options.forEach(option => {
                    if (option.textbox) {
                        console.log(`${counter} - ${question.question} - ${option.item}`);
                        option.id = counter++;
                        option.pending = true;
                    }
                    if (Array.isArray(option.subquestions)) {
                        counter = prepareQuestions(option.subquestions, counter);
                    }
                });
            }
        }
    });
    return counter;
}
