<template>
<div :class="question.options.length > 3 ? 'options-columns' : ''">
    <div v-if="question.multiple">
        <div v-for="option in question.options">
            <div class="option-item pure-checkbox" @click="toggleItem(option)">
                <input :name="option.id" value="1" v-model="answers[option.id]" type="checkbox">
                <label><span class="option-item-text">{{ option.item }}</span></label>
            </div>
        </div>
    </div>
    <div v-else>
        <div v-for="(option, index) in question.options">
            <div class="option-item pure-radiobutton" @click="selectItem(question, index + 1)">
                <input :name="question.id" :value="index + 1" v-model="answers[question.id]" type="radio">
                <label v-if="!option.textbox"><span class="option-item-text">{{ option.item }}</span></label>
                <label v-else>
                    {{ option.item }}
                    <input type="text" class="pure-input" v-model="answers[option.id]" placeholder="Especifique" />
                </label>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['question', 'answers'],
    data() {
        return {};
    },
    methods: {
        selectItem(item, answer) {
            this.$emit('select', item, answer);
        },
        toggleItem(option) {
            this.$emit('toggle', option);
        }
    }
};
</script>

<style lang="scss" scoped>
.options-columns {
    columns: 2;
}

input[type=text] {
    width: 300px;
}

.option-item-text {
    display: inline-block;
    vertical-align: middle;
    word-wrap: normal;
    width: 95%;
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
