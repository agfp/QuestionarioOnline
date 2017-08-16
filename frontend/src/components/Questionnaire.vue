<template>
<div>
    <div class="title-bar">
        <h1>{{ title }}</h1>
    </div>
    <ul class="question-list pure-form">
        <li class="question-item" v-for="question in screenQuestions">
            <div v-if="Array.isArray(question.matrix)" class="item-box">
                <div class="question">{{ question.question }}</div>
                <matrix :question="question"
                        :show-pending="showPending"
                        :answers="answers"
                        @select="selectItem"></matrix>
            </div>
            <div v-else :class="{ pending: showPending && !validate(question), 'item-box': true }">
                <div class="question">{{ question.question }}</div>
                <div v-if="question.textbox">
                    <input type="text" v-model="answers[question.id]" placeholder="Digite sua resposta" />
                </div>
                <div v-if="Array.isArray(question.options)">
                    <options :question="question"
                             :answers="answers"
                             @select="selectItem"
                             @toggle="toggleItem"></options>
                </div>
            </div>
        </li>
    </ul>
    <div class="pagination" v-if="pages != null">
        <button class="pure-button" :disabled="currentPage === 0" @click="previous()">Anterior</button>
        <span>Página {{currentPage+1}} de {{pages.length}}</span>
        <button class="pure-button pure-button-primary" @click="next()" v-if="currentPage < pages.length - 1">Próximo</button>
        <button class="pure-button pure-button-primary" @click="finish()" v-else>Finalizar</button>
    </div>
</div>
</template>

<script>
import swal from 'sweetalert';
import matrix from './Matrix';
import options from './Options';

export default {
    props: ['pages'],
    components: {
        matrix,
        options
    },
    data() {
        return {
            currentPage: 0,
            answers: [],
            showPending: false
        };
    },
    methods: {
        previous() {
            this.showPending = false;
            this.currentPage--;
        },

        next() {
            if (this.validatePage()) {
                this.showPending = false;
                this.currentPage++;
                window.scrollTo(0, 0);
            }
        },

        finish() {
            if (this.validatePage()) {
                this.$emit('finished', this.answers);
            }
        },

        validatePage() {
            return true;

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

            if (question.multiple) {
                return true;
            }

            if (question.textbox) {
                return validateAnswer(this.answers[question.id]);
            }
            else if (Array.isArray(question.matrix)) {
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

        selectItem(value) {
            let a = JSON.parse(JSON.stringify(this.answers));
            a[value.item.id] = value.answer;
            value.item.pending = false;
            this.answers = a;
        },

        toggleItem(item) {
            let a = JSON.parse(JSON.stringify(this.answers));
            a[item.id] = a[item.id] === 1 ? null : 1;
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
                this.pages[this.currentPage].questions.forEach(question => {
                    selectedQuestions.push(question);
                    selectedQuestions = selectedQuestions.concat(this.loadSubquestions(question));
                });
            }
            return selectedQuestions;
        },
        title() {
            return this.pages[this.currentPage].name;
        }
    }
};
</script>

<style lang="scss" scoped>
.title-bar {
    background: whitesmoke;
    padding: 20px;
    border-bottom: 1px solid lightgray;

    h1 {
        padding: 0;
        margin: 0;
    }
}

input[type=text] {
    width: 320px;
}

.question {
    margin-bottom: 5px;
    // margin-top: 20px;
    font-size: 14pt;
    font-weight: bold;
    line-height: 1.7;
}

.pending {
    background: #FFDDDD !important;
}

.item-box {
    padding: 20px 30px;
}

.question-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

li.question-item {
    margin-top: 10px;
}

.pagination {
    text-align: center;
    padding: 20px;
    background: whitesmoke;
    border-top: 1px solid lightgray;

    span {
        margin: 0 10px;
    }
}
</style>
