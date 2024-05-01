<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  conf: {},
  name: { type: String }
})
const model = defineModel()

const editor = useEditor({
  content: model.value ?? '',
  extensions: [StarterKit],
  onUpdate: () => {
    updateModel()
  },
  editorProps: {
    attributes: {
      class:
        'text-sm mt-4 overflow-auto h-64 px-2.5 py-1.5 rounded-md shadow-sm ring-1 ring-inset ring-gray-300'
    }
  }
})

function updateModel () {
  model.value = editor.value.getHTML()
}
</script>

<template>
  <div v-if="editor">
    <div class="flex gap-2 flex-wrap">
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <UIcon name="i-material-symbols-format-bold" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <UIcon name="i-material-symbols-format-italic-rounded" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        <UIcon name="i-material-symbols-format-strikethrough" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        <UIcon name="i-material-symbols-code-rounded" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().unsetAllMarks().run()"
      >
        <UIcon name="i-material-symbols-format-clear-rounded" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        <UIcon name="i-material-symbols-format-paragraph" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        <UIcon name="i-material-symbols-format-h1" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        <UIcon name="i-material-symbols-format-h2" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        <UIcon name="i-material-symbols-format-h3" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <UIcon name="i-material-symbols-format-list-bulleted" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        <UIcon name="i-material-symbols-format-list-numbered" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        <UIcon name="i-material-symbols-code-blocks" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        <UIcon name="i-material-symbols-format-quote" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        <UIcon name="i-material-symbols-horizontal-rule" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().setHardBreak().run()"
      >
        <UIcon name="i-material-symbols-insert-page-break" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        <UIcon name="i-material-symbols-undo" />
      </UButton>
      <UButton
        variant="soft"
        color="primary"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        <UIcon name="i-material-symbols-redo" />
      </UButton>
    </div>
    <div>
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style lang="scss">
.tiptap {
  p {
    margin-bottom: 1em;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 1em;
    margin-top: 0.5em;
  }

  h2 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 1em;
    margin-top: 0.5em;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 1em;
    margin-top: 0.5em;
  }

  blockquote {
    font-style: italic;
    margin-bottom: 1em;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.75rem;
    padding: 1rem;
    background: rgb(249, 250, 251);
    border-left: 4px solid rgb(209, 213, 219);
    border-inline-start-width: 4px;

    p:last-child {
      margin: 0;
    }
  }

  hr {
    margin: 20px 0;
    border-color: #ccc;
  }

  ul {
    list-style: initial;
    margin-left: 30px;
  }

  ol {
    list-style: decimal;
    margin-left: 30px;
  }
}
</style>
