<template>
<div id="consent">
    <div class="title-bar">
        <h1>Termo de Consentimento Livre e Esclarecido</h1>
    </div>

    <hc v-if="questionSet === 'HC'"></hc>
    <generic v-else></generic>

    <div class="pagination">
        <a href="http://www.qvt-ufmg.com.br/"
            class="pure-button">Quero saber mais</a>
        <button class="pure-button pure-button-primary"
            @click="finish()">Eu concordo</button>
    </div>
</div>
</template>

<script>
import hc from './consents/HC';
import generic from './consents/Generic';

export default {
    props: ['questionSet'],
    components: {
        hc,
        generic
    },
    data() {
        return {};
    },
    methods: {
        finish() {
            this.$emit('finished');
        }
    }
};
</script>

<style lang="scss">
#consent {
    .title-bar {
        background: whitesmoke;
        padding: 20px;
        border-bottom: 1px solid lightgray;
        text-align: center;

        h1 {
            padding: 0;
            margin: 0;
        }
    }

    .texto {
        padding: 0 20px;
        font-size: 11pt;
    }

    .signature {
        text-align: center;
        font-family: 'Open Sans', sans-serif;
        line-height: 15pt;
    }

    .bold {
        font-weight: bold;
    }

    .pagination {
        text-align: center;
        padding: 20px;
        background: whitesmoke;
        border-top: 1px solid lightgray;

        span {
            margin: 0 10px;
        }
    }
}
</style>
