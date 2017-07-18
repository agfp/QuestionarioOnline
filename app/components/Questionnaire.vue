<template>
<div>

    <h1>Questionário</h1>

    <ul class="question-list" v-for="question in screenQuestions">
        <li class="question-item" :class="{pending: showPending && !validate(question)}">
            <div class="question">{{ question.question }}</div>

            <div v-if="question.textbox">
                <input type="text" v-model="answers[question.id]" />
            </div>

            <div v-for="option in question.options">
                <div class="option-item" v-on:click="selectItem(question, option.item)">
                    <input :name="question.id" :value="option.item" v-model="answers[question.id]" type="radio">
                    <label>{{ option.item }}</label>
                    <input type="text" v-model="answers[option.id]" v-if="option.textbox" />
                </div>
            </div>

            <div v-if="question.matrix">
                <table class="matrix-questions">
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th class="rotate"><span class="intact">Nunca</span></th>
                            <th class="rotate"><span class="intact">Raramente</span></th>
                            <th class="rotate"><span class="intact">Algumas vezes</span></th>
                            <th class="rotate"><span class="intact">Muitas vezes</span></th>
                            <th class="rotate"><span class="intact">Sempre</span></th>
                            <th class="rotate"><span class="intact">Não se aplica</span></th>
                        </tr>
                    </thead>
                    <tbody v-for="item in question.matrix">
                        <tr>
                            <td>{{item.item}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </li>
    </ul>

    <button class="pure-button pure-button-primary" style="margin-top: 20px" v-on:click="next()">Próximo</button>
</div>
</template>

<script>
let pages = [];

export default {
    name: 'questionnaire',
    data() {
        return {
            page: 0,
            pages: pages,
            answers: [],
            showPending: false

        };
    },
    methods: {
        next: function() {
            for (let i = 0; i < this.screenQuestions.length; i++) {
                if (!this.validate(this.screenQuestions[i])) {
                    this.showPending = true;
                    alert('Por favor responda as perguntas marcadas em vermelho');
                    return;
                }
            }
            this.showPending = false;
            this.page++;
        },

        validate: function(question) {
            function validateAnswer(answer) {
                return answer ? Boolean(answer.trim()) : false;
            }

            if (question.textbox) {
                return validateAnswer(this.answers[question.id]);
            } else if (Array.isArray(question.matrix)) {
                return true;
            } else {
                let answer = this.answers[question.id];
                if (validateAnswer(answer)) {
                    for (let i = 0; i < question.options.length; i++) {
                        let option = question.options[i];
                        if (option.item === answer) {
                            if (option.textbox) {
                                return validateAnswer(this.answers[option.id]);
                            }
                            break;
                        }
                    }
                    return true;
                }
            }
            return false;
        },

        selectItem: function(question, answer) {
            let a = JSON.parse(JSON.stringify(this.answers));
            a[question.id] = answer;
            question.pending = false;
            this.answers = a;
        },

        loadSubquestions: function(question) {
            let subQuestions = [];
            if (this.answers[question.id] && question.options) {
                question.options.forEach(option => {
                    if (option.item === this.answers[question.id] && Array.isArray(option.subquestions)) {
                        option.subquestions.forEach(sq => {
                            subQuestions.push(sq);
                            subQuestions = subQuestions.concat(this.loadSubquestions(sq));
                        });
                    }
                });
            }
            return subQuestions;
        }

    },
    computed: {
        screenQuestions: function() {
            let selectedQuestions = [];
            this.pages[this.page].forEach(question => {
                selectedQuestions.push(question);
                selectedQuestions = selectedQuestions.concat(this.loadSubquestions(question));
            });
            return selectedQuestions;
        }
    }
};
</script>

<style scoped>


</style>
