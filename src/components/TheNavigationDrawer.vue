<template>
  <v-navigation-drawer
    app
    dark
    :mini-variant="$vuetify.breakpoint.sm"
    :permanent="$vuetify.breakpoint.smAndUp"
    class="base-dark-bg"
    v-model="active" >
    <v-list-item
      class="pt-5">
      <v-list-item-content>
        <v-layout>
        
        <v-app-bar-nav-icon v-if="!$vuetify.breakpoint.smAndUp" class="mr-4 ml-n1" @click="active = !active" />

        <img src="../assets/logo.png" width="24" />

        <v-list-item-title v-if="!$vuetify.breakpoint.sm" class="title ml-2 ml-sm-8" v-text="'APEL-Bulog'" />


      </v-layout>
      </v-list-item-content>
    </v-list-item>

    <!-- <v-divider /> -->

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in navigationMenu"
        :key="item.title"
        :to="item.link"
        link
      >
        <v-tooltip right>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-icon
              v-bind="attrs"
              v-on="on">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <span v-text="item.title" />

        </v-tooltip>
      </v-list-item>
    </v-list>
    <template #append>
      <v-layout column class="pa-4">
        <v-btn v-if="!$vuetify.breakpoint.sm" outlined color="error" class="text-none" @click="signOut()">Keluar</v-btn>

        <v-tooltip right v-else>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="ml-n1 error"
              color="white"
              icon>
              <v-icon @click="signOut()" v-text="'mdi-logout'" />
            </v-btn>
          </template>
          <span v-text="'Keluar'" />
        </v-tooltip>
      </v-layout>
    </template>
  </v-navigation-drawer>
</template>

<script>

export default {
  props: [ 'value' ],
  data: () => ({
    active: null
  }),
  computed: {
    navigationMenu() {
      return this.$store.state.navigationMenu
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch('user/signout')
    }
  },
  mounted() {
    this.active = this.value
  },
  watch: {
    active: {
      immediate: true,
      handler() {
        this.$emit('input', this.active)
      }
    },
    value: {
      immediate: true,
      handler() {
        this.active = this.value
      }
    }
  }
}
</script>

<style>

</style>