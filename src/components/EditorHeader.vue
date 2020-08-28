<template>
  <v-list>
    <v-list-item-group>
      <v-list-item
        dense
        v-for="form in forms"
        :key="form.value"
        @click="onClick(form.value)" >
        <v-list-item-content>
          <p class="mb-0 body-2" v-text="form.label" />
        </v-list-item-content>
        <v-list-item-action>
          <p class="mb-0 body-2" v-if="document && document[form.value]" v-text="document[form.value]" />
          <p class="mb-0 body-2 font-weight-bold" v-else v-text="`-`" />
        </v-list-item-action>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
export default {
  props: [
    'forms',
    'document',
  ],
  methods: {
    onClick(val) {
      this.$emit('click', val)
    }
  }
}
</script>

<style>

</style>