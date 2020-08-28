<template>
  <div id="content-body">
    <v-layout
      class="align-center">
      <v-card-title
        class="ml-n4 headline text--secondary"
        v-text="title"
      />
      <v-spacer />
      <print-table
        :title="title"
        :body="items"
        :headers="headersPrint"
      />
      <v-btn
        v-if="buttonText && userProfile.position !== 'Pimwil'"
        color="primary"
        class="text-none ml-4"
        @click="$emit('button-click')" >
        <v-icon left class="ml-0" v-text="'mdi-plus'" />
        <span class="mr-2" v-text="buttonText" />
      </v-btn>
    </v-layout>

    <v-card
      class="pa-4" >

      <v-data-table
        :mobile-breakpoint="Number(0)"
        :headers="headers"
        :items="items"
        :sort-by="sortBy ? sortBy : 'id'"
        :sort-desc="desc"
      >
        <template #body="props">
          <tbody>
          <tr v-for="item in props.items" :key="item.id">
            <td v-for="header in headers" :key="header.value">
              <slot name="row"
                :item="item"
                :value="item[header.value]"
                :header="header">
                <p
                  class="py-4"
                  :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
                  v-text="item[header.value]"
                />
              </slot>
            </td>
            <slot name="expanded">
              <v-layout v-if="item.expanded">{{ item.status }}</v-layout>
            </slot>
          </tr>
          </tbody>
        </template>
        <!-- <slot name="table"  /> -->
      </v-data-table>

    </v-card>

  </div>
</template>

<script>

import ContentDialog from '@/components/ContentDialog'
import PrintTable from '@/components/PrintTable'
export default {
  components: {
    ContentDialog,
    PrintTable
  },
  props: [
    'title',
    'buttonText',
    'headers',
    'headersPrint',
    'items',
    'sortBy',
    'desc',
    'expand',
  ],
  data: () => ({
    expanded: []
  }),
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    }
  }
}
</script>

<style>

</style>