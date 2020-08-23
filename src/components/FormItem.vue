<template>
  <div id="form-item">
    <div id="input-normal"
      v-if="form.type === 'text' ||
      form.type === 'number' ||
      form.type === 'email' ||
      form.type === 'password'">
      <v-layout
        style="height: 55px"
        class="align-center"
        @click="dialog = true" >
        <v-icon v-if="form.icon" class="mx-4">{{ form.icon }}</v-icon>
        <v-layout>
          <input
            style="width: 100%; height: 55px"
            :class="!form.icon ? 'ml-1' : ''"
            :id="form.value"
            :type="form.type"
            :placeholder="form.label"
            @input="form.type === 'number' ?
            updateData(Number($event.target.value)) :
            updateData($event.target.value)"
            v-model="newValue" />
        </v-layout>
      </v-layout>
    </div>

    <div id="input-combobox"
      v-else-if="form.type === 'combobox'">
      <v-layout
        style="height: 55px"
        class="align-center"
        @click="dialog = true" >
        <v-icon v-if="form.icon" class="mx-4">{{ form.icon }}</v-icon>
        <p v-if="!value" class="mb-0 text--disabled" :class="!form.icon ? 'ml-14' : ''">{{ form.label }}</p>
        <p v-else class="mb-0" :class="!form.icon ? 'ml-1' : ''">{{ value }}</p>
        <v-dialog v-model="dialog" width="240">
          <v-card class="pa-4">
            <v-radio-group v-model="newValue" @change="updateData($event), dialog = false">
              <v-radio v-for="option in form.option" :key="option" :label="option" :value="option"></v-radio>
            </v-radio-group>
          </v-card>
        </v-dialog>
      </v-layout>
    </div>
    
    <v-divider />
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: [ 'form', 'value' ],
  data: () => ({
    dialog: false,
    newValue: null
  }),
  created() {
    this.newValue = this.value
    // console.log(this.form)
  },
  methods: {
    updateData(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style>

</style>