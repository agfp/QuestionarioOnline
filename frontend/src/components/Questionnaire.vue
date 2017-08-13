<template>
<div>

    <div class="title-bar">
        <h1>{{ title }}</h1>
    </div>

    <ul class="question-list pure-form">
        <li class="question-item" v-for="question in screenQuestions">
            <div class="question">{{ question.question }}</div>

            <div v-if="question.textbox">
                <input type="text" v-model="answers[question.id]" />
            </div>

            <table v-if="Array.isArray(question.matrix)">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th v-for="option in matrixOptions"><span>{{option}}</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in question.matrix" :class="{pending: showPending && !validateItem(item) }">
                        <td>{{item.item}}</td>
                        <td class="center" v-for="(option, index) in matrixOptions" @click="selectItem(item, index + 1)">
                            <input :name="item.id" :value="index + 1" v-model="answers[item.id]" type="radio">
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="Array.isArray(question.options)" :class="question.options.length > 3 ? 'options-columns' : ''">
                <div v-for="(option, index) in question.options">
                    <div class="option-item pure-radiobutton" v-on:click="selectItem(question, index + 1)">
                        <input :name="question.id" :value="index + 1" v-model="answers[question.id]" type="radio">
                        <label v-if="!option.textbox"><span class="option-item-text">{{ option.item }}</span></label>
                        <label v-else>
                            <input  type="text" class="pure-input" v-model="answers[option.id]" :placeholder="option.item" />
                        </label>
                    </div>
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
            title: 'Condições de Trabalho',
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
            if (answer) {
                let option = question.options[answer - 1];
                if (option.textbox) {
                    return validateAnswer(this.answers[option.id]);
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
                let answer = this.answers[question.id];
                let option = question.options[answer - 1];
                if (Array.isArray(option.subquestions)) {
                    option.subquestions.forEach(sq => {
                        subQuestions.push(sq);
                        subQuestions = subQuestions.concat(this.loadSubquestions(sq));
                    });
                }
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

<style lang="scss" scoped>
.pagination {
    margin-top: 20px;
}

.title-bar {
    background: whitesmoke;
    margin: -11px -11px 20px;
    padding: 20px;
    border-bottom: 1px solid lightgray;

    h1 {
        padding: 0;
        margin: 0;
    }
}

.options-columns {
    columns: 2;
}

table {
    border-collapse: collapse;

    thead {
        th:not(:first-child) {
            border: 1px solid #aaa;
            text-align: center;
        }

        th span {
            display: inline-block;
            width: 80px;
            font-weight: normal;
            font-size: 11pt;
        }
    }
    tbody {
        tr:nth-child(odd) {
            background-color: #eee;
        }
        tr:hover {
            background: lightyellow;
        }
        td {
            border: 1px solid #aaa;
        }
        td:not(:first-child) {
            cursor: pointer;
        }
        td:first-child {
            padding: 6px 5px;
        }
    }
}

.center {
    text-align: center;
}

.question {
    margin-bottom: 10px;
    margin-top: 20px;
    font-size: 14pt;
    font-weight: bold;
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
    //border-top: 1px solid lightgray;

    &:first-child {
        border-top: 0;
        margin-top: -10px;
    }

}

div.option-item {
    padding: 5px;
    cursor: pointer;
    &:hover {
        background: lightyellow;
    }

    input[type=radio],
    label {
        cursor: pointer;
    }
}

.option-item-text {
    display: inline-block;
    vertical-align: middle;
    word-wrap: normal;
    width: 95%;
}
</style>
