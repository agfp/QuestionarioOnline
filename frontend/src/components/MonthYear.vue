<template>
<div>
    <select v-model="month" @change="updateValue">
        <option style="display: none;"></option>
        <option v-for="month in months">{{month}}</option>
    </select>
    /
    <select v-model="year" @change="updateValue">
        <option style="display: none;"></option>
        <option v-for="n in Array(76).fill().map((_, i) => i+1942)">{{n}}</option>
    </select>
</div>
</template>

<script>
import helpers from '../helpers';

export default {
    props: ['question', 'answers'],
    data() {
        return {
            month: null,
            year: null,
            months: helpers.MONTHS
        };
    },
    mounted() {
        if (this.answers[this.question.id]) {
            let split = this.answers[this.question.id].split('/');
            this.month = split[0];
            this.year = split[1];
        }
    },
    methods: {
        updateValue() {
            if (this.month && this.year) {
                let value = `${this.month}/${this.year}`;
                this.$emit('date-selected', this.question, value);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
select {
    height: 2.5em;
}
</style>
