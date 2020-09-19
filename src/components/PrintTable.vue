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

      // doc.autoTable({
      //   // drawHeaderRow: false,
      //   theme: 'grid',
      //   startY: posY,
      //   body: body,
      // })

      // posY = doc.autoTable.previous.finalY + 8

      // doc.setFontSize("12")

      // doc.text('Isi berita:', posX, posY, null, null)

      // posY = posY + 6

      // var splitText = doc.splitTextToSize(item.content.body, 180)
      
      // // doc.setFontType("normal")

      // for (var i = 0; i < splitText.length; i++) {
      //   doc.text(posX, posY, splitText[i])
      //   posY = posY + 6
      // }

      // const list = item.content.list
      // for (var i = 0; i < list.length; i++) {
      //   doc.text(posX, posY, `${ i + 1 }.`)
      //   splitText = doc.splitTextToSize(list[i], 175)
      //   for (var j = 0; j < splitText.length; j++) {
      //     doc.text(posX + 6, posY, splitText[j])
      //     posY = posY + 6
      //   }
      // }

      // splitText = doc.splitTextToSize(item.content.footer, 180)

      // posY = posY + 3

      // for (var i = 0; i < splitText.length; i++) {
      //   doc.text(posX, posY, splitText[i])
      //   posY = posY + 6
      // }

      // doc.save(`${ item.from }-${ item.subject }-${ item.no }.pdf`)
      doc.save(`Laporan ${ this.title }.pdf`)
      doc.autoPrint()
    }
  }
}
</script>

<style>

</style>