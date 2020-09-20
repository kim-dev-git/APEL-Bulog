<template>
  <div id="print-table">
    <v-btn
      color="primary"
      class="text-none"
      @click="print()" >
      <v-icon left class="ml-0" v-text="'mdi-printer'" />
      <span class="mr-2" v-text="'Print'" />
    </v-btn>
  </div>
</template>

<script>

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import headerBulog from '@/assets/header-bulog.js'
export default {
  props: [
    'title',
    'body',
    'headers'
  ],
  data: () => ({
  }),
  methods: {
    print() {
      var vm = this
      const item = JSON.parse(JSON.stringify(this.body))
      if(item.length === 0) {
        this.$store.dispatch('notifications/post', {
          title: 'Data tidak ada.',
          body: `Print gagal karena data tidak ada.`,
        })
        return
      }
      var doc = new jsPDF()
      const imgData = headerBulog
      
      doc.addImage(imgData, "JPEG", 5, 5, 200, 20)

      doc.setFontSize("14")

      var posX = 14
      var posY = 40
      var middle = 105

      doc.text('Laporan ' + this.title, middle, posY, null, null, "center" )

      posY = posY + 5
      
      const body = []

      this.headers.forEach(header => {
        const array = []
        array.push(header.header)
        if(header.dataKey === 'createdAt') {
          array.push(vm.$options.filters.fullDate(item[0][header.dataKey]))
        } else {
          array.push(item[0][header.dataKey])
        }
        array.push(item[header.dataKey])
        body.push(array)
      })


      var container = {
        drawHeaderRow: function() {
          // Don't draw header row
          return false;
        },
        columnStyles: {
          to: {fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold'}
        }
      }

      const items = []

      this.body.forEach(data => {
        const arr = []
        this.headers.forEach(header => {
          if(header.dataKey === 'createdAt') {
            arr.push(vm.$options.filters.fullDate(data[header.dataKey]))
          } else {
            arr.push(data[header.dataKey])
          }
        })
        items.push(arr)
      })

      doc.autoTable({
        startY: posY,
        columns: this.headers,
        body: items
      })

      var finalY = doc.previousAutoTable.finalY
      var docWidth = doc.internal.pageSize.getWidth()
      var leader = 'Arif Mandu'
      var textWidth = doc.getTextWidth(leader)

      
      doc.text(leader, docWidth - 50, finalY + 50, null, null, "center" )
      doc.line(docWidth - 62, finalY + 1 + 50, docWidth - 62 + textWidth, finalY + 1 + 50, null, null, "center")
      doc.text('Pemimpin', docWidth - 50, finalY + 56, null, null, "center" )

      doc.save(`Laporan ${ this.title }.pdf`)
      doc.autoPrint()
    }
  }
}
</script>

<style>

</style>