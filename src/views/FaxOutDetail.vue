<template>
  <div id="fax-out-detail"
    class="mt-4">
    <v-layout
      class="justify-center">
      <v-card
        class="pa-4"
        width="600">
        <v-layout>
          <v-spacer />
          <print-document :body="document" />
        </v-layout>
        <v-list>
          <v-list-item-group>
            <v-list-item
              dense
              v-for="form in forms"
              :key="form.value"
              @click="editDocument(form.value)" >
              <v-list-item-content>
                <p class="mb-0 body-2" v-text="form.label" />
              </v-list-item-content>
              <v-list-item-action>
                <p class="mb-0 body-2" v-if="document && document[form.value]" v-text="document[form.value]" />
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-divider />

        <v-card-title
          class="subtitle-2"
          v-html="'Isi berita :'"
        />
        <v-layout id="content-loaded"
          v-if="document && document.content && document.content.body"
          column
          class="mt-n4 red" >
          <v-list
            class="mx-n4 body-2 font-weight-regular" >
            <v-list-item-group>
              <v-list-item id="list-item-body"
                class="px-8" >
                <p
                  class="mb-0 text-justify"
                  v-html="document.content.body"
                  @click="editContent('body')"
                />
                <editor-comment
                  v-if="document"
                  :value="commentsActive.body"
                  :text="document.notes ? document.notes.body : ''"
                  @input="$set(commentsActive, 'body', $event)"
                  @add="dialogCommentNew = true, selectedField = 'body'"
                  @remove="dialogCommentRemove = true, selectedField = 'body'"
                />
              </v-list-item>

              <v-list-item id="list-item-list"
                v-for="(text, index) in document.content.list"
                :key="index"
                class="px-8" >
                <v-layout
                  @click="editContent(index)">
                  <span
                    class="mr-2"
                    v-html="(index + 1) + '.'"
                  />
                  <p
                    class="my-0 text-justify"
                    v-html="text"
                  />
                </v-layout>
                
                <editor-comment
                  v-if="document"
                  :value="commentsActive[index]"
                  :text="document.notes ? document.notes[index] : ''"
                  @input="$set(commentsActive, [index], $event)"
                  @add="dialogCommentNew = true, selectedField = index"
                  @remove="dialogCommentRemove = true, selectedField = index"
                />
              </v-list-item>

              <v-btn
                color="info"
                class="editor-button"
                @click="addContent(document.content.list.length)" >
                <span v-text="'Tambah list'" />
              </v-btn>

              <v-list-item id="list-item-footer"
                v-if="document"
                class="px-8" >
                <p
                  class="mb-0 text-justify"
                  v-html="document.content.footer"
                  @click="editContent('footer')"
                />
                <editor-comment
                  v-if="document"
                  :value="commentsActive.footer"
                  :text="document.notes ? document.notes.footer : ''"
                  @input="$set(commentsActive, 'footer', $event)"
                  @add="dialogCommentNew = true, selectedField = 'footer'"
                  @remove="dialogCommentRemove = true, selectedField = 'footer'"
                />
              </v-list-item>
            </v-list-item-group>
          </v-list>
          
        </v-layout>
        
        <v-layout id="content-loading"
          v-else
          class="justify-center">
          Sedang memmuat...
        </v-layout>

      </v-card>
    </v-layout>

    <v-bottom-sheet id="dialog-document-edit"
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
    </v-bottom-sheet>

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
            <v-icon left v-text="'mdi-printer'" />
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

import EditorComment from '@/components/EditorComment'
import PrintDocument from '@/components/PrintDocument'
export default {
  components: {
    EditorComment,
    PrintDocument,
  },
  props: [ 'id' ],
  data: () => ({
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
      var value = this.selectedField
      var arr = this.formContentEdit.content.list
      console.log(arr.length)
      arr.splice(value, 1)
      this.updateContent()
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