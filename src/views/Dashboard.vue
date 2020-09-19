<template>
  <div id="home">
    <section>
      <v-card-title class="ml-n4 headline text--secondary" v-text="'Dashboard'" />
      <v-card
        v-if="userProfile && userProfile.position"
        class="pa-4 mt-n2">
        <span v-text="'Selamat datang '" />
        <span v-text="userProfile.position" class="font-weight-bold" />
      </v-card>
    </section>

    <section
      class="mx-n1 px-1">
      <v-card-title class="ml-n4 headline text--secondary" v-text="'Disposisi (' + myDisposition.length + ')'" />
      <v-card
        class="mt-n3 transparent"
        flat>
        <card-list :items="myDisposition" @click="cardClick($event)" />
      </v-card>
    </section>
  </div>
</template>

<script>

import CardList from '../components/CardList'
export default {
  name: 'Home',
  components: {
    CardList
  },
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    },
    myDisposition() {
      return this.$store.state.myDisposition
    }
  },
  methods: {
    cardClick(item) {
      this.$router.push(`/${ item.type }/${ item.document.id }/disposisi`)
    }
  }
}
</script>
