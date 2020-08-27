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

              <!-- <v-toolbar-title v-text="drawer" /> -->

              <v-spacer />

              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
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
  })
}
</script>

<style>

</style>