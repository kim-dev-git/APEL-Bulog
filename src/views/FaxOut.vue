<template>
  <div id="fax-out">
    <content-body
      title="Fax Keluar"
      buttonText="Tambah Fax Keluar"
      :headers="headers"
      :headersPrint="headersPrint"
      :items="faxOutCollection"
      @button-click="dialogAdd = true" >

      <template #row="{ value, header, item }">
        <div
          v-if="header.value === 'action'" >
          <v-btn
            icon
            @click="documentDetail(item)"
            >
            <v-icon v-text="'mdi-file-document-edit'" />
          </v-btn>
        </div>
        <v-chip
          v-else-if="header.value === 'status'"
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
      title="Tambah Fax Keluar"
      buttonSave="Simpan"
      @save="createFaxOut()" >

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
  name: 'FaxOut',
  components: {
    ContentBody,
    ContentDialog,
    FormGenerator,
  },
  data: () => ({
    headers: [
      { text: 'Nomor', value: 'no' },
      { text: 'Kepada', value: 'to' },
      { text: 'Dari', value: 'from' },
      { text: 'Asal Berita', value: 'origin' },
      { text: 'Perihal', value: 'subject' },
      { text: 'Jumlah Lembar', value: 'sheets', align: 'right' },
      { text: 'Status', value: 'status' },
      { text: '', value: 'action' },
    ],
    headersPrint: [
      { header: 'Nomor', dataKey: 'no' },
      { header: 'Kepada', dataKey: 'to' },
      { header: 'Dari', dataKey: 'from' },
      { header: 'Asal Berita', dataKey: 'origin' },
      { header: 'Perihal', dataKey: 'subject' },
      { header: 'Jumlah Lembar', dataKey: 'sheets', align: 'right' },
      { header: 'Status', dataKey: 'status' },
    ],
    dialogAdd: false,
    faxForms: {},
    forms: [
      { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Kepada', type: 'text', value: 'to' },
      { label: 'Dari', type: 'text', value: 'from' },
      { label: 'Asal Berita', type: 'text', value: 'origin' },
      { label: 'Perihal', type: 'text', value: 'subject' },
      { label: 'Jumlah Lembar', type: 'number', value: 'sheets' },
    ],
  }),
  computed: {
    faxOutCollection() {
      return this.$store.state.faxout.collection
    }
  },
  methods: {
    createFaxOut() {
      this.$store.dispatch('faxout/post', this.faxForms)
      this.dialogAdd = false
      this.faxForms = {}
    },
    documentDetail(item) {
      // this.$store.dispatch('faxout/get', item.id)
      this.$router.push(`/fax-keluar/${ item.id }`)
    }
  }
}
</script>
