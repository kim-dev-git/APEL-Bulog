<template>
  <div id="card-list">
    <v-layout
      class="ma-n2 overflow-x-auto"
      :class="!$vuetify.breakpoint.smAndUp ? 'hide-scroll' : ''">
      <card-item
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        @click="onClick($event)"
      />
    </v-layout>
  </div>
</template>

<script>

import CardItem from './CardItem'
export default {
  components: {
    CardItem
  },
  props: [ 'items' ],
  methods: {
    onClick(item) {
      this.$emit('click', item)
    }
  }
}
</script>

<style lang="scss">
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scroll::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .hide-scroll {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>