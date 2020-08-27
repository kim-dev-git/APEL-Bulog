<template>
  <v-navigation-drawer
    app
    dark
    :permanent="$vuetify.breakpoint.smAndUp"
    class="base-dark-bg"
    v-model="active" >
    <v-list-item
      class="pt-5">
      <v-list-item-content>
        <v-layout>
        
        <v-app-bar-nav-icon v-if="!$vuetify.breakpoint.smAndUp"class="mr-4 ml-n1" @click="active = !active" />

        <v-list-item-title class="title" v-text="'APEL-Bulog'" />
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
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template #append>
      <v-layout column class="pa-4">
        <v-btn outlined color="error" class="text-none" @click="signOut()">Keluar</v-btn>
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