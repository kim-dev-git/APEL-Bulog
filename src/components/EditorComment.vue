<template>
  <div id="editor-comment">
    <v-btn
      v-if="text"
      icon
      class="editor-notes"
      @click.stop="$emit('input', !value)" >
      <v-icon v-text="'mdi-comment-alert'" />
    </v-btn>
    <v-btn
      v-if="!text && userProfile && userProfile.position === 'Pimwil'"
      icon
      class="editor-notes"
      @click.stop="$emit('add')" >
      <v-icon v-text="'mdi-comment-edit'" />
    </v-btn>
    <v-card
      v-if="value"
      class="editor-comment warning white--text"
      @click.stop="userProfile.position === 'Pimwil' ? $emit('remove') : ''" >
      <span v-text="text" />
    </v-card>
  </div>
</template>

<script>
export default {
  props: [ 'value', 'text' ],
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    }
  }
}
</script>

<style>

</style>