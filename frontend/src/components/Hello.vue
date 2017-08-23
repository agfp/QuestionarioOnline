<template>
<div>
    <div v-if="consent1">
        <consent @finished="consent1Finished"></consent>
    </div>
    <div v-if="!consent1 && !finished1">
        <questionnaire :pages="questionnaire" @finished="questionnaireFinished($event)"></questionnaire>
    </div>
    <div v-if="finished1">
        <overview :questions="questions" :answers="answers" :hashCode="hashCode"></overview>
    </div>
    <!-- <div v-if="consent2">
        <consent @finished="consent2Finished"></consent>
    </div>
    <div v-if="q2">
        <questionnaire :pages="stress"></questionnaire>
    </div> -->
</div>
</template>

<script>
// import swal from 'sweetalert';
import questionnaire from './Questionnaire';
import overview from './Overview';
import consent from './Consent';
import Helpers from '../helpers';
import sample from '../assets/hc.json';
import stress from '../assets/stress.json';

export default {
    components: {
        questionnaire,
        overview,
        consent
    },
    data() {
        return {
            textarea: null,
            consent1: true,
            finished1: false,
            consent2: false,
            q2: false,
            finished2: false,
            questionnaire: null,
            stress: null,
            questions: null,
            answers: null,
            hashCode: null,
        };
    },
    mounted() {
        let result = Helpers.prepareQuestionnaire(sample);
        this.questionnaire = result.questionnaire;
        this.questions = result.questions;
        window.scrollTo(0, 0);
    },
    methods: {
        consent1Finished() {
            this.consent1 = false;
            window.scrollTo(0, 0);
        },
        consent2Finished() {
            this.consent2 = false;
            this.q2 = true;

            let result = Helpers.prepareQuestionnaire(stress);
            this.stress = result.questionnaire;
            this.questions = result.questions;
            window.scrollTo(0, 0);

        },
        questionnaireFinished(answers) {
            this.answers = answers;
            this.finished1 = true;
            this.consent2 = true;
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
