import Vue from 'vue'
import moment from 'moment'

Vue.filter("dayDate", value => {
  moment.locale('id')
  if(value && value.seconds) {
    return moment.unix(value.seconds).format('dddd, D MMM')
  } else {
    return moment(value).format('dddd, D MMM')
  }
})