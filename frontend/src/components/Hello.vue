<template>
<div>
    <choose-unit v-if="step === 0"
        @finished="onUnitChosen($event)"></choose-unit>

    <consent v-if="step === 1"
        :question-set="questionSet"
        @finished="onConsented($event)"></consent>

    <questionnaire v-if="step === 2"
        :pages="questionnaire"
        :loaded-answers="loadedAnswers"
        :set="questionSet"
        @finished="onQuestionnaireFinished($event)"></questionnaire>

    <thank-you v-if="step === 3"></thank-you>
</div>
</template>

<script>
import swal from 'sweetalert';
import chooseUnit from './ChooseUnit';
import questionnaire from './Questionnaire';
import ThankYou from './ThankYou';
import consent from './Consent';
import Helpers from '../helpers';
import HC from '../assets/hc.json';
import UFMG from '../assets/dev.json';

export default {
    components: {
        questionnaire,
        ThankYou,
        consent,
        chooseUnit
    },
    data() {
        return {
            questionnaire: null,
            questions: null,
            answers: null,
            questionSet: null,
            loadedAnswers: null,
            step: 0
        };
    },
    mounted() {
        let that = this;
        try {
            let txt = localStorage.getItem(Helpers.PARAMETERS.key);
            if (txt) {
                let stored = JSON.parse(txt);
                if (Array.isArray(stored.answers)) {
                    /* eslint-disable indent */
                    swal({
                            title: 'Existe um questionário em andamento',
                            text: 'Você deseja continuar respondendo ou recomeçar?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#0074E0',
                            confirmButtonText: 'Continuar respondendo',
                            cancelButtonText: 'Recomeçar'
                        },
                        () => {
                            Helpers.loadStorageItem(stored);
                            that.questionSet = stored.set;
                            that.loadedAnswers = stored.answers;
                            that.loadQuestions(that.questionSet);
                            window.scrollTo(0, 0);
                            that.step = 2;
                        });
                    /* eslint-enable indent */
                }
            }
        } catch (err) {} // eslint-disable-line

        window.scrollTo(0, 0);
    },
    methods: {
        loadQuestions(questionSet) {
            let questions;
            switch (questionSet) {
                case 'HC':
                    questions = HC;
                    break;

                default:
                    questions = UFMG;
                    break;
            }
            let result = Helpers.prepareQuestionnaire(questions);
            this.questionnaire = result.questionnaire;
            // this.questions = result.questions;
        },

        onUnitChosen(unit) {
            window.scrollTo(0, 0);
            this.questionSet = unit;
            this.step = 1;
        },
        onConsented() {
            window.scrollTo(0, 0);
            this.loadQuestions(this.questionSet);
            this.step = 2;
        },
        onQuestionnaireFinished(answers) {
            window.scrollTo(0, 0);
            this.answers = answers;
            this.step = 3;
        }
    },
};
</script>
