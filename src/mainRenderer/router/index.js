// Vue components
import Vue from 'vue';
import Router from 'vue-router';
// Main Components
import Protocol from '@mainRenderer/components/protocol/Protocol';

// Inject the router into the app.
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Protocol },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
