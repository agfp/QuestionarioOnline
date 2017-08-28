<template>
<div>
    <div v-if="consent">
        <consent @finished="consent1Finished"></consent>
    </div>
    <div v-if="!consent && !finished">
        <questionnaire :pages="questionnaire"
                       :loaded-answers="loadedAnswers"
                       :set="questionSet"
                       @finished="questionnaireFinished($event)"></questionnaire>
    </div>
    <div v-if="finished">
        <thank-you></thank-you>
    </div>
</div>
</template>

<script>
import swal from 'sweetalert';
import questionnaire from './Questionnaire';
import ThankYou from './ThankYou';
import consent from './Consent';
import Helpers from '../helpers';
import sample from '../assets/hc.json';

export default {
    components: {
        questionnaire,
        ThankYou,
        consent
    },
    data() {
        return {
            textarea: null,
            consent: true,
            finished: false,
            questionnaire: null,
            questions: null,
            answers: null,
            questionSet: 'HC',
            loadedAnswers: null
        };
    },
    mounted() {
        let that = this;
        let result = Helpers.prepareQuestionnaire(sample);
        this.questionnaire = result.questionnaire;
        this.questions = result.questions;

        try {
            let answers = localStorage.getItem(Helpers.PARAMETERS.key);
            if (answers) {
                let arr = JSON.parse(answers);
                if (Array.isArray(arr)) {
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
                        that.consent = false;
                        that.loadedAnswers = arr;
                        window.scrollTo(0, 0);
                    });
                }
            }
        }
        catch (err) { }

        window.scrollTo(0, 0);
    },
    methods: {
        consent1Finished() {
            this.consent = false;
            window.scrollTo(0, 0);
        },
        questionnaireFinished(answers) {
            this.answers = answers;
            this.finished = true;
            window.scrollTo(0, 0);
        }
    },
};
</script>

<style scoped>
textarea {
    width: 500px;
    height: 500px;
}
</style>
