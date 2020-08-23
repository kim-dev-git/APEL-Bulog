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
                <p class="title" v-text="'Daftar'" />
                <v-spacer />
                <img src="@/assets/logo_full.jpg" height="32" />
              </v-layout>
              <p class="text--secondary" v-text="'Silahkan isi jabatan, username dan password untuk daftar akun'" />

              <v-combobox
                dense
                outlined
                label="Jabatan"
                :items="positions"
                item-text="full"
                item-value="short"
                v-model.trim="signUpForm.position"
                :return-object="false"
              />
              <v-text-field
                dense
                outlined
                type="text"
                label="Username"
                hint="Tidak boleh menggunakan spasi dan simbol"
                v-model.trim="signUpForm.username" class="mt-n2"
              />
              <v-text-field
                dense
                outlined
                type="password"
                label="Password"
                v-model.trim="signUpForm.password"
                class="mt-n2"
              />

              <v-layout>
                <v-btn
                  outlined
                  color="primary"
                  class="text-none"
                  :to="'/masuk'">
                  <span class="mx-4" v-text="'Masuk'" />
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  class="text-none"
                  @click="userSignUp()">
                  <span class="mx-4" v-text="'Daftar'" />
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
    signUpForm: {
      position: null,
      email: null,
      password: null
    },
    positions: [
      { full: 'Tata Usaha', short: 'TU' },
      { full: 'Pimpinan Wilayah', short: 'Pimwil' },
      { full: 'Kabid MINKU', short: 'Kabid MINKU' },
      { full: 'Kabid ADA', short: 'Kabid ADA' },
      { full: 'Kabid OPP', short: 'Kabid OPP' },
      { full: 'Kabid KOM', short: 'Kabid KOM' },
      { full: 'Kabid PBI', short: 'Kabid PBI' },
    ]
  }),
  computed: {
  },
  methods: {
    userSignUp() {
      this.$store.dispatch('user/signup', {
        position: this.signUpForm.position,
        username: this.signUpForm.username,
        password: this.signUpForm.password
      })
    }
  }
}
</script>

<style>

</style>