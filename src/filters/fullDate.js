import Vue from 'vue'
import moment from 'moment'

Vue.filter("fullDate", value => {
  moment.locale('id')
  return moment.unix(value).format('DD MMMM YYYY')
})