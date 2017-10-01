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
// questionnaires
import HC from '../assets/hc.json';
import Protocolo1 from '../assets/protocolo1.json';
import Protocolo2 from '../assets/protocolo2.json';

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
            let sets = {
                HC,
                Protocolo1,
                Protocolo2,
            };
            let result = Helpers.prepareQuestionnaire(sets[questionSet]);
            this.questionnaire = result.questionnaire;
        },
        onUnitChosen(unit) {
            let rnd;
            switch (unit) {
                case 'HC':
                    this.questionSet = unit;
                    break;

                default:
                    rnd = parseInt(Math.random() * 100, 10) % 2;
                    this.questionSet = rnd ? 'Protocolo1' : 'Protocolo2';
                    break;
            }
            window.scrollTo(0, 0);
            this.step = 1;
        },
        onConsented() {
            // alert(this.questionSet);

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
