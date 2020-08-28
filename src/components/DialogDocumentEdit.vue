<template>
  <dialog-sheet
    v-model="active">
    <v-layout id="dialog-header"
      class="align-center">
      <v-card-title v-if="data" v-text="data.label" />
      <v-spacer />
      <v-btn
        text
        class="text-none"
        @click="active = false" >
        <v-icon left v-text="'mdi-close'" />
        Tutup
      </v-btn>
    </v-layout>

    <v-layout id="dialog-body"
      class="px-4" >
      <v-text-field
        v-if="data"
        :type="data.type"
        outlined
        v-model.trim="form[data.value]"
        autofocus
      />
    </v-layout>

    <v-layout id="dialog-action"
      class="px-4 mt-n4 pb-4">
      <v-spacer />
      <v-btn
        color="primary"
        class="text-none"
        @click="onSave()" >
        <span class="px-4" v-text="'Simpan'" />
      </v-btn>
    </v-layout>
  </dialog-sheet>
</template>

<script>

import DialogSheet from './DialogSheet'
export default {
  components: {
    DialogSheet
  },
  props: [
    'value',
    'data',
    'form',
  ],
  data: () => ({
    active: null
  }),
  methods: {
    onSave() {
      this.$emit('save')
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