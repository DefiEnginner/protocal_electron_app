// Import the required libs.
import moment from 'moment';

const state = {
	clickedHistory: []
};

const getters = {
	getClickedHistory: state => {
		return state.clickedHistory
	}
};

const actions = {
	addClickedHistory({ commit }, newHistory) {
		commit('setChildWinVisible', newHistory);
	}
};

const mutations = {
	addClickedHistory(state, newHistory) {
		state.clickedHistory.push(newHistory);
		console.log('yes itis', clickedHistory);
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
