<template>
<div>
    <div :class="{header: true, fixed: fixedHeader}" ref="header">
        <div class="question">&nbsp;</div>
        <div :class="{option:true, 'option-100': question.headers.length <= 5 }" v-for="header in question.headers">{{header}}</div>
    </div>
    <div class="rows">
        <div :class="{row: true, pending: showPending && !answers[item.id]}" v-for="item in question.matrix">
            <div class="question">
                {{item.item}}
            </div>
            <div v-for="(option, index) in question.headers" @click="selectItem(item, index + 1)" :class="{option:true, 'option-100': question.headers.length <= 5 }">
                <div class="pure-radiobutton">
                    <input :name="item.id" :value="index + 1" v-model="answers[item.id]" type="radio">
                    <label></label>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
/* global Waypoint */

export default {
    props: ['question', 'showPending', 'answers'],
    data() {
        return {
            fixedHeader: false
        };
    },
    mounted() {
        let that = this;
        /* eslint-disable no-new */
        new Waypoint({
            element: this.$refs.header,
            handler(direction) {
                that.fixedHeader = direction === 'down';
            }
        });
    },
    methods: {
        selectItem(item, answer) {
            this.$emit('select', item, answer);
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
    z-index: 1;

    .option {
        border-bottom: 1px solid $border-color;
    }
}

.question {
    flex-grow: 1;
}

.option-100 {
    flex: 0 0 90px !important;
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
    &:nth-child(even) {
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
