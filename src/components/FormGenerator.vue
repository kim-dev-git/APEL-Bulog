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
      var inputForm = vm.input.forms
      var inputOption = vm.input.option
      var inputRule = vm.input.rules

      forms.forEach(form => {
        inputForm.push(form)
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