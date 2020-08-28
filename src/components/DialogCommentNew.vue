<template>
  <dialog-sheet
    v-model="active" >
    <v-layout id="dialog-header"
      class="align-center">
      <v-card-title v-text="Number.isInteger(data) ? ('Tambahkan Komentar ke list-' + (data + 1)) : 'Tambahkan Komentar ke ' + data" />
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
      <v-textarea
        v-model="input"
        @input="onInput($event)"
        outlined
        auto-grow
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
    DialogSheet,
  },
  props: [
    'value',
    'data',
    'form',
  ],
  data: () => ({
    active: null,
    input: null,
  }),
  methods: {
    onSave() {
      this.$emit('save')
      this.input = null
    },
    onInput(val) {
      this.$emit('update', val)
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