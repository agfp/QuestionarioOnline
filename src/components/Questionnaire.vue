<template>
<div>

    <h1>Questionário</h1>

    <ul class="question-list" v-for="question in screenQuestions">
        <li v-if="Array.isArray(question.matrix)" class="question-item">
            <table>
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th v-for="option in matrixOptions"><span class="intact">{{option}}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in question.matrix" :class="{pending: showPending && !validateItem(item) }">
                        <td>{{item.item}}</td>
                        <td class="center" v-for="option in matrixOptions" @click="selectItem(item, option)">
                            <input :name="item.id" :value="option" v-model="answers[item.id]" type="radio">
                        </td>
                    </tr>
                </tbody>
            </table>
        </li>

        <li v-else class="question-item" :class="{pending: showPending && !validate(question)}">
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
        </li>
    </ul>

    <div class="pagination" v-if="pages != null">
        <button class="pure-button pure-button-primary" :disabled="page === 0" @click="previous()">Anterior</button>
        <span>Página {{page+1}} de {{pages.length}}</span>
        <button class="pure-button pure-button-primary" @click="next()" v-if="page < pages.length - 1">Próximo</button>
        <button class="pure-button pure-button-primary" @click="finish()" v-else>Finalizar</button>
    </div>
</div>
</template>

<script>
import swal from 'sweetalert';

export default {
    props: ['pages'],
    data() {
        return {
            page: 0,
            answers: [],
            showPending: false,
            matrixOptions: ['Nunca', 'Raramente', 'Algumas vezes', 'Muitas vezes', 'Sempre', 'Não se aplica']
        };
    },
    methods: {
        previous() {
            this.showPending = false;
            this.page--;
        },

        next() {
            if (this.validatePage()) {
                this.showPending = false;
                this.page++;
            }
        },

        finish() {
            if (this.validatePage()) {
                this.$emit('finished', this.answers);
            }
        },

        validatePage() {
            for (let i = 0; i < this.screenQuestions.length; i++) {
                if (!this.validate(this.screenQuestions[i])) {
                    this.showPending = true;
                    swal('Perguntas pendentes', 'Por favor responda as perguntas marcadas em vermelho', 'error');
                    return false;
                }
            }
            return true;
        },

        validateItem(item) {
            return Boolean(this.answers[item.id]);
        },

        validate(question) {
            function validateAnswer(answer) {
                return answer ? Boolean(answer.trim()) : false;
            }

            if (question.textbox) {
                return validateAnswer(this.answers[question.id]);
            } else if (Array.isArray(question.matrix)) {

                for (let i = 0; i < question.matrix.length; i++) {
                    let item = question.matrix[i];
                    if (!this.validateItem(item)) {
                        return false;
                    }
                }
                return true;

            }
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
            return false;
        },

        selectItem(item, answer) {
            let a = JSON.parse(JSON.stringify(this.answers));
            a[item.id] = answer;
            item.pending = false;
            this.answers = a;
        },

        loadSubquestions(question) {
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
        screenQuestions() {
            let selectedQuestions = [];
            if (this.pages) {
                this.pages[this.page].forEach(question => {
                    selectedQuestions.push(question);
                    selectedQuestions = selectedQuestions.concat(this.loadSubquestions(question));
                });
            }
            return selectedQuestions;
        }
    }
};
</script>

<style scoped>
.pagination {
    margin-top: 20px;
}

table {
    border-collapse: collapse;
}

thead th:not(:first-child) {
    border: 1px solid #aaa;
    text-align: center;
}

tbody tr:nth-child(odd) {
    background-color: #eee;
}

tbody tr:hover {
    background: lightyellow;
}

tbody td {
    border: 1px solid #aaa;
}

tbody td:not(:first-child) {
    cursor: pointer;
}

tbody td:first-child {
    padding: 6px 5px;
}

.intact {
    display: inline-block;
    width: 80px;
    font-weight: normal;
    font-size: 11pt;
}

.center {
    text-align: center;
}

.question {
    margin-bottom: 5px;
}

.pending {
    background: #FFDDDD !important;
}

.question-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

li.question-item {
    margin-top: 10px;
    padding: 10px;
}

div.option-item {
    padding: 5px;
}

div.option-item:hover {
    background: lightyellow;
}
</style>
