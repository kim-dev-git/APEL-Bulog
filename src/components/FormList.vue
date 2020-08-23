<template>
  <div id="form-list">
    <div
      v-for="form in input.forms"
      :key="form.value" >
      <FormItem
        :form="form"
        v-model="input.data[form.value]"
        @input="$emit('input')"
      />
    </div>
  </div>
</template>

<script>
import FormItem from '@/components/FormItem'
export default {
  name: 'FormList',
  components: { FormItem },
  props: [ 'input' ],
}
</script>

<style>

</style>