<template>
  <div id="fax-in">
    <content-body
      title="Fax Masuk"
      buttonText="Tambah Fax Masuk"
      :headers="headers"
      :headersPrint="headersPrint"
      :items="faxIns"
      @button-click="dialogAdd = true" >

      <template #row="{ value, header }">
        <v-chip
          v-if="header.value === 'status'"
          v-text="value"
        />
        <p
          v-else
          v-text="value"
          :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
        />
      </template>
    </content-body>
    
    <content-dialog
      v-model="dialogAdd"
      title="Tambah Fax Masuk"
      buttonSave="Simpan"
      @save="createFaxIn" >

      <form-generator
        v-model="faxForms"
        :forms="forms"
      />

    </content-dialog>
  </div>
</template>

<script>

import ContentBody from '@/components/ContentBody'
import ContentDialog from '@/components/ContentDialog'
import FormGenerator from '@/components/FormGenerator'

export default {
  name: 'FaxIn',
  components: {
    ContentBody,
    ContentDialog,
    FormGenerator,
  },
  data: () => ({
    headers: [
      { text: 'Nomor', value: 'no' },
      { text: 'Untuk', value: 'to' },
      { text: 'Dari', value: 'from' },
      { text: 'Asal Berita', value: 'origin' },
      { text: 'Tembusan', value: 'copy' },
      { text: 'Hal', value: 'subject' },
      { text: 'Jumlah Lembar', value: 'sheets', align: 'right' },
      { text: 'Status', value: 'status' },
      { text: '', value: 'action' },
    ],
    headersPrint: [
      { header: 'Nomor', dataKey: 'no' },
      { header: 'Untuk', dataKey: 'to' },
      { header: 'Dari', dataKey: 'from' },
      { header: 'Asal Berita', dataKey: 'origin' },
      { header: 'Tembusan', dataKey: 'copy' },
      { header: 'Hal', dataKey: 'subject' },
      { header: 'Jumlah Lembar', dataKey: 'sheets', align: 'right' },
      { header: 'Status', dataKey: 'status' },
    ],
    dialogAdd: false,
    faxForms: {},
    forms: [
      { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Untuk', type: 'text', value: 'to' },
      { label: 'Dari', type: 'text', value: 'from' },
      { label: 'Asal Berita', type: 'text', value: 'origin' },
      { label: 'Tembusan', type: 'text', value: 'copy' },
      { label: 'Hal', type: 'text', value: 'subject' },
      { label: 'Jumlah Lembar', type: 'number', value: 'sheets' },
      { label: 'Tanggal Masuk', type: 'date', value: 'arrivedAt' },
    ],
  }),
  computed: {
    faxIns() {
      return this.$store.state.faxin.collection
    }
  },
  methods: {
    createFaxIn() {
      this.$store.dispatch('faxin/post', this.faxForms)
      this.dialogAdd = false
      this.faxForms = {}
    }
  }
}
</script>
