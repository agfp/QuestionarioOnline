<template>
<div id="consent">
    <div class="title-bar">
        <h1>Questionário de Condições de Trabalho</h1>
    </div>

    <div class="wrapper">
        <h2>Unidade de Origem</h2>

        <div class="option-item pure-radiobutton"
            v-for="(option, index) in options"
            @click="selectItem(index)">
            <input :name="index"
                :value="index"
                v-model="selected"
                type="radio">
            <label>
            <span class="option-item-text" v-html="option.label"></span>
        </label>
        </div>

    </div>
    <div class="pagination">
        <button class="pure-button pure-button-primary"
            :disabled="selected === null"
            @click="finish()">Iniciar o questionário</button>
    </div>
</div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            options: [
                { value: 'HC', label: 'Hospital das Clínicas &ndash; UFMG' },
                { value: 'UFMG', label: 'Campus Pampulha &ndash; UFMG' },
                { value: 'UFMG', label: 'Campus Saúde &ndash; UFMG' },
                { value: 'UFMG', label: 'Outras unidades &ndash; UFMG' },
                { value: 'Outro', label: 'Outras instituições de ensino superior' },
            ],
            selected: null
        };
    },
    methods: {
        selectItem(index) {
            this.selected = index;
        },
        finish() {
            let set = this.options[this.selected].value;
            this.$emit('finished', set);
        }
    }
};
</script>

<style scoped lang="scss">
.wrapper {
    padding: 0 20px;
    margin-bottom: 20px;
}

.title-bar {
    background: whitesmoke;
    padding: 20px;
    border-bottom: 1px solid lightgray;

    h1 {
        padding: 0;
        margin: 0;
    }
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

.option-item {
    padding: 5px;
    cursor: pointer;
    break-inside: avoid-column;
    &:hover {
        background: lightyellow;
    }

    input[type=radio],
    label {
        cursor: pointer;
    }

    input[type=text] {
        margin-bottom: 4px;
    }
}
</style>
