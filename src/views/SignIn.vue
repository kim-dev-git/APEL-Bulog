<template>
  <div id="sign-in">
    <v-layout
      class="align-center justify-center"
      style="height: 100vh" >
      <v-card :flat="!$vuetify.breakpoint.mdAndUp" elevation="6">
        <v-layout row class="mx-0">
          <v-flex xs12 md6 class="grey lighten-4">
            <v-container class="justify-center align-center fill-height">
              <img src="@/assets/undraw_work_time_lhoj.svg" width="240" />
            </v-container>
          </v-flex>
          <v-flex xs12 md6 class="pa-4">
            <v-layout column>
              <v-layout>
                <p class="title" v-text="'Masuk'" />
                <v-spacer />
                <img src="@/assets/logo_full.jpg" height="32" />
              </v-layout>
              <p class="text--secondary" v-text="'Silahkan masukkan email dan password untuk masuk'" />

              <v-text-field dense outlined label="Username" v-model.trim="signInForm.username" />
              <v-text-field dense outlined type="password" label="Password" v-model.trim="signInForm.password" class="mt-n2" />

              <v-layout>
                <v-btn
                  outlined
                  color="primary"
                  class="text-none"
                  :to="'/daftar'">
                  <span class="mx-4" v-text="'Daftar'" />
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  class="text-none"
                  @click="userSignIn()">
                  <span class="mx-4" v-text="'Masuk'" />
                </v-btn>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
export default {
  data: () => ({
    signInForm: {
      username: null,
      password: null
    }
  }),
  computed: {
  },
  methods: {
    userSignIn() {
      this.$store.dispatch('user/signin', {
        username: this.signInForm.username,
        password: this.signInForm.password
      })
    }
  }
}
</script>

<style>

</style>