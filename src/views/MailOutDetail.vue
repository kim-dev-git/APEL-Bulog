<template>
  <div id="mail-out-detail"
    class="mt-4">
    <v-layout
      class="align-center pb-8"
      column>

      <v-card
        class="pa-4 mb-4"
        width="600">

        <v-layout id="acc-document"
          v-if="userProfile && userProfile.position === 'Pimwil' && document">
          <v-spacer />
          <v-btn
            v-if="document.status === 'Telah direvisi' || document.status === 'Menunggu persetujuan'"
            color="primary"
            @click="dialogAccDocument = true">
            <v-icon v-text="'mdi-check'" class="ml-0" left />
            <span v-text="'Setujui surat'" class="mr-2 text-none" />
          </v-btn>
        </v-layout>

        <v-layout id="print-document"
          v-if="userProfile && userProfile.position === 'TU' && document"
          class="mb-3">
          <v-spacer />
          <v-btn
            v-if="document.status === 'Telah direvisi' || document.status === 'Disetujui'"
            color="success"
            class="mr-2"
            @click="dialogPrintedDocument = true">
            <v-icon v-text="'mdi-check'" class="ml-0" left />
            <span v-text="'Telah diprint'" class="mr-2 text-none" />
          </v-btn>
          <print-document :headers="headers" :body="document" />
        </v-layout>

        <v-layout id="tool-tip"
          v-if="userProfile && userProfile.position === 'TU'"
          column>
          <v-sheet
            class="pa-2 px-4 mx-n4"
            color="info"
            dark>
            <v-icon v-text="'mdi-information-outline'" left />
            <span v-text="'Klik teks untuk mengedit'" />
          </v-sheet>
        </v-layout>
      </v-card>

      <v-card
        class="pa-4"
        width="600">

        <editor-header
          :forms="forms"
          :document="document"
          @click="editDocument($event)"
        />

        <v-divider />

        <editor-body
          :document="document"
          :commentsActive="commentsActive"
          @add-body="addContent($event)"
          @edit-body="editContent($event)"
          @active-comment="$set(commentsActive, $event.edit, $event.value)"
          @add-comment="dialogCommentNew = true, selectedField = $event"
          @remove-comment="dialogCommentRemove = true, selectedField = $event"
        />

      </v-card>
    </v-layout>

    <dialog-document-edit id="dialog-document-edit"
      v-model="dialogDocumentEdit"
      :data="selectedField"
      :form="formDocumentEdit"
      @save="updateDocument()"
    />

    <dialog-content-edit id="dialog-content-edit"
      v-model="dialogContentEdit"
      :data="selectedField"
      :form="formContentEdit"
      @save="updateContent()"
      @remove="dialogContentRemove = true"
    />

    <dialog-content-new id="dialog-content-new"
      v-model="dialogContentNew"
      :data="document"
      :form="formContentEdit"
      @save="updateContent()"
    />

    <dialog-remove id="dialog-content-remove"
      v-model="dialogContentRemove"
      title="Yakin hapus list?"
      @remove="removeContent()"
    />

    <dialog-comment-new id="dialog-comment-new"
      v-if="document && document.content"
      v-model="dialogCommentNew"
      :data="selectedField"
      :form="formCommentNew"
      @save="createComment()"
      @update="formCommentNew = $event"
    />

    <dialog-remove id="dialog-comment-remove"
      v-model="dialogCommentRemove"
      title="Yakin hapus komentar?"
      @remove="removeComment()"
    />

    <dialog-confirm id="dialog-printed-document"
      v-model="dialogPrintedDocument"
      title="Surat sudah di cetak?"
      buttonText="Sudah"
      @action="printedDocument()"
    />

    <dialog-confirm id="dialog-acc-document"
      v-model="dialogAccDocument"
      title="Setujui surat?"
      buttonText="Setujui"
      @action="accDocument()"
    />

  </div>
</template>

<script>

import EditorHeader from '@/components/EditorHeader'
import EditorBody from '@/components/EditorBody'
import EditorComment from '@/components/EditorComment'
import PrintDocument from '@/components/PrintDocument'
import DialogDocumentEdit from '@/components/DialogDocumentEdit'
import DialogContentNew from '@/components/DialogContentNew'
import DialogContentEdit from '@/components/DialogContentEdit'
import DialogCommentNew from '@/components/DialogCommentNew'
import DialogRemove from '@/components/DialogRemove'
import DialogConfirm from '@/components/DialogConfirm'
export default {
  components: {
    EditorHeader,
    EditorBody,
    EditorComment,
    PrintDocument,
    DialogDocumentEdit,
    DialogContentNew,
    DialogContentEdit,
    DialogCommentNew,
    DialogRemove,
    DialogConfirm,
  },
  props: [ 'id' ],
  data: () => ({
    headers: [
      { header: 'Nomor', dataKey: 'no' },
      { header: 'Kepada', dataKey: 'to' },
      { header: 'Dari', dataKey: 'from' },
      { header: 'Asal Berita', dataKey: 'origin' },
      { header: 'Perihal', dataKey: 'subject' },
      { header: 'Jumlah Lembar', dataKey: 'sheets' },
    ],
    forms: [
      { label: 'Nomor', type: 'text', value: 'no' },
      { label: 'Kepada', type: 'text', value: 'to' },
      { label: 'Dari', type: 'text', value: 'from' },
      { label: 'Asal Berita', type: 'text', value: 'origin' },
      { label: 'Perihal', type: 'text', value: 'subject' },
      { label: 'Jumlah Lembar', type: 'number', value: 'sheets' },
    ],
    selectedField: null,
    dialogDocumentEdit: false,
    dialogContentEdit: false,
    dialogContentNew: false,
    dialogContentRemove: false,
    dialogCommentNew: false,
    dialogCommentRemove: false,
    dialogPrintedDocument: false,
    dialogAccDocument: false,
    formDocumentEdit: {},
    formContentEdit: {},
    commentsActive: {},
    formCommentNew: null
  }),
  computed: {
    document() {
      return this.$store.state.mailout.document
    },
    userProfile() {
      return this.$store.state.user.userProfile
    }
  },
  methods: {
    editDocument(value) {
      const forms = this.forms
      forms.forEach(form => {
        if (form.value === value) {
          this.selectedField = form
        }
      })
      this.formDocumentEdit = JSON.parse(JSON.stringify(this.document))
      // this.formDocumentEdit.status = 'Sudah direvisi'
      this.dialogDocumentEdit = true

    },
    updateDocument() {
      this.$store.dispatch('mailout/put', this.formDocumentEdit)
      // this.$store.dispatch('mailout/get', this.id)
      this.dialogDocumentEdit = false
    },
    editContent(value) {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      if(this.formContentEdit.status !== 'Menunggu persetujuan') {
        this.formContentEdit.status = 'Telah direvisi'
      }
      this.selectedField = value
      this.dialogContentEdit = true
    },
    updateContent() {
      this.$store.dispatch('mailout/put', this.formContentEdit)
      // this.$store.dispatch('mailout/get', this.id)
      this.selectedField = null
      this.dialogContentEdit = false
      this.dialogContentNew = false
      this.dialogContentRemove = false
      this.dialogCommentNew = false
      this.dialogCommentRemove = null
      this.formCommentNew = null
    },
    addContent(value) {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      this.dialogContentNew = true
    },
    deleteContent(value) {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      this.selectedField = value
      this.dialogContentRemove = true
    },
    removeContent() {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      let data = this.formContentEdit

      var value = this.selectedField
      var arr = this.formContentEdit.content.list
      arr.splice(value, 1)

      // Remove Comment
      data.notes[value] = null
      this.commentsActive[value] = false

      this.updateContent()
      // this.removeComment()
    },
    createComment() {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      let data = this.formContentEdit
      const field = this.selectedField
      if(data.notes) {
        data.notes[field] = this.formCommentNew
      } else {
        const notes = {
          [field]: this.formCommentNew
        }
        data.notes = notes
      }
      data.status = 'Perlu diperbaiki'
      this.updateContent()
      this.commentsActive[field] = true

    },
    removeComment() {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      let data = this.formContentEdit
      const field = this.selectedField
      data.notes[field] = null
      this.commentsActive[field] = false
      this.updateContent()
      this.dialogCommentRemove = false
      this.formCommentNew = null
    },
    printedDocument() {
      var data = JSON.parse(JSON.stringify(this.document))
      data.status = 'Sudah diprint'
      this.$store.dispatch('mailout/put', data)
      this.dialogPrintedDocument = false
    },
    accDocument() {
      var data = JSON.parse(JSON.stringify(this.document))
      data.status = 'Disetujui'
      this.$store.dispatch('mailout/put', data)
      this.dialogAccDocument = false
    }
    
  },
  async mounted() {
    await this.$store.dispatch('mailout/get', this.id)
    const commentsActive = this.commentsActive
  },
  watch: {
    dialogDocumentEdit(val) {
      if(val === false) {
        this.formDocumentEdit = {}
        this.selectedField = null
      }
    },
    dialogContentEdit(val) {
      if(val === false) {
        this.formContentEdit = {}
        this.selectedField = null
      }
    },
    dialogContentNew(val) {
      if(val === false) {
        this.formContentEdit = {}
      }
    }
  }
}
</script>

<style>

</style>