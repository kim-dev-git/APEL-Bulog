<template>
  <div id="fax-out-detail"
    class="mt-4">
    <v-layout
      class="justify-center">

      <v-card
        class="pa-4"
        width="600">
        <v-layout id="print-document">
          <v-spacer />
          <print-document :headers="headers" :body="document" />
        </v-layout>

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
    formDocumentEdit: {},
    formContentEdit: {},
    commentsActive: {},
    formCommentNew: null
  }),
  computed: {
    document() {
      return this.$store.state.faxout.document
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
      this.dialogDocumentEdit = true

    },
    updateDocument() {
      this.$store.dispatch('faxout/put', this.formDocumentEdit)
      this.$store.dispatch('faxout/get', this.id)
      this.dialogDocumentEdit = false
    },
    editContent(value) {
      this.formContentEdit = JSON.parse(JSON.stringify(this.document))
      this.selectedField = value
      this.dialogContentEdit = true
    },
    updateContent() {
      this.$store.dispatch('faxout/put', this.formContentEdit)
      this.$store.dispatch('faxout/get', this.id)
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
    
  },
  async mounted() {
    await this.$store.dispatch('faxout/get', this.id)
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