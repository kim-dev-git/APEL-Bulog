<template>
  <dialog-sheet
    v-model="active" >
    <v-layout id="dialog-header"
      class="align-center">
      <v-card-title v-if="data !== null" v-text="getTitle()" />
      <v-spacer />
      <v-btn
        v-if="Number.isInteger(data)"
        text
        color="error"
        class="text-none"
        @click="onRemove()" >
        <v-icon left v-text="'mdi-delete-outline'" />
        Hapus
      </v-btn>
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
        v-if="form && form.content && active && !Number.isInteger(data)"
        outlined
        auto-grow
        autofocus
        v-model="form.content[data]"
      />

      <v-textarea
        v-if="form && form.content && active && Number.isInteger(data)"
        outlined
        auto-grow
        autofocus
        v-model="form.content.list[data]"
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
    active: null
  }),
  methods: {
    onSave() {
      this.$emit('save')
    },
    onRemove() {
      this.$emit('remove')
    },
    getTitle() {
      const val = this.data
      if (val === 'body') {
        return 'Isi Berita'
      } else if (val === 'footer') {
        return 'Penutup'
      } else {
        return `List Ke-${ val + 1 }`
      }
    },
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