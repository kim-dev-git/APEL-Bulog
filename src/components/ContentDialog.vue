<template>
  <v-dialog
    persistent
    max-width="400"
    v-model="value"
    :key="reRender"
  >
    <v-card
      class="pa-4">
      <v-layout
        class="align-center">
        <span class="subtitle-2" v-text="title" />
        <v-spacer />
        <v-icon v-text="'mdi-close'" @click="$emit('input', false)" />
      </v-layout>

      <v-divider class="mt-4" />
      
      <v-layout column>
        <slot />
      </v-layout>

      <v-card-actions
        v-if="buttonSave"
        class="mt-4">
        <v-spacer />
        <v-btn
          text
          color="grey"
          @click="$emit('input', false), reRender += 1" >
          <span class="mx-4" v-text="'Batal'" />
        </v-btn>
        <v-btn
          color="primary"
          @click="$emit('save'), reRender += 1" >
          <span class="mx-4" v-text="buttonSave" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [
    'value',
    'title',
    'buttonSave',
  ],
  data: () => ({
    dialogActive: true,
    reRender: 0
  }),
}
</script>

<style>

</style>