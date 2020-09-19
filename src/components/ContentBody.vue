<template>
  <div id="content-body">
    <v-layout
      class="align-center mx-0"
      row>
      <v-flex xs12 md4>
        <v-layout class="align-center">
          <v-card-title
            class="ml-n4 headline text--secondary"
            v-text="title"
          />
          <v-text-field
            v-if="!$vuetify.breakpoint.mdAndUp && perMonth"
            type="month"
            v-model="month"
            class="mb-n7"
            outlined
            dense
            solo
          />
        </v-layout>
      </v-flex>
      <v-flex xs12 md8 class="mb-3 mb-md-0">
        <v-layout class="d-flex flex-row-reverse align-center">
          <v-btn
            v-if="buttonText && userProfile.position !== 'Pimwil'"
            color="primary"
            class="text-none"
            @click="$emit('button-click')" >
            <v-icon left class="ml-0" v-text="'mdi-plus'" />
            <span class="mr-2" v-text="!$vuetify.breakpoint.smAndUp ? 'Tambah' : buttonText" />
          </v-btn>
          <print-table
            :title="title"
            :body="items"
            :headers="headersPrint"
            class="mx-4"
          />
          <v-text-field
            v-if="$vuetify.breakpoint.mdAndUp && perMonth"
            type="month"
            v-model="month"
            class="mb-n7"
            outlined
            dense
            solo
          />
          <v-spacer v-if="!$vuetify.breakpoint.smAndUp" />
          <v-switch v-model="perMonth" label="Perbulan" inset dense />
        </v-layout>
      </v-flex>
      
      <v-flex xs12 class="mb-3 mb-xl-0">
        <v-layout>
          <v-text-field
            placeholder="Cari berdasarkan No / Perihal..."
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="mb-n6 mr-0 mr-xl-4"
            dense
            solo
          />
        </v-layout>
      </v-flex>
    </v-layout>

    <v-card
      class="pa-4" >

      <v-data-table
        :mobile-breakpoint="Number(0)"
        :headers="headers"
        :items="filteredItems()"
        :sort-by="sortBy ? sortBy : 'id'"
        :sort-desc="desc"
      >
        <template #body="props">
          <tbody>
          <tr v-for="(item, idx) in props.items" :key="idx">
            <!-- <td>
              {{ idx + 1 }}
            </td> -->
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

import { Timestamp } from '../firebase'
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
    expanded: [],
    search: null,
    month: null,
    perMonth: false
  }),
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    },
    selectedMonth() {
      return this.$store.state.selectedMonth
    },
    filterByMonth() {
      if(!this.perMonth) {
        return this.items
      }
      if(!this.selectedMonth || !this.items) {
        return []
      }
      var selectedMonth = this.selectedMonth
      var year = Number(selectedMonth.substr(0, 4))
      var month = Number(selectedMonth.slice(-2)) - 1
      var start = new Date(year, month, 1)
      var end = new Date(year, month + 1, 0)
      // console.log('Year', year)
      // console.log('Month', month)
      // console.log('Start', Timestamp.fromDate(start))
      // console.log('End', Timestamp.fromDate(end))
      
      return this.items.filter(v =>
        v.createdAt &&
        v.createdAt &&
        v.createdAt > Timestamp.fromDate(start) &&
        v.createdAt < Timestamp.fromDate(end)
      )
    }
  },
  methods: {    
    filteredItems() {
      var arr = this.filterByMonth
      var search = this.search
      var headers = [...this.headers]
      headers.push(
        { value: 'no' },
        { value: 'to' },
        { value: 'from' },
      )

      const newArr = []

      function match(key, search) {
        arr.map(obj => {
          if (obj[key] && obj[key].toLowerCase().indexOf(search) !== -1) {
            var check = newArr.filter(v => v.id === obj.id).length > 0
            
            if(!check) {
              newArr.push(obj)
            }
          }
        })
      }

      if(!search) {
        return arr
      } else {
        var filterVal = this.search.toLowerCase()
        
        headers.forEach(h => {
          if(h.value !== 'createdAt') {
            match(h.value, filterVal)
          }
        })
      }

      return newArr
    },

    getDate() {
      var date = new Date()
      var month = date.getUTCMonth() + 1
      var year = date.getFullYear()
      if(month.length > 1) {
        this.month = year + '-' + month
      } else {
        this.month = year + '-' + '0' + month
      }
    }
  },
  mounted() {
    this.getDate()
  },
  watch: {
    month: {
      immediate: true,
      handler() {
        this.$store.commit('setSelectedMonth', this.month)
      }
    }
  }
}
</script>

<style>

</style>