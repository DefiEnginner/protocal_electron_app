// Import the required libs.
import moment from 'moment';

const state = {
	childWinVisible: false,
	clickedHistory: []
};

const getters = {
	getChildWinVisible: state => {
		return state.childWinVisible;
	},
	getClickedHistory: state => {
		return state.clickedHistory
	}
};

const actions = {
	updateChildVisible({ commit }) {
		commit('setChildWinVisible');
	},
	addClickedHistory({ commit }, newHistory) {
		commit('setChildWinVisible', newHistory);
	}
};

const mutations = {
	setChildWinVisible(state) {
		state.childWinVisible = !state.childWinVisible
	},
	addClickedHistory(state, newHistory) {
		state.clickedHistory.push(newHistory);
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};
