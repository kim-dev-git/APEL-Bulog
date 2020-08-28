import Vue from 'vue'
import moment from 'moment'
('DD MMMM YYYY')

Vue.filter("fullDate", value => {
  moment.locale('id')
  if(value && value.seconds) {
    return moment.unix(value.seconds).format('DD MMMM YYYY')
  } else {
    return moment(value).format('DD MMMM YYYY')
  }
})