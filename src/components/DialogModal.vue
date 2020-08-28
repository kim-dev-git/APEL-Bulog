<template>
  <v-dialog
    max-width="400"
    v-model="active"
    @input="active = !active">
    <v-card class="pa-4">
      <slot />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'value'
  ],
  data: () => ({
    active: null
  }),
  methods: {
    onRemove() {
      this.$emit('remove')
    }
  },
  watch: {
    active() {
      this.$emit('input', this.active)
    },
    value() {
      this.active = this.value
    }
  },
  mounted() {
    this.active = this.value
  }
}
</script>

<style>

</style>