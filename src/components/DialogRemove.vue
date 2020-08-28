<template>
  <dialog-modal
    v-model="active">
    <v-card-text v-text="title" class="ml-n4 subtitle-1" />

    <slot />
    
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
        color="grey"
        class="text-none"
        @click="active = false" >
        <span class="mx-4" v-text="'Batal'" />
      </v-btn>
      <v-btn
        color="error"
        class="text-none"
        @click="onRemove()" >
        <span class="mx-4" v-text="'Hapus'" />
      </v-btn>
    </v-card-actions>
  </dialog-modal>
</template>

<script>

import DialogModal from './DialogModal'
export default {
  components: {
    DialogModal,
  },
  props: [
    'value',
    'title',
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