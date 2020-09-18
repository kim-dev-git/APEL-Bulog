<template>
  <div id="card-item">
    <v-card
      height="120"
      width="320"
      class="ma-2 mb-4"
      @click="onClick(item)" >
      <v-layout
        class="pa-4"
        :style="leftBorder('grey')"
        column>   
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <p 
              v-bind="attrs"
              v-on="on"
              v-text="item.document.subject"
              class="d-inline-block text-truncate font-weight-bold mb-0"
              style="max-width: 300px;"
            />
          </template>
          <p v-text="item.document.subject" class="font-weight-medium mb-0" />
        </v-tooltip>
        <p v-text="item.document.from" class="mb-0" />
        <v-divider class="my-2" />
        <v-layout class="align-center">
          <v-chip v-if="item.status" v-text="item.status" color="info" small />
          <v-chip v-else v-text="'Perlu ditindak lanjuti'" color="warning" small />
          <v-spacer />
          <v-icon v-text="'mdi-clock-outline'" class="mr-1" small />
          <span v-text="$options.filters.fullDate(item.createdAt)" class="text--secondary caption" />
        </v-layout>
        <!-- <div style="position: absolute; bottom: 1;">
          <p class="mb-n1 title" v-text="item.document.subject" />
          <v-icon
            small
            left
            class="text--secondary"
            v-text="item.icon"
          />
          <span
            class="caption text--secondary"
            v-text="item.document.from"
          />
        </div> -->
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [ 'item' ],
  methods: {
    leftBorder(color) {
      var style = ''
      const thick = 6
      style = `border-left: ${ thick }px solid ${ color } !important; height: 100%;`
      return style
    },
    onClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style>
  .bLeft {
    border-left: 4px solid red;
  }
</style>