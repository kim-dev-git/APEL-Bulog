<template>
  <div id="document-print">
    <v-btn
      class="text-none"
      @click="print()"
      icon
    >
      <v-icon v-text="'mdi-printer'" />
    </v-btn>
  </div>
</template>

<script>

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import logo from '@/assets/logo.js'
export default {
  props: [
    'data'
  ],
  data: () => ({
    //
  }),
  methods: {
    print() {
      // const item = JSON.parse(JSON.stringify(this.body))
      var doc = new jsPDF('l', 'mm', 'a4')

      const data = this.data

      const { subject, from, no } = data.document

      const notes = data.notes

      const receivedAt = this.$options.filters.fullDate(data.document.createdAt)

      const createdAt = data.createdAt

      const splitSubject = doc.splitTextToSize(subject, 180)

      const splitNotes = doc.splitTextToSize(notes, width - 20)
      
      var width = doc.internal.pageSize.getWidth()
      var height = doc.internal.pageSize.getHeight()
      
      const imgData = logo
      
      doc.addImage(imgData, "JPEG", 11, 6, 16, 16)


      var posX = 14
      var posY = 40
      var middle = (width / 2)

      doc.rect(5, 5, width - 10, height - 10, 'S')

      doc.setFontSize("20")

      doc.text(30, 13, 'BULOG')

      doc.setFontSize("14")

      doc.text(30, 20, 'DIVISI REGIONAL KALSEL')

      doc.setFontSize("10")

      doc.text(10, 26, 'Jalan A. Yani Km. 6 No. 561 Banjarmasin')

      // doc.setLineWidth(5.0)

      doc.line(5, 29, width - 5, 29)

      posY = 35
      
      doc.setFontSize("12")

      doc.text('Lembar Kontrol', 50, posY, null, null, 'center')

      doc.text('AGENDA', 102, posY, null, null, 'left')

      doc.text(':', 136, posY, null, null, 'left')

      splitSubject.forEach((v, index) => {
        doc.text(v, 142, posY + (5 * index), null, null, 'left')
      })

      posY += 10

      doc.text('(Untuk Surat Asli)', 50, posY, null, null, 'center')

      doc.text('TGL. TERIMA', 102, posY, null, null, 'left')

      doc.text(':', 136, posY, null, null, 'left')

      doc.text(receivedAt, 142, posY, null, null, 'left')

      doc.line(5, 50, width - 5, 50)

      posY += 11

      doc.text('I. KABID OPP', 33, posY, null, null, 'center')  

      doc.text('II. KABID ADA', 79, posY, null, null, 'center')  

      doc.text('III. KABID KOMERSIAL', 123, posY, null, null, 'center')

      doc.text('IV. KABID MINKU', 173, posY, null, null, 'center')

      doc.text('V. KABID PBI', 216, posY, null, null, 'center')

      doc.text('VI. KASPI REG IX', 260, posY, null, null, 'center')
      
      posY += 6

      doc.setFontSize('10')

      doc.text(7, posY, '1.')

      doc.text(12, posY, 'Seksi Pergudangan,')

      doc.text(63, posY, '1.')

      doc.text(68, posY, 'Seksi Pengadaan')

      doc.text(100, posY, '1.')

      doc.text(105, posY, 'Seksi Pemasaran')

      doc.text(150, posY, '1.')

      doc.text(155, posY, 'Seksi SDM & Hukum')

      doc.text(200, posY, '1.')

      doc.text(205, posY, 'Seksi Pengolahan')

      doc.text(250, posY, '1.')

      doc.text(255, posY, 'Auditor')

      posY += 4

      doc.text(12, posY, 'Persediaan, Angkutan')

      doc.text(68, posY, 'Pangan')

      doc.text(100, posY, '2.')

      doc.text(105, posY, 'Seksi Penjualan Ritel')

      doc.text(150, posY, '2.')

      doc.text(155, posY, 'Seksi Sek, Umum, Humas')

      doc.text(200, posY, '2.')

      doc.text(205, posY, 'Seksi Teknologi')

      doc.text(250, posY, '2.')

      doc.text(255, posY, 'Auditor')

      posY += 4

      doc.text(7, posY, '2.')

      doc.text(12, posY, 'Seksi Pengolahan, Perawatan')

      doc.text(63, posY, '2.')

      doc.text(68, posY, 'Seksi Pengadaan')

      doc.text(100, posY, '3.')

      doc.text(105, posY, 'Seksi Penjualan')

      doc.text(150, posY, '3.')

      doc.text(155, posY, 'Seksi Keuangan')

      doc.text(205, posY, 'Informasi')

      doc.text(250, posY, '3.')

      doc.text(255, posY, 'Auditor')

      posY += 4

      doc.text(12, posY, 'Pengadaan Mutu')

      doc.text(68, posY, 'Barang dan Jasa')

      doc.text(105, posY, 'Grosir dan PP')

      doc.text(150, posY, '4.')

      doc.text(155, posY, 'Seksi Akuntansi,')

      posY += 4

      doc.text(7, posY, '3.')

      doc.text(12, posY, 'Seksi Perencanaan')

      doc.text(100, posY, '4.')

      doc.text(105, posY, 'Opaset')

      doc.text(155, posY, 'Manajemen Resiko')

      posY += 4

      doc.text(12, posY, 'Operasional dan Data Pangan')

      doc.text(155, posY, 'dan Kepatuhan')

      posY += 4

      doc.line(61, posY - 36, 61, posY)
      
      doc.line(98, posY - 57, 98, posY + 32)

      doc.line(148, posY - 36, 148, posY)

      doc.line(198, posY - 36, 198, posY + 32)

      doc.line(236, posY - 36, 236, posY)
      
      doc.line(5, posY, width - 5, posY)

      ////////////////////////////////////////////////////////

      posY += 7

      var rectSize = 5

      doc.setFontSize('12')

      doc.text('Segera selesaikan', 7, posY)

      doc.rect(86, posY - 4, rectSize, rectSize)

      doc.text('Catat yang perlu', 102, posY)

      doc.rect(186, posY - 4, rectSize, rectSize)

      doc.text('Teliti & Perhatikan', width - 70, posY)

      doc.rect(width - 33, posY - 4, rectSize + 20, rectSize)

      posY += 10

      doc.text('Segera jawab', 7, posY)

      doc.rect(86, posY - 4, rectSize, rectSize)

      doc.text('Untuk mewakili', 102, posY)

      doc.rect(186, posY - 4, rectSize, rectSize)

      doc.text('Untuk diperbanyak', width - 70, posY)

      doc.rect(width - 33, posY - 4, rectSize + 20, rectSize)

      posY += 10

      doc.text('Tindakan yang perlu', 7, posY)

      doc.rect(86, posY - 4, rectSize, rectSize)

      doc.text('Saran / Laporan KaDivre Kalsel', 102, posY)

      doc.rect(186, posY - 4, rectSize, rectSize)

      doc.text('Untuk arsip', width - 70, posY)

      doc.rect(width - 33, posY - 4, rectSize + 20, rectSize)

      posY += 5
      
      doc.line(5, posY, width - 5, posY)

      posY += 5

      doc.text('Catatan :', 7, posY)

      posY += 5

      doc.setFontSize('10')

      splitNotes.forEach((v, index) => {
        doc.text(v, 7, posY + (5 * index), null, null, 'left')
      })
      
      doc.setFontSize('12')

      posY += 45
      
      doc.line(5, posY, width - 5, posY)

      posY += 5

      doc.text('1. Dilarang memisahkan sehelai surat dari berkas yang telah disusun ini.', 7, posY)

      posY += 5

      doc.text('2. Jika mengenai soal RAHASIA mohon dijaga KERAHASIAAN PERUSAHAAN.', 7, posY)

      posY += 5

      doc.text('3. Harus dikembalikan dalam keadaan utuh, lengkap dan rapi.', 7, posY)
      
      posY += 2
      
      doc.line(5, posY, width - 5, posY)
      
      posY += 6
      
      doc.text('ASAL SURAT', 10, posY)
      
      doc.text(':', 55, posY)
      
      doc.text(from, 60, posY)
      
      posY += 6
      
      doc.text('NOMOR SURAT', 10, posY)
      
      doc.text(':', 55, posY)
      
      doc.text(no, 60, posY)
      
      doc.text('TANGGAL', 155, posY)
      
      doc.text(':', 185, posY)
      
      

      // doc.save(`${ item.from }-${ item.subject }${ item.no ? ('-' + item.no) : '' }.pdf`)
      doc.save(`Disposisi-${subject}-${this.data.to}.pdf`)
      doc.autoPrint()
    }
  }
}
</script>

<style>

</style>