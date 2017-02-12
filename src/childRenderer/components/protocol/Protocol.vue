<template>
	<div class="splash">
		<p> Let's see what you clicked at main window </p>
		<ul>
			<li v-for="history in clickedHistory" :key="history" class="card">
				<label> {{history}} </label>
			</li>
		</ul>
	</div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import { ipcRenderer, shell } from 'electron';

let path = require('path');

export default {
	name: 'Protocol',
	data() {
		return {
			clickedHistory: ['todo2://wefweg', 'todo3://egweg']
		};
	},
	mounted() {
		console.log("I'm mounted and listening")
		ipcRenderer.on('sendClickedLink', (event, href) => {
			this.clickedHistory.push(href);
		})
	},
	methods: {
		
	}
};
</script>
