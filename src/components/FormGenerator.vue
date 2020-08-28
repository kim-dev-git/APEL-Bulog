<template>
  <FormList :input="input" @input="$emit('input', input.data)" />
</template>

<script>

import FormList from '@/components/FormList'
export default {
  components: {
    FormList
  },
  props: [
    'forms',
    'rules',
    'options',
    'value',
  ],
  data: () => ({
    valid: null,
    
    input: {
      data: {},
      forms: [],
    }
  }),
  methods: {
    generateForm() {
      const vm = this
      const forms = vm.forms
      const rules = vm.rules
      var data = vm.input.data
      const model = vm.value
      var inputForm = vm.input.forms
      var inputOption = vm.input.option
      var inputRule = vm.input.rules

        
      // data = JSON.parse(JSON.stringify(model))

      forms.forEach(form => {
        inputForm.push(form)
        vm.$set(data, 'id', model.id)
        vm.$set(data, 'fileExt', model.fileExt)
        if(model[form.value]) {
          vm.$set(data, form.value, model[form.value])
        }
        // console.log(data)
        if (form.type === 'combobox') {
          form.option = this.options[form.value]
        }
        if (form.rules) {
          form.rules = this.rules[form.value]
        }
      })
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
  created() {
    this.generateForm()
  },
}
</script>

<style>

</style>