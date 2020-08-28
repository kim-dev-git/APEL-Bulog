import Vue from 'vue'
import moment from 'moment'

Vue.filter("dayDate", value => {
  moment.locale('id')
  return moment.unix(value).format('dddd, D MMM')
})