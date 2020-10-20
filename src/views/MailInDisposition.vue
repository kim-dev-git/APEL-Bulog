<template>
  <div id="mail-in-disposition">
    <v-card class="pa-4 mt-4">
      <v-layout
        v-if="document"
        class="align-center">
        <div
          class="text--secondary">
          <p v-text="'Perihal'" class="mb-0" />
          <p v-text="'Dari'" class="mb-0" />
        </div>
        <div
          class="font-weight-bold">
          <p v-text="': ' + document.subject" class="mb-0" />
          <p v-text="': ' + document.from" class="mb-0" />
        </div>
        <v-spacer />
        <v-layout
          class="align-end"
          column>
          <div>
            <span v-text="'Tanggal: '" class="mb-0 text-right" />
            <span v-text="$options.filters.fullDate(document.createdAt)" class="mb-0 text-right font-weight-bold" />
          </div>
          <v-btn
            @click="download(document)"
            class="mt-2"
            color="success"
            outlined
            small>
            <v-icon v-text="'mdi-file-download-outline'" small left />
            <span v-text="'Download file'" />
          </v-btn>
        </v-layout>
      </v-layout>
    </v-card>

    <v-layout>
      <v-spacer />
      <v-btn
        v-if="userProfile.position === 'Pimwil'"
        @click="dialogAdd = true"
        class="mt-4"
        color="primary">
        <v-icon v-text="'mdi-plus'" left />
        <span v-text="'Tambah Disposisi'" />
      </v-btn>
    </v-layout>

    <v-card class="pa-4 mt-4">
      <v-list>
        <v-list-item
          v-for="item in disposition"
          :key="item.id">
          <v-layout column class="justify-center">
            <v-layout class="align-center">
              <v-layout>
                <v-layout column>
                  <div>
                    <v-chip v-text="item.to" color="success" small />
                    <v-chip v-text="item.status ? item.status : 'Perlu ditindak lanjuti'" :color="item.status ? 'info' : 'warning'" class="ml-1" small />
                    <!-- <v-icon v-if="item.status" v-text="'mdi-check-circle'" color="info" class="mx-1" /> -->
                  </div>
                  <v-sheet
                    class="py-2 px-4 mt-2"
                    color="grey lighten-2">
                    <span v-text="'Disposisi'" class="caption text--secondary" />
                    <p v-text="item.notes" class="body-2 mb-0" />
                  </v-sheet>
                  <v-sheet
                    v-if="item.report"
                    class="py-2 px-4 mt-2"
                    color="info lighten-5">
                    <span v-text="'Laporan'" class="caption text--secondary" />
                    <p v-text="item.report" class="body-2 mb-0" />
                  </v-sheet>
                </v-layout>
                <v-spacer />
                <v-layout column class="align-end">
                  <p v-text="`${ $options.filters.fullDate(item.createdAt) }`" class="mb-0" />
                  <!-- <p v-text="item.no ? item.no : '-'" class="mb-0 font-weight-bold" /> -->
                  <v-layout
                    v-if="item.status"
                    class="align-end primary--text subtitle-2">
                    <span v-text="'Ditindak lanjuti pada tanggal'" class="mb-0 font-weight-light" />
                    <span v-text="': '+$options.filters.fullDate(item.doneAt)" class="mb-0 font-weight-bold" />
                  </v-layout>
                  <v-layout
                    v-if="userProfile.position === 'TU' ||
                      userProfile.position === 'Pimwil' ||
                      userProfile.position === item.to"
                    class="align-end">
                    <div>
                      <v-tooltip top
                        v-if="userProfile.position !== 'Pimwil' && userProfile.position !== 'TU' && !item.status">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="menuAction('done', item)"
                            color="info"
                            icon>
                            <v-icon v-text="'mdi-clipboard-check-outline'" :color="'primary'" />
                          </v-btn>
                        </template>
                        <span v-text="'Sudah ditindak lanjuti'" />
                      </v-tooltip>
                      <v-tooltip top
                        v-if="userProfile.position === 'Pimwil'">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            @click="menuAction('delete', item)"
                            color="info"
                            icon>
                            <v-icon v-text="'mdi-delete-outline'" :color="'error'" />
                          </v-btn>
                        </template>
                        <span v-text="'Hapus'" />
                      </v-tooltip>
                    </div>

                    <print :data="item" />

                  </v-layout>
                </v-layout>
              </v-layout>
            </v-layout>
            <v-divider class="my-2" />
          </v-layout>
        </v-list-item>
      </v-list>
    </v-card>

    <content-dialog
      v-model="dialogAdd"
      title="Tambah Disposisi"
      buttonSave="Simpan"
      @save="post()" >

      <form-generator
        v-model="dataAdd"
        :forms="forms"
        :options="options"
      />
    </content-dialog>

    <dialog-confirm id="dialog-remove"
      v-model="dialogRemove"
      title="Yakin hapus Disposisi ini?"
      buttonText="Hapus"
      :remove="true"
      @action="remove()">
      <v-sheet id="dialog-detail"
        class="pa-4 mt-n4 mb-2"
        color="grey lighten-3"
        rounded>
        <v-layout
          v-if="dataEdit"
          column>
          <!-- <span v-text="'No'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.no ? dataEdit.no : '-'" class="font-weight-bold" />
          <v-divider class="my-2" /> -->
          <span v-text="'Tujuan'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.to" class="font-weight-bold" />
          <v-divider class="my-2" />
          <!-- <span v-text="'Disposisi'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.disposition" class="font-weight-bold" />
          <v-divider class="my-2" /> -->
          <span v-text="'Disposisi'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.notes" class="font-weight-bold" />
        </v-layout>
      </v-sheet>
    </dialog-confirm>
  </div>
</template>

<script>

import ContentDialog from '@/components/ContentDialog'
import FormGenerator from '@/components/FormGenerator'
import DialogConfirm from '@/components/DialogConfirm'
import Print from '@/components/PrintDisposition'

export default {
  components: {
    ContentDialog,
    FormGenerator,
    DialogConfirm,
    Print,
  },
  props: [
    'id'
  ],
  data: () => ({
    dialogAdd: null,
    dialogEdit: null,
    dialogRemove: null,
    dataAdd: {},
    dataEdit: {},
    forms: [
      // { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Tujuan', type: 'combobox', value: 'to' },
      // { label: 'Disposisi', type: 'text', value: 'disposition' },
      { label: 'Disposisi', type: 'text', value: 'notes' },
    ],
    menuActions: [
      { text: 'Sudah ditindak lanjuti', icon: 'mdi-clipboard-check-outline', color: 'primary', action: 'done' },
      { text: 'Hapus', icon: 'mdi-delete-outline', color: 'error', action: 'delete' },
    ],
    options: {
      to: [
        'Kabid MINKU',
        'Kabid ADA',
        'Kabid OPP',
        'Kabid KOM',
        'Kabid PBI',
      ]
    }
  }),
  computed: {
    userProfile() {
      return this.$store.state.user.userProfile
    },
    document() {
      return this.$store.state.mailin.document
    },
    disposition() {
      return this.$store.state.mailin.disposition
    }
  },
  methods: {
    get() {
      this.$store.dispatch('mailin/get', this.id)
    },
    post() {
      delete this.dataAdd.id
      delete this.dataAdd.fileExt
      this.dataAdd.type = 'surat-masuk'
      this.$store.dispatch('mailin/postDisposition', { id: this.document.id, form: this.dataAdd, document: this.document })
      this.dialogAdd = false
      this.dataAdd = {}
    },
    remove() {
      this.$store.dispatch('mailin/removeDisposition', { id: this.document.id, data: this.dataEdit })
      this.dialogRemove = false
      this.dataEdit = {}
    },
    menuAction(action, item) {
      switch(action) {
        case 'edit':
          this.dataEdit = item
          this.dialogEdit = true
          break
        case 'delete':
          this.dataEdit = item
          this.dialogRemove = true
          break
        case 'download':
          window.open(item.fileURL, '_blank')
          break
        case 'disposition':
          this.$router.push('/surat-masuk/' + item.id + '/disposisi')
          break
        case 'done':
          this.done(item)
          break
        default:
          break
      }
    },
    download(document) {
      window.open(document.fileURL, '_blank')
    },
    done(item) {
      this.$store.dispatch('mailin/doneDisposition', { id: this.document.id, form: item })
    }
  },
  mounted() {
    this.get()
  }
}
</script>

<style>

</style>