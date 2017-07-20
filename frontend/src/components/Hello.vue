<template>
<div>
    <div v-if="loading">Loading...</div>
    <div v-else>
        <questionnaire v-if="!finished" :pages="questionnaire" @finished="questionnaireFinished($event)"></questionnaire>
        <overview v-else :questions="questions" :answers="answers"></overview>
    </div>
</div>
</template>

<script>
import Questionnaire from './Questionnaire';
import Overview from './Overview';
import { getQuestionnaire } from '../helpers';

export default {
    components: {
        questionnaire: Questionnaire,
        overview: Overview
    },
    data() {
        return {
            loading: true,
            finished: false,
            questionnaire: null,
            questions: null,
            answers: null,
        };
    },
    created() {
        this.loading = false;
        getQuestionnaire().then(response => {
            this.questionnaire = response.questionnaire;
            this.questions = response.questions;
            this.loading = false;
        });
    },
    methods: {
        questionnaireFinished(answers) {
            this.answers = answers;
            this.finished = true;
        }
    },
};
</script>
