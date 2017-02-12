<template>
  <div id="app" class="bg-gradient">

    <div class="wrapper">
      <div class="nav">
        <top-nav-bar></top-nav-bar>
      </div>

      <div class="main-content">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Vuex from 'vuex';
import TopNavBar from '@mainRenderer/components/TopNavBar.vue';
import Protocol from '@mainRenderer/components/protocol/Protocol.vue'

export default {
  name: 'App',
  components: {  TopNavBar, Protocol}
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
