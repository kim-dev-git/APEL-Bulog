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

    <dialog-sheet id="dialog-document-edit"
      v-model="dialogDocumentEdit"
      :data="selectedField"
      :form="formDocumentEdit"
      @save="updateDocument()"
    />

    <!-- <v-bottom-sheet id="dialog-document-edit"
      persistent
      max-width="640"
      v-model="dialogDocumentEdit" >
      <v-sheet>
        <v-layout id="dialog-header"
          class="align-center">
          <v-card-title v-if="selectedField" v-text="selectedField.label" />
          <v-spacer />
          <v-btn
            text
            class="text-none"
            @click="dialogDocumentEdit = false" >
            <v-icon left v-text="'mdi-close'" />
            Tutup
          </v-btn>
        </v-layout>

        <v-layout id="dialog-body"
          class="px-4" >
          <v-text-field
            v-if="selectedField"
            :type="selectedField.type"
            outlined
            v-model.trim="formDocumentEdit[selectedField.value]"
          />
        </v-layout>

        <v-layout id="dialog-action"
          class="px-4 mt-n4 pb-4">
          <v-spacer />
          <v-btn
            color="primary"
            class="text-none"
            @click="updateDocument()" >
            <span class="px-4" v-text="'Simpan'" />
          </v-btn>
        </v-layout>
      </v-sheet>
    </v-bottom-sheet> -->

    <v-bottom-sheet id="dialog-content-edit"
      persistent
      max-width="640"
      v-model="dialogContentEdit" >
      <v-sheet>
        <v-layout id="dialog-header"
          class="align-center">
          <v-card-title v-if="selectedField !== null" v-text="getTitle()" />
          <v-spacer />
          <v-btn
            v-if="Number.isInteger(selectedField)"
            text
            color="error"
            class="text-none"
            @click="dialogContentRemove = true" >
            <v-icon left v-text="'mdi-delete-outline'" />
            Hapus
          </v-btn>
          <v-btn
            text
            class="text-none"
            @click="dialogContentEdit = false" >
            <v-icon left v-text="'mdi-close'" />
            Tutup
          </v-btn>
        </v-layout>

        <v-layout id="dialog-body"
          class="px-4" >
          <v-textarea
            v-if="formContentEdit && formContentEdit.content && dialogContentEdit && !Number.isInteger(selectedField)"
            outlined
            auto-grow
            v-model="formContentEdit.content[selectedField]"
          />

          <v-textarea
            v-if="formContentEdit && formContentEdit.content && dialogContentEdit && Number.isInteger(selectedField)"
            outlined
            auto-grow
            v-model="formContentEdit.content.list[selectedField]"
          />
        </v-layout>

        <v-layout id="dialog-action"
          class="px-4 mt-n4 pb-4">
          <v-spacer />
          <v-btn
            color="primary"
            class="text-none"
            @click="updateContent()" >
            <span class="px-4" v-text="'Simpan'" />
          </v-btn>
        </v-layout>
      </v-sheet>
    </v-bottom-sheet>
    
    <v-bottom-sheet id="dialog-content-new"
      persistent
      max-width="640"
      v-model="dialogContentNew" >
      <v-sheet>
        <v-layout id="dialog-header"
          v-if="document && document.content"
          class="align-center">
          <v-card-title v-text="'List Ke-' + (document.content.list.length + 1)" />
          <v-spacer />
          <v-btn
            text
            class="text-none"
            @click="dialogContentNew = false" >
            <v-icon left v-text="'mdi-close'" />
            Tutup
          </v-btn>
        </v-layout>

        <v-layout id="dialog-body"
          class="px-4" >
          <v-textarea
            v-if="formContentEdit && formContentEdit.content"
            outlined
            auto-grow
            v-model="formContentEdit.content.list[document.content.list.length]"
          />
        </v-layout>

        <v-layout id="dialog-action"
          class="px-4 mt-n4 pb-4">
          <v-spacer />
          <v-btn
            color="primary"
            class="text-none"
            @click="updateContent()" >
            <span class="px-4" v-text="'Simpan'" />
          </v-btn>
        </v-layout>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog id="dialog-content-remove"
      max-width="400"
      v-model="dialogContentRemove">
      <v-card class="pa-4">
        <v-card-text>
          Yakin hapus data?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="grey"
            class="text-none"
            @click="dialogContentRemove = false" >
            <span class="mx-4" v-text="'Batal'" />
          </v-btn>
          <v-btn
            color="error"
            class="text-none"
            @click="removeContent()" >
            <span class="mx-4" v-text="'Hapus'" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-bottom-sheet id="dialog-comment-add"
      persistent
      max-width="640"
      v-model="dialogCommentNew" >
      <v-sheet>
        <v-layout id="dialog-header"
          v-if="document && document.content"
          class="align-center">
          <v-card-title v-text="Number.isInteger(selectedField) ? ('Tambahkan Komentar ke list-' + (selectedField + 1)) : 'Tambahkan Komentar ke ' + selectedField" />
          <v-spacer />
          <v-btn
            text
            class="text-none"
            @click="dialogCommentNew = false" >
            <v-icon left v-text="'mdi-close'" />
            Tutup
          </v-btn>
        </v-layout>

        <v-layout id="dialog-body"
          class="px-4" >
          <v-textarea
            outlined
            auto-grow
            v-model="formCommentNew"
          />
        </v-layout>

        <v-layout id="dialog-action"
          class="px-4 mt-n4 pb-4">
          <v-spacer />
          <v-btn
            color="primary"
            class="text-none"
            @click="createComment()" >
            <span class="px-4" v-text="'Simpan'" />
          </v-btn>
        </v-layout>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog id="dialog-comment-remove"
      max-width="400"
      v-model="dialogCommentRemove">
      <v-card class="pa-4">
        <v-card-text>
          Yakin hapus komentar?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            color="grey"
            class="text-none"
            @click="dialogCommentRemove = false" >
            <span class="mx-4" v-text="'Batal'" />
          </v-btn>
          <v-btn
            color="error"
            class="text-none"
            @click="removeComment()" >
            <span class="mx-4" v-text="'Hapus'" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import EditorHeader from '@/components/EditorHeader'
import EditorBody from '@/components/EditorBody'
import EditorComment from '@/components/EditorComment'
import PrintDocument from '@/components/PrintDocument'
import DialogSheet from '@/components/DialogSheet'
export default {
  components: {
    EditorHeader,
    EditorBody,
    EditorComment,
    PrintDocument,
    DialogSheet,
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
    async removeContent() {
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
    },
    getTitle() {
      const val = this.selectedField
      if (val === 'body') {
        return 'Isi Berita'
      } else {
        return `List Ke-${ val + 1 }`
      }
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