<template>
<div>
    <div v-if="consent1">
        <consent @finished="consent1Finished"></consent>
    </div>
    <div v-if="!consent1 && !finished1">
        <questionnaire :pages="questionnaire" @finished="questionnaireFinished($event)"></questionnaire>
    </div>
    <div v-if="finished1">
        <thank-you></thank-you>
    </div>
</div>
</template>

<script>
// import swal from 'sweetalert';
import questionnaire from './Questionnaire';
import ThankYou from './ThankYou';
import consent from './Consent';
import Helpers from '../helpers';
import sample from '../assets/dev.json';

export default {
    components: {
        questionnaire,
        ThankYou,
        consent
    },
    data() {
        return {
            textarea: null,
            consent1: true,
            finished1: false,
            questionnaire: null,
            questions: null,
            answers: null
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
