<template>
<div>
    <ul>
        <li v-for="q in questions">
            {{q}}
        </li>
    </ul>
</div>
</template>

<script>
export default {
    props: ['questions'],
    data() {
        return {

        };
    },
    created() {

    }
};
</script>

<style scoped>
ul {
    list-style: none;
}
</style>
