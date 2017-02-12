<template>
  <header class="z-depth-2">

    <ul class="top-nav">
      <router-link tag="li" to="/" exact>
        <h6>Home</h6>
      </router-link>
    </ul>
  </header>
</template>

<script>
import Vuex from 'vuex';


export default {
  name: 'TopNavBar',
  mounted() {
    // Initialise the Material JS so modals, drop down menus etc function.
    M.AutoInit();
  }
};
</script>
