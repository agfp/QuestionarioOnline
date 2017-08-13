<template>
<div id="app">
    <div class="container">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
export default {
    name: 'app',
};
</script>

<style>
body {
    background: url(/static/background2.jpg);
    /*background-repeat: no-repeat;*/
    background-attachment: fixed;
    background-size: 100%;
}

#app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.container {
    max-width: 850px;
    margin: auto;
    padding: 10px;
    border: 1px solid whitesmoke;
    box-shadow: 1px 1px 10px gray;
    margin-top: 5px;
    background: white;
}
</style>
