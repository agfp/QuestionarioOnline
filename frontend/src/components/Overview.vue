<template>
<div>
    <h1>Questionário #{{hashCode}}</h1>
    <h2>Perguntas:</h2>
    <ul>
        <li v-for="q in questions">
            {{q}}
        </li>
    </ul>

    <h2>Respostas:</h2>
    <table border="1">
        <thead>
            <tr>
                <th v-for="(val, index) in answers">
                    {{index + 1}}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td v-for="answer in answers">
                    {{answer}}
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    props: ['questions', 'answers', 'hashCode'],
    data() {
        return {

        };
    }
};
</script>

<style scoped>
ul {
    list-style: none;
}
</style>
