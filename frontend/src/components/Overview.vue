<template>
<div class="overview">
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

    <h2>Perguntas:</h2>
    <ul>
        <li v-for="q in questions">
            {{q}}
        </li>
    </ul>
</div>
</template>

<script>
export default {
    props: ['questions', 'answers'],
};
</script>

<style lang="scss" scoped>
.overview {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: white;
    overflow: scroll;
}

ul {
    list-style: none;
}
</style>
