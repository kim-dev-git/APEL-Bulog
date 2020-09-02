<template>
  <div class="blue">
    <v-app-bar
      app
      flat
      color="transparent"
      class="pt-6 base-bg"
      id="base-bg"
    >
      <v-container>
        <v-layout column class="mx-n4 mx-xl-0">
          <v-card class="pa-4" style="height: 55px">
            <v-layout class="align-center mt-n3">
              <v-app-bar-nav-icon v-if="!$vuetify.breakpoint.smAndUp" @click="drawer = !drawer" />

              <v-spacer />

              <v-avatar
                v-if="userProfile"
                color="red darken-1"
                size="36"
                class="mt-1">
                <span v-if="userProfile.position" v-text="userProfile.position.substr(0, 1)" class="white--text font-weight-bold" />
              </v-avatar>
            </v-layout>
          </v-card>
        </v-layout>
      </v-container>
    </v-app-bar>

    <the-navigation-drawer v-model="drawer" />
  </div>
</template>

<script>

import TheNavigationDrawer from '@/components/TheNavigationDrawer'
export default {
  components: {
    TheNavigationDrawer,
  },
  data: () => ({
    drawer: null
  }),
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    }
  }
}
</script>

<style>

</style>