<template>
  <v-bottom-sheet
    persistent
    max-width="640"
    v-model="active" >
    <v-sheet>
      <slot />
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  props: [
    'value',
  ],
  data: () => ({
    active: null
  }),
  methods: {
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