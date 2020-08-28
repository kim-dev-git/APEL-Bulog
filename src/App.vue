<template>
  <v-app class="base-bg">
    <notification-list />
    <the-navigation-bar v-if="showNav" />
    <v-main class="mt-2">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import NotificationList from './components/NotificationList'
import TheNavigationBar from '@/components/TheNavigationBar'
export default {
  name: 'App',

  components: {
    NotificationList,
    TheNavigationBar,
  },

  data: () => ({
  }),
  
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    },
    showNav() {
      return Object.keys(this.userProfile).length > 1
    }
  },
};
</script>

<style lang="scss">
  $base: #f8f8f8;
  $base-dark: #10163A;

  #base-bg {
    background-color: $base !important;
  }

  .base-bg {
    background-color: $base !important;
  }

  .base-dark-bg {
    background-color: $base-dark !important;
  }

  .editor-button {
    position: absolute;
    right: -178px;
    bottom: 40px;
  }

  .editor-notes {
    position: absolute;
    right: -40px;
    bottom: 12px;
  }

  .editor-comment {
    position: absolute;
    right: -160px;
    padding: 6px;
    max-width: 120px;
    z-index: 2;
  }
</style>