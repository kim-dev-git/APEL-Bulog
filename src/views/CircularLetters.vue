<template>
  <div id="internal-notes">
    <content-body
      title="Surat Edaran"
      buttonText="Tambah Surat Edaran"
      :headers="headers"
      :headersPrint="headersPrint"
      :items="circularLetters"
      :sortBy="'createdAt.seconds'"
      desc
      @button-click="dialogAdd = true" >

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

        <div id="from"
          v-else-if="header.value === 'from'">
          <v-layout
            class="caption text-no-wrap py-">
            <div>
              <p v-text="'Dari'" class="mb-0" />
              <p v-text="'Kepada'" class="mb-0" />
            </div>
            <div
              class="font-weight-bold">
              <p v-text="value ? `: ${ value }` : '-'" class="mb-0" />
              <p v-text="item.to ? `: ${ item.to }` : '-'" class="mb-0" />
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

        <p id="default"
          v-else
          v-text="value"
          :class="header.align ? `text-${ header.align } mb-0` : 'mb-0'"
        />
      </template>
    </content-body>
    
    <content-dialog
      v-model="dialogAdd"
      title="Tambah Surat Edaran Masuk"
      buttonSave="Simpan"
      @save="createCircularLetters()" >

      <form-generator
        v-model="addForms"
        :forms="forms"
      />
    </content-dialog>

    <content-dialog
      v-model="dialogEdit"
      title="Edit Surat Edaran Masuk"
      buttonSave="Update"
      @save="editCircularLetters()" >

      <form-generator
        v-model="editForms"
        :forms="forms"
      />
    </content-dialog>

    <dialog-confirm id="dialog-remove"
      v-model="dialogRemove"
      title="Yakin hapus Surat Edaran ini?"
      buttonText="Hapus"
      :remove="true"
      @action="removeCircularLetters()">
      <v-sheet id="dialog-detail"
        class="pa-4 mt-n4 mb-2"
        color="grey lighten-3"
        rounded>
        <v-layout
          v-if="editForms"
          column>
          <span v-text="'No Surat Edaran'" class="text--secondary subtitle-2" />
          <span v-if="editForms.no" v-text="editForms.no" class="font-weight-bold" />
          <span v-else v-text="'-'" class="font-weight-bold" />
          <!-- <v-divider class="my-2" />
          <span v-text="'Dari'" class="text--secondary subtitle-2" />
          <span v-text="editForms.from" class="font-weight-bold" /> -->
          <v-divider class="my-2" />
          <span v-text="'Perihal'" class="text--secondary subtitle-2" />
          <span v-text="editForms.subject" class="font-weight-bold" />
        </v-layout>
      </v-sheet>
    </dialog-confirm>
  </div>
</template>

<script>

import ContentBody from '@/components/ContentBody'
import ContentDialog from '@/components/ContentDialog'
import FormGenerator from '@/components/FormGenerator'
import DialogConfirm from '@/components/DialogConfirm'

export default {
  name: 'CircularLetters',
  components: {
    ContentBody,
    ContentDialog,
    FormGenerator,
    DialogConfirm,
  },
  data: () => ({
    headers: [
      { text: 'Perihal', value: 'subject' },
      // { text: 'Nomor', value: 'no' },
      // { text: 'Untuk', value: 'to' },
      { text: 'Tujuan', value: 'from' },
      { text: 'Tanggal', value: 'createdAt' },
      { text: '', value: 'action', sortable: false },
    ],
    headersPrint: [
      { header: 'Nomor', dataKey: 'no' },
      { header: 'Perihal', dataKey: 'subject' },
      // { header: 'Untuk', dataKey: 'to' },
      // { header: 'Tujuan', dataKey: 'from' },
      { header: 'Tanggal', dataKey: 'createdAt' },
    ],
    dialogAdd: false,
    dialogEdit: false,
    dialogRemove: false,
    addForms: {},
    editForms: {},
    forms: [
      { label: 'File Surat Edaran', type: 'file', value: 'file' },
      { label: 'Nomor', type: 'text', value: 'no' },
      // { label: 'Untuk', type: 'text', value: 'to' },
      // { label: 'Dari', type: 'text', value: 'from' },
      { label: 'Perihal', type: 'text', value: 'subject' },
    ],
    menuActions: [
      { text: 'Download', icon: 'mdi-file-download-outline', color: 'success', action: 'download' },
      { text: 'Edit', icon: 'mdi-file-document-edit-outline', color: 'primary', action: 'edit' },
      { text: 'Hapus', icon: 'mdi-delete-outline', color: 'error', action: 'delete' },
    ],
  }),
  computed: {
    circularLetters() {
      return this.$store.state.circularletters.collection
    }
  },
  methods: {
    createCircularLetters() {
      this.$store.dispatch('circularletters/post', this.addForms)
      this.dialogAdd = false
      this.addForms = {}
    },
    editCircularLetters() {
      this.$store.dispatch('circularletters/put', this.editForms)
      this.dialogEdit = false
      this.editForms = {}
    },
    removeCircularLetters() {
      this.$store.dispatch('circularletters/remove', this.editForms)
      this.dialogRemove = false
      this.editForms = {}
    },
    onFilePicked(file) {
      var data = this.filePicked
      if (file.name !== null) {
        this.$set(data, 'name', file.name)
        if (data && data.name && data.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          this.$set(data, 'url', fr.result)
          this.$set(data, 'file', file)
        })
      } else {
        data = {}
      }
    },
    menuAction(action, item) {
      switch(action) {
        case 'edit':
          this.editForms = item
          this.dialogEdit = true
          break
        case 'delete':
          this.editForms = item
          this.dialogRemove = true
          break
        case 'download':
          window.open(item.fileURL, '_blank')
          break
        default:
          break
      }
    },
  },
  watch: {
    dialogEdit(val) {
      if(!val) {
        this.editForms = {}
      }
    },
    dialogRemove(val) {
      if(!val) {
        this.editForms = {}
      }
    },
  }
}
</script>
