<template>
  <div id="fax-out">
    <content-body
      title="Fax Keluar"
      buttonText="Tambah Fax Keluar"
      :headers="headers"
      :headersPrint="headersPrint"
      :items="faxOutCollection"
      @button-click="dialogAdd = true"
      expand >

      <template #row="{ value, header, item }">
        <v-layout
          v-if="header.value === 'action'" >
          <!-- <v-btn
            @click="$set(item, 'expanded', !item.expanded)"
            icon>
            <v-icon v-text="'mdi-chevron-down'" />
          </v-btn> -->
          <!-- <v-menu
            transition="slide-y-transition"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
              >
                <v-icon v-text="'mdi-dots-horizontal'" />
              </v-btn>
            </template>
            <v-list
              class="pa-0">
              <v-list-item
                v-for="(menu, i) in menuActions"
                :key="i"
                @click="menuAction(menu.action, item)"
                dense
              >
                <v-layout>
                  <v-icon v-text="menu.icon" :color="menu.color" left />
                  <span v-text="menu.text" class="subtitle-2" :class="`${menu.color}--text`" />
                </v-layout>
              </v-list-item>
            </v-list>
          </v-menu> -->
          <v-divider class="mr-4" vertical />
          <v-btn
            v-for="(menu, i) in menuActions"
            :key="i"
            @click="menuAction(menu.action, item)"
            color="info"
            icon>
            <v-icon v-text="menu.icon" :color="menu.color" />
          </v-btn>
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
            class="text-no-wrap caption">
            <div
              class="text--secondary">
              <p v-text="'Dibuat'" class="mb-0" />
              <p v-text="'Diedit'" class="text--secondary mb-0" />
            </div>
            <div
              class="font-weight-bold">
              <p v-text="`: ${ $options.filters.fullDate(value.seconds) }`" class="mb-0" />
              <p v-text="`: ${ $options.filters.fullDate(item.editedAt.seconds) }`" class="mb-0" />
            </div>
          </v-layout>
        </div>
        <div id="to"
          v-else-if="header.value === 'to'">
          <v-layout
            v-if="value"
            class="caption text-no-wrap">
            <div>
              <p v-text="'Kepada'" class="mb-0" />
              <p v-text="'Dari'" class="mb-0" />
            </div>
            <div
              class="font-weight-bold">
              <p v-text="`: ${ value }`" class="mb-0" />
              <p v-text="`: ${ item.from }`" class="mb-0" />
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
      title="Tambah Fax Keluar"
      buttonSave="Simpan"
      @save="createFaxOut()" >

      <form-generator
        v-model="faxForms"
        :forms="forms"
      />

    </content-dialog>

    <dialog-remove id="dialog-fax-out-remove"
      v-model="dialogFaxOutRemove"
      title="Yakin hapus Fax ini?"
      @remove="removeFaxOut()">
      <v-sheet id="dialog-detail"
        class="pa-4 mt-n4 mb-2"
        color="grey lighten-3"
        rounded>
        <v-layout
          v-if="selectedFax"
          column>
          <span v-text="'No Fax'" class="text--secondary subtitle-2" />
          <span v-if="selectedFax.no" v-text="selectedFax.no" class="font-weight-bold" />
          <span v-else v-text="'-'" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Perihal'" class="text--secondary subtitle-2" />
          <span v-text="selectedFax.subject" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Kepada'" class="text--secondary subtitle-2" />
          <span v-text="selectedFax.to" class="font-weight-bold" />
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
  name: 'FaxOut',
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
    dialogFaxOutRemove: false,
    selectedFax: null,
    faxForms: {},
    forms: [
      { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Kepada', type: 'text', value: 'to' },
      { label: 'Dari', type: 'text', value: 'from' },
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
    faxOutCollection() {
      return this.$store.state.faxout.collection
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
          this.selectedFax = item
          this.dialogFaxOutRemove = true
          break
        default:
          break
      }
    },
    createFaxOut() {
      this.$store.dispatch('faxout/post', this.faxForms)
      this.dialogAdd = false
      this.faxForms = {}
    },
    removeFaxOut() {
      this.$store.dispatch('faxout/remove', this.selectedFax)
      this.dialogFaxOutRemove = false
    },
    documentDetail(item) {
      // this.$store.dispatch('faxout/get', item.id)
      this.$router.push(`/fax-keluar/${ item.id }`)
    },
  },
  watch: {
    dialogFaxOutRemove(val) {
      if(!val) {
        this.selectedFax = null
      }
    }
  }
}
</script>
