<template>
  <div id="editor-body">

    <v-card-title
      v-html="'Isi berita :'"
      class="subtitle-2"
    />

    <v-layout id="content-loaded"
      v-if="document && document.content && document.content.body"
      column
      class="mt-n4 red" >
      <v-list
        class="mx-n4 body-2 font-weight-regular" >
        <v-list-item-group>
          <v-list-item id="list-item-body"
            @click="onEditBody('body')"
            class="px-8">
            <p
              class="mb-0 text-justify"
              v-html="document.content.body"
            />
            <editor-comment
              v-if="document"
              :value="commentsActive.body"
              :text="document.notes ? document.notes.body : ''"
              @input="onActiveComment({edit: 'body', value: $event})"
              @add="onAddComment('body')"
              @remove="onRemoveComment('body')"
            />
          </v-list-item>

          <v-list-item id="list-item-list"
            v-for="(text, index) in document.content.list"
            :key="index"
              @click="onEditBody(index)"
            class="px-8" >
            <v-layout>
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
              @input="onActiveComment({edit: [index], value: $event})"
              @add="onAddComment(index)"
              @remove="onRemoveComment(index)"
            />
          </v-list-item>

          <v-btn
            color="info"
            class="editor-button"
            @click="onAddBody(document.content.list.length)" >
            <span v-text="'Tambah list'" />
          </v-btn>

          <v-list-item id="list-item-footer"
            v-if="document"
            @click="onEditBody('footer')"
            class="px-8" >
            <p
              class="mb-0 text-justify"
              v-html="document.content.footer"
            />
            <editor-comment
              v-if="document"
              :value="commentsActive.footer"
              :text="document.notes ? document.notes.footer : ''"
              @input="onActiveComment({edit: 'footer', value: $event})"
              @add="onAddComment('footer')"
              @remove="onRemoveComment('footer')"
            />
          </v-list-item>
        </v-list-item-group>
      </v-list>
      
    </v-layout>
    
    <v-layout id="content-loading"
      v-else
      class="justify-center">
      Sedang memuat...
    </v-layout>
  </div>
</template>

<script>

import EditorComment from '@/components/EditorComment'
export default {
  components: {
    EditorComment,
  },
  props: [
    'document',
    'commentsActive',
  ],
  methods: {
    onAddBody(val) {
      this.$emit('add-body', val)
    },
    onEditBody(val) {
      this.$emit('edit-body', val)
    },
    onActiveComment(payload) {
      this.$emit('active-comment', payload)
    },
    onAddComment(val) {
      this.$emit('add-comment', val)
    },
    onRemoveComment(val) {
      this.$emit('remove-comment', val)
    },
  }
}
</script>

<style>

</style>