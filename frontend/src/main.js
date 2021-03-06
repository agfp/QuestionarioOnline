// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'axios';
import 'sweetalert';
import 'waypoints/lib/noframework.waypoints';

import 'sweetalert/dist/sweetalert.css';
import 'purecss/build/pure.css';
import './assets/pure-css-checkbox.css';
import './assets/styles.scss';

import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
});
