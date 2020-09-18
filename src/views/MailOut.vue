<template>
  <div id="mail-out">
    <content-body
      title="Mail Keluar"
      buttonText="Tambah Mail Keluar"
      :headers="headers"
      :headersPrint="headersPrint"
      :items="mailOut"
      :sortBy="'createdAt.seconds'"
      desc
      @button-click="dialogAdd = true"
      expand >

      <template #row="{ value, header, item }">
        <v-layout id="action"
          v-if="header.value === 'action'" >
          <v-divider class="mr-4" vertical />
          <div
            v-for="(menu, i) in menuActions"
            :key="i">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  @click="menuAction(menu.action, item)"
                  color="info"
                  icon>
                  <v-icon v-text="menu.icon" :color="menu.color" />
                </v-btn>
              </template>
              <span v-text="menu.text" />
            </v-tooltip>
          </div>
        </v-layout>
        <div id="status"
          v-else-if="header.value === 'status'"
          class="text-no-wrap">
          <v-icon v-text="statusIcon(value)" :color="statusColor(value)" small left />
          <span v-text="value" class="caption font-weight-bold" :class="`${statusColor(value)}--text`"  />
        </div>
        <div id="createdAt"
          v-else-if="header.value === 'createdAt'">
          <v-layout
            v-if="value"
            class="text-no-wrap caption py-2">
            <div
              class="text--secondary">
              <p v-text="'Dibuat'" class="mb-0" />
              <p v-if="item.editedAt" v-text="'Diedit'" class="text--secondary mb-0" />
            </div>
            <div
              class="font-weight-bold">
              <p v-text="`: ${ $options.filters.dayDate(value) }`" class="mb-0" />
              <p v-if="item.editedAt" v-text="`: ${ $options.filters.dayDate(item.editedAt) }`" class="mb-0" />
            </div>
          </v-layout>
        </div>
        <div id="subject"
          v-else-if="header.value === 'subject'">
          <v-layout
            class="caption py-2"
            column>
            <div
              class="text-no-wrap">
              <span v-text="'No: '" class="text--secondary" />
              <span v-text="item.no ? item.no : '-'" class="mb-0" />
            </div>
            <div
              class="font-weight-bold">
              <p v-text="value ? value : '-'" class="mb-0" />
            </div>
          </v-layout>
        </div>
        <div id="to"
          v-else-if="header.value === 'to'">
          <v-layout
            class="caption text-no-wrap py-">
            <div>
              <p v-text="'Kepada'" class="mb-0" />
              <p v-text="'Dari'" class="mb-0" />
            </div>
            <div
              class="font-weight-bold">
              <p v-text="value ? `: ${ value }` : '-'" class="mb-0" />
              <p v-text="item.from ? `: ${ item.from }` : '-'" class="mb-0" />
            </div>
          </v-layout>
        </div>
        <p
          v-else
          v-text="value"
          class="py-4"
          :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
        />
      </template>
    </content-body>
    
    <content-dialog
      v-model="dialogAdd"
      title="Tambah Mail Keluar"
      buttonSave="Simpan"
      @save="createMailOut()" >

      <form-generator
        v-model="addForms"
        :forms="forms"
      />

    </content-dialog>

    <dialog-remove id="dialog-mail-out-remove"
      v-model="dialogMailOutRemove"
      title="Yakin hapus Mail ini?"
      @remove="removeMailOut()">
      <v-sheet id="dialog-detail"
        class="pa-4 mt-n4 mb-2"
        color="grey lighten-3"
        rounded>
        <v-layout
          v-if="selectedMail"
          column>
          <span v-text="'No Surat'" class="text--secondary subtitle-2" />
          <span v-if="selectedMail.no" v-text="selectedMail.no" class="font-weight-bold" />
          <span v-else v-text="'-'" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Perihal'" class="text--secondary subtitle-2" />
          <span v-text="selectedMail.subject" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Kepada'" class="text--secondary subtitle-2" />
          <span v-text="selectedMail.to" class="font-weight-bold" />
        </v-layout>
      </v-sheet>
    </dialog-remove>
  </div>
</template>

<script>

import ContentBody from '@/components/ContentBody'
import ContentDialog from '@/components/ContentDialog'
import FormGenerator from '@/components/FormGenerator'
import DialogRemove from '@/components/DialogRemove'

export default {
  name: 'MailOut',
  components: {
    ContentBody,
    ContentDialog,
    FormGenerator,
    DialogRemove,
  },
  data: () => ({
    headers: [
      // { text: 'Nomor', value: 'no' },
      { text: 'Perihal', value: 'subject' },
      { text: 'Tujuan', value: 'to' },
      // { text: 'Dari', value: 'from' },
      // { text: 'Asal Berita', value: 'origin' },
      // { text: 'Jumlah Lembar', value: 'sheets', align: 'right' },
      { text: 'Tanggal', value: 'createdAt' },
      { text: 'Status', value: 'status' },
      { text: '', value: 'action', sortable: false },
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
    dialogMailOutRemove: false,
    selectedMail: null,
    addForms: {},
    forms: [
      { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Kepada', type: 'text', value: 'to' },
      // { label: 'Dari', type: 'text', value: 'from' },
      { label: 'Asal Berita', type: 'text', value: 'origin' },
      { label: 'Perihal', type: 'text', value: 'subject' },
      { label: 'Jumlah Lembar', type: 'number', value: 'sheets' },
    ],
    menuActions: [
      { text: 'Edit', icon: 'mdi-file-document-edit-outline', color: 'primary', action: 'edit' },
      { text: 'Hapus', icon: 'mdi-delete-outline', color: 'error', action: 'delete' },
    ],
  }),
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    },
    mailOutCollection() {
      return this.$store.state.mailout.collection
    },
    mailOut() {
      return this.$store.getters['mailout/collection']
    }
  },
  methods: {
    statusIcon(status) {
      switch(status) {
        case 'Menunggu persetujuan':
          return 'mdi-circle'
          break
        case 'Perlu diperbaiki':
          return 'mdi-comment-alert'
          break
        case 'Telah direvisi':
          return 'mdi-comment-check'
          break
        case 'Sudah diprint':
          return 'mdi-printer'
          break
        case 'Disetujui':
          return 'mdi-check-decagram'
          break
        default:
          return
          break
      }
    },
    statusColor(status) {
      switch(status) {
        case 'Menunggu persetujuan':
          return 'info'
          break
        case 'Perlu diperbaiki':
          return 'warning'
          break
        case 'Telah direvisi':
          return 'success'
          break
        case 'Sudah diprint':
          return 'grey'
          break
        case 'Disetujui':
          return 'primary'
          break
        default:
          return
          break
      }
    },
    menuAction(action, item) {
      switch(action) {
        case 'edit':
          this.documentDetail(item)
          break
        case 'delete':
          this.selectedMail = item
          this.dialogMailOutRemove = true
          break
        default:
          break
      }
    },
    createMailOut() {
      this.addForms.from = this.userProfile.position
      this.$store.dispatch('mailout/post', this.addForms)
      console.log('Console:', this.addForms)
      this.dialogAdd = false
      this.addForms = {}
    },
    removeMailOut() {
      this.$store.dispatch('mailout/remove', this.selectedMail)
      this.dialogMailOutRemove = false
    },
    documentDetail(item) {
      // this.$store.dispatch('mailout/get', item.id)
      this.$router.push(`/surat-keluar/${ item.id }`)
    },
  },
  watch: {
    dialogMailOutRemove(val) {
      if(!val) {
        this.selectedMail = null
      }
    }
  }
}
</script>
