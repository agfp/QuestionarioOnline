<template>
<div>
    <div class="title-bar">
        <h1>Termo de Livre Consentimento Esclarecido</h1>
    </div>
    <div class="texto">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida rutrum est in pretium. Nunc non commodo dui. Maecenas in ligula euismod, dapibus nulla eu, tempor turpis. Nullam urna justo, ultrices vel egestas vel, faucibus sed libero. Proin in
            felis sit amet enim porta imperdiet quis quis tortor. Sed dapibus lectus eu velit pellentesque, non tempus massa consequat. Nam aliquet orci in est pellentesque, sit amet molestie nisi euismod. Aenean ut dui aliquam, volutpat metus quis, auctor
            nunc. Maecenas ut nunc dapibus ex tristique convallis eget nec nulla. Pellentesque in dolor eu dui condimentum sagittis. Pellentesque mattis auctor volutpat. Mauris quis neque nisl. Nullam varius nunc elit, ut ullamcorper nibh mollis sed.
            Vivamus tristique facilisis felis, ac malesuada dolor malesuada sit amet.
        </p>
        <p>
            Integer tristique nec sapien venenatis finibus. Etiam ultrices venenatis elit, sed malesuada dolor dapibus quis. Sed non tellus sit amet lacus dictum eleifend sit amet eu erat. In blandit consequat nibh eget rutrum. Phasellus hendrerit erat a feugiat
            scelerisque. Pellentesque imperdiet, mauris id tristique finibus, ipsum sapien efficitur nisl, sit amet euismod dui nulla vel ex. Mauris aliquam ac justo at facilisis. Nam at turpis pulvinar, volutpat ante congue, tristique purus. Integer
            risus sem, tristique quis ex ut, hendrerit aliquam lectus. Ut in tellus augue. Nunc porttitor consectetur elit sit amet ornare.
        </p>
        <p>
            Mauris in efficitur risus. Suspendisse neque ligula, tincidunt sit amet volutpat vel, scelerisque et turpis. Sed vitae auctor sapien. Mauris a pharetra enim. Sed dictum nibh vel felis tempus aliquam. Cras nec lectus interdum libero porta condimentum.
            Suspendisse dapibus eros non tristique pellentesque. Sed pretium orci in purus dapibus commodo.
        </p>
    </div>
    <div class="pagination">
        <button class="pure-button">Quero saber mais</button>
        <button class="pure-button pure-button-primary" @click="finish()">Eu concordo</button>
    </div>
</div>
</template>

<script>
export default {
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

<style lang="scss" scoped>
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
</style>
