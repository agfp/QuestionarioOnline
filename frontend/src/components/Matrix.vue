<template>
<div>
    <div class="header">
        <div class="question">&nbsp;</div>
        <div class="option" v-for="header in question.headers">{{header}}</div>
    </div>
    <div class="row" v-for="item in question.matrix">
        <div class="question">
            {{item.item}}
        </div>
        <div v-for="(option, index) in question.headers" @click="selectItem(item, index + 1)" class="option">
            <div class="pure-radiobutton">
                <input :name="item.id" :value="index + 1" v-model="answers[item.id]" type="radio">
                <label></label>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['question', 'showPending', 'answers'],
    data() {
        return {};
    },
    methods: {
        selectItem(item, answer) {
            this.$emit('select', {
                item,
                answer
            });
        },
        validateItem() {
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
$matrix-width: 790px;
$border-color: lightgray;

.fixed {
    position: fixed;
    top: 0;
}

.question {
    flex-grow: 1;
}

.option {
    flex: 0 0 80px;
    border: 1px solid $border-color;
    border-right: 1px solid transparent;
    border-bottom: 1px solid transparent;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    &:last-child {
        border-right: 1px solid $border-color;
    }
}

.header {
    display: flex;
    width: $matrix-width;
    font-weight: bold;
    font-size: 11pt;

    .question {
        background: white;
    }

    .option {
        background-color: #eee;
    }
}

.row {
    display: flex;
    width: $matrix-width;
    &:nth-child(odd) {
        background-color: #eee;
    }
    &:last-child {
        border-bottom: 1px solid $border-color;
    }
    &:hover {
        background: lightyellow;
    }

    .question {
        padding: 5px;
        border: 1px solid $border-color;
        border-right: 1px solid transparent;
        border-bottom: 1px solid transparent;
    }

    .option {
        cursor: pointer;

        label {
            padding: 0 0 0 15px;
        }
    }
}
</style>
