import Vue from 'vue';
import Vuex from 'vuex';
// Modules
import user from './modules/user';
import appStatus from './modules/appStatus';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
	user,
	appStatus
  },

  strict: true
});
