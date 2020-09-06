<template>
  <div id="mail-in-disposition">
    <v-card class="pa-4 mt-4">
      {{ document }}
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
                    <v-chip v-text="item.to" color="info" small />
                    <v-chip v-text="item.disposition" color="success" class="mx-1" small />
                    <v-icon v-if="item.report" v-text="'mdi-check-circle'" color="info" />
                  </div>
                  <v-sheet
                    class="py-2 px-4 mt-2"
                    color="grey lighten-2">
                    <span v-text="'Catatan'" class="caption text--secondary" />
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
                  <p v-text="item.no ? item.no : '-'" class="mb-0 font-weight-bold" />
                  <v-layout
                    v-if="userProfile.position === 'TU' || userProfile.position === 'Pimwil' || userProfile.position === item.to"
                    class="align-end">
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
          <span v-text="'No'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.no ? dataEdit.no : '-'" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Tujuan'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.to" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Disposisi'" class="text--secondary subtitle-2" />
          <span v-text="dataEdit.disposition" class="font-weight-bold" />
          <v-divider class="my-2" />
          <span v-text="'Catatan'" class="text--secondary subtitle-2" />
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
export default {
  components: {
    ContentDialog,
    FormGenerator,
    DialogConfirm,
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
      { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Tujuan', type: 'text', value: 'to' },
      { label: 'Disposisi', type: 'text', value: 'disposition' },
      { label: 'Catatan', type: 'text', value: 'notes' },
    ],
    menuActions: [
      { text: 'Laporan', icon: 'mdi-clipboard-check-outline', color: 'primary', action: 'report' },
      { text: 'Hapus', icon: 'mdi-delete-outline', color: 'error', action: 'delete' },
    ],
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
      this.$store.dispatch('mailin/postDisposition', { id: this.document.id, form: this.dataAdd})
      this.dialogAdd = false
      this.dataAdd = {}
    },
    remove() {
      this.$store.dispatch('mailin/removeDisposition', { id: this.document.id, data: this.dataEdit})
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
        default:
          break
      }
    },
  },
  mounted() {
    this.get()
  }
}
</script>

<style>

</style>