<template>
	<div class="protocol">
		<label> {{this.title}} </label>
		<!-- <a href='#'>
			{{ this.getChildWinVisible === false ? 'Visible Child Window' : 'Invisible Child Window' }}
		</a> -->

		<p>custom todo protocol link <a href="myprotocol://active">active</a>,
		<a href="myprotocol://completed">completed</a></p>
	</div>
</template>

<script>
import Vuex from 'vuex';
import moment from 'moment';
import { ipcRenderer, shell } from 'electron';
import ipcBroadcaster from '@mainRenderer/ipcBroadcaster'

let path = require('path');

export default {
	name: 'Protocol',
	computed: {
		...Vuex.mapGetters(['getChildWinVisible', 'getClickedHistory'])
	},
	data() {
		return {
			title: ''
		};
	},
	mounted() {
		ipcRenderer.on('setPageTitle', (evt, title) => {
			this.title = title;
		})
		ipcBroadcaster.ipcShowChildWin(this.getChildWinVisible);
	},
	methods: {
		...Vuex.mapActions([
			'updateChildVisible'
		]),
		showChildWin(evt) {
			this.updateChildVisible();
			ipcBroadcaster.ipcShowChildWin(this.getChildWinVisible);
		},
		clickProtocolLink(evt) {
			console.log(evt)
			ipcBroadcaster.ipcSendClickedLink(evt.target.href);
		}
	}
};
</script>
<style scoped lang="scss">
.protocol {
	label {
		font-size: 30px;
	};
	padding-top: 4%;
	margin: auto;
	width: 50%;
	color: white;
}
</style>