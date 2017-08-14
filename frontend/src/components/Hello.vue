<template>
<div>
    <div v-if="loading">
        <h2>Cole o questionário:</h2>
        <textarea v-model="textarea"></textarea>
        <div>
            <button @click="newQuestionnaire">Concluido</button>
        </div>
    </div>
    <div v-else>
        <questionnaire v-if="!finished" :pages="questionnaire" @finished="questionnaireFinished($event)"></questionnaire>
        <overview v-else :questions="questions" :answers="answers" :hashCode="hashCode"></overview>
    </div>
</div>
</template>

<script>
import swal from 'sweetalert';
import Questionnaire from './Questionnaire';
import Overview from './Overview';
import Helpers from '../helpers';
import sample from '../assets/sample.json';

export default {
    components: {
        questionnaire: Questionnaire,
        overview: Overview
    },
    data() {
        return {
            textarea: null,
            loading: true,
            finished: false,
            questionnaire: null,
            questions: null,
            answers: null,
            hashCode: null,
        };
    },
    created() {
        let result = Helpers.prepareQuestionnaire(sample);
        this.questionnaire = result.questionnaire;
        this.questions = result.questions;
        this.loading = false;
        // getQuestionnaire().then(response => {
        //     this.questionnaire = response.questionnaire;
        //     this.questions = response.questions;
        //     this.loading = false;
        // });
    },
    methods: {
        newQuestionnaire() {
            try {
                let questionnaire = JSON.parse(this.textarea);
                this.hashCode = Helpers.hashCode(JSON.stringify(questionnaire));
                let result = Helpers.prepareQuestionnaire(questionnaire);
                this.questionnaire = result.questionnaire;
                this.questions = result.questions;
                this.loading = false;
            }
            catch (e) {
                swal('Questionário inválido', 'O questionário não está em formato válido', 'error');
            }
        },

        questionnaireFinished(answers) {
            this.answers = answers;
            this.finished = true;
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
