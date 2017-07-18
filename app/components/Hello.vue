<template>
<div class="hello">
    <h1 v-if="loading">Loading...</h1>
    <teste v-else></teste>
</div>
</template>

<script>
import Teste from './Teste.vue';

export default {
    name: 'hello',
    data() {
        return {
            loading: true,
            json: null
        };
    },
    created: function() {
        
    },
    methods: {

    },
    components: {
        'teste': Teste
    }
};
</script>
