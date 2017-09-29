<template>
<div>
    <div class="title-bar">
        <h1>{{ title }}</h1>
    </div>
    <vue-circle id="progress-circle"
        class="progress-circle"
        ref="progresscircle"
        :start-angle="-(Math.PI / 2)"
        :progress="0"
        :fill="{ gradient: ['#0683C3', '#06A4C2', '#06C3C1'] }"
        :size="100"
        :thickness="10"
        :show-percent="true">
    </vue-circle>

    <ul class="question-list pure-form">
        <li class="question-item"
            v-for="question in screenQuestions">
            <div v-if="Array.isArray(question.matrix)"
                class="item-box">
                <div class="question">{{ question.question }}</div>
                <matrix :question="question"
                    :show-pending="showPending"
                    :answers="answers"
                    @select="selectItem"></matrix>
            </div>
            <div v-else
                :class="{ pending: showPending && !validate(question), 'item-box': true }">
                <div class="question">{{ question.question }}</div>
                <div class="instruction"
                    v-if="question.instruction">
                    {{ question.instruction }}
                </div>
                <div v-if="question.invalidNumber || showPending"
                    class="instruction-alert">
                    {{ question.validationMsg }}
                </div>
                <div v-if="question.monthYear"
                    class="textbox-item">
                    <month-year :question="question"
                        :answers="answers"
                        @date-selected="selectItem"></month-year>
                </div>
                <div v-if="question.textbox"
                    class="textbox-item">
                    <input v-if="question.number"
                        type="number"
                        v-model.lazy="answers[question.id]"
                        placeholder="Digite sua resposta"
                        @change="validateNumberAndUpdateProgress(question)" />

                    <input v-else
                        type="text"
                        v-model.lazy="answers[question.id]"
                        placeholder="Digite sua resposta"
                        @change="updateProgress" />
                </div>
                <div v-if="Array.isArray(question.options)">
                    <div v-if="question.multiple"
                        class="instruction-alert">
                        Pode marcar mais de uma alternativa
                    </div>
                    <options :question="question"
                        :answers="answers"
                        @select="selectItem"
                        @toggle="toggleItem"></options>
                </div>
            </div>
        </li>
    </ul>
    <div class="pagination"
        v-if="pages != null">
        <button class="pure-button"
            :disabled="currentPage === 0"
            @click="previous()">Anterior</button>
        <!-- <span>Página {{currentPage+1}} de {{pages.length}}</span> -->
        <linear-progress :percentage="percentage"></linear-progress>
        <button class="pure-button pure-button-primary"
            @click="next()"
            v-if="currentPage < pages.length - 1">Próximo</button>
        <button class="pure-button pure-button-primary"
            @click="finish()"
            v-else
            :disabled="saving">
            <span v-if="!saving">Finalizar</span>
            <span v-else>Aguarde...</span>
        </button>
    </div>
</div>
</template>

<script>
import swal from 'sweetalert';
import VueCircle from 'vue2-circle-progress';
import matrix from './Matrix';
import options from './Options';
import monthYear from './MonthYear';
import LinearProgress from './LinearProgress';

import helpers from '../helpers';
import api from '../api';

export default {
    props: ['pages', 'set', 'loadedAnswers'],
    components: {
        matrix,
        options,
        monthYear,
        VueCircle,
        LinearProgress
    },
    data() {
        return {
            currentPage: 0,
            answers: [],
            showPending: false,
            completedSteps: 0,
            totalSteps: 0,
            saving: false
        };
    },
    mounted() {
        this.pages.forEach(page => {
            page.questions.forEach(question => {
                if (!question.multiple) {
                    if (Array.isArray(question.matrix)) {
                        this.totalSteps += question.matrix.length;
                    } else {
                        this.totalSteps++;
                    }
                }
            });
        });

        if (Array.isArray(this.loadedAnswers)) {
            this.answers = this.loadedAnswers;
            this.updateProgress();
            let stop = false;
            for (let i = 0; i < this.pages.length; i++) {
                for (let j = 0; j < this.screenQuestions.length; j++) {
                    if (!this.validate(this.screenQuestions[j])) {
                        stop = true;
                        break;
                    }
                }
                if (stop || this.currentPage === this.pages.length - 1) break;
                this.currentPage++;
            }
        }
    },
    methods: {
        previous() {
            this.showPending = false;
            this.currentPage--;
        },
        next() {
            if (this.validatePage()) {
                window.scrollTo(0, 0);
                this.showPending = false;
                this.currentPage++;
            }
        },
        finish() {
            if (this.validatePage()) {
                this.saving = true;
                api.save(
                        helpers.PARAMETERS.key,
                        helpers.PARAMETERS.token,
                        this.set,
                        this.answers)
                    .then(() => {
                        if (typeof Storage !== 'undefined') {
                            localStorage.removeItem(helpers.PARAMETERS.key);
                        }
                        this.$emit('finished', this.answers);
                    })
                    .catch(() => {
                        this.saving = false;
                        swal('Oops...',
                            'Ocorreu um erro ao enviar o questionário. Por favor tente novamente.',
                            'error');
                    });
            }
        },
        validateNumber(question) {
            let answer = parseInt(this.answers[question.id], 10);
            return answer >= question.number.min && answer <= question.number.max;
        },
        validateNumberAndUpdateProgress(question) {
            if (this.validateNumber(question)) {
                this.updateProgress();
            } else {
                question.invalidNumber = true;
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

            if (question.multiple) {
                return true;
            }

            if (question.textbox || question.monthYear) {
                return question.number ? this.validateNumber(question) : validateAnswer(this.answers[question.id]);
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
            this.updateProgress();
        },
        toggleItem(item) {
            let a = JSON.parse(JSON.stringify(this.answers));
            a[item.id] = a[item.id] === 1 ? null : 1;
            this.answers = a;
        },
        updateProgress() {
            let completedSteps = 0;
            this.pages.forEach(page => {
                page.questions.forEach(question => {
                    if (!question.multiple) {
                        if (Array.isArray(question.matrix)) {
                            question.matrix.forEach(item => {
                                if (this.validateItem(item)) {
                                    completedSteps++;
                                }
                            });
                        } else if (this.validate(question)) {
                            completedSteps++;
                        }
                    }
                });
            });
            this.completedSteps = completedSteps;
            this.$refs.progresscircle.updateProgress(Math.ceil((completedSteps / this.totalSteps) * 100));
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
        },
        percentage() {
            return Math.ceil((this.completedSteps / this.totalSteps) * 100);
        }
    },
    watch: {
        answers(val) {
            if (typeof Storage !== 'undefined') {
                let store = helpers.getStorageItem(this.set, val);
                localStorage.setItem(helpers.PARAMETERS.key, JSON.stringify(store));
            }
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

input[type=number],
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

.instruction {
    font-style: italic;
    font-size: 11pt;
}

.instruction-alert {
    @extend .instruction;
    color: red;
}

.textbox-item {
    margin-top: 10px;
}

.pagination {
    text-align: center;
    padding: 25px;
    background: whitesmoke;
    border-top: 1px solid lightgray;

    span {
        margin: 0 10px;
    }
}

.progress-circle {
    position: absolute;
    right: 10px;
    top: 22px;
}
</style>
