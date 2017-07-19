<template>
<div>
    <div v-if="loading">Loading...</div>
    <div v-else>
        <!-- <overview :questions="questions"></overview> -->
        <questionnaire :pages="questionnaire"></questionnaire>
    </div>
</div>
</template>

<script>
import Questionnaire from './Questionnaire';
import Summary from './Summary';
import { getQuestionnaire } from '../helpers';

export default {
    components: {
        questionnaire: Questionnaire,
        overview: Summary
    },
    data() {
        return {
            loading: true,
            questionnaire: null,
            questions: null
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

    },
};
</script>
