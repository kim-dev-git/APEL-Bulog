<template>
  <div id="document-print">
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
    'headers',
    'body',
  ],
  data: () => ({
    //
  }),
  methods: {
    print() {
      const item = JSON.parse(JSON.stringify(this.body))
      var doc = new jsPDF()
      const imgData = headerBulog
      
      doc.addImage(imgData, "JPEG", 5, 5, 200, 20)

      doc.setFontSize("14")

      var posX = 14
      var posY = 40
      var middle = 105

      posY = posY + 5
      
      const data = this.body
      const width = doc.internal.pageSize.getWidth()

      doc.setFontSize("12")

      doc.text('Banjarmasin, ' + this.$options.filters.fullDate(data.createdAt), width - 20, posY, null, null, 'right')
      
      doc.text('Nomor', posX, posY, null, null)
      doc.text(': ' + (data.no ? data.no : ''), posX + 30, posY, null, null)
      posY += 6
      doc.text('Sifat', posX, posY, null, null)
      doc.text(': ' + 'Penting', posX + 30, posY, null, null)
      posY += 6
      doc.text('Lampiran', posX, posY, null, null)
      doc.text(': ' + data.sheets, posX + 30, posY, null, null)
      posY += 6
      doc.text('Perihal', posX, posY, null, null)
      doc.text(': ' + data.subject, posX + 30, posY, null, null)
      posY += 18

      doc.setFontSize("12")

      doc.text('Kepada Yth. :', posX, posY, null, null)
      posY += 6
      doc.text(data.to, posX, posY, null, null)
      posY += 12

      var splitText = doc.splitTextToSize(item.content.body, 180)
      
      // doc.setFontType("normal")

      for (var i = 0; i < splitText.length; i++) {
        doc.text(posX, posY, splitText[i])
        posY = posY + 6
      }

      const list = item.content.list
      for (var i = 0; i < list.length; i++) {
        doc.text(posX + 6, posY, `${ i + 1 }.`)
        splitText = doc.splitTextToSize(list[i], 175)
        for (var j = 0; j < splitText.length; j++) {
          doc.text(posX + 12, posY, splitText[j])
          posY = posY + 6
        }
      }

      splitText = doc.splitTextToSize(item.content.footer, 180)

      posY = posY + 3

      for (var i = 0; i < splitText.length; i++) {
        doc.text(posX, posY, splitText[i])
        posY = posY + 6
      }

      doc.setFontSize("14")

      var leader = 'Arif Mandu'
      var textWidth = doc.getTextWidth(leader)

      
      doc.text(leader, width - 50, posY + 50, null, null, "center" )
      doc.line(width - 62, posY + 1 + 50, width - 62 + textWidth, posY + 1 + 50, null, null, "center")
      doc.text('Pemimpin', width - 50, posY + 56, null, null, "center" )

      doc.save(`${ item.from }-${ item.subject }${  item.no ? ('-' + item.no) : '' }.pdf`)
      doc.autoPrint()
    }
  }
}
</script>

<style>

</style>