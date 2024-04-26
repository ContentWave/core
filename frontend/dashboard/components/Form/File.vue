<script setup>
import mime from 'mime-types'

const props = defineProps({
  conf: {},
  name: { type: String },
  uploadFiles: { type: Boolean, default: false }
})
const model = defineModel()
const inSetup = ref(true)
const input = ref(null)
const loading = ref(false)
const api = useApi()

function readFile (file) {
  loading.value = true
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = async () => {
    if (props.uploadFiles) {
      const { url } = await api.post('/dashboard/upload-file', {
        content: reader.result.split(',')[1],
        filename: file.name
      })
      model.value = url
    } else
      model.value = {
        content: reader.result.split(',')[1],
        filename: file.name
      }
    loading.value = false
  }
}

function viewFile () {
  const a = document.createElement('a')
  a.href = model.value
  a.target = '_blank'
  a.click()
}

function getFilename (url) {
  if (url.substring(0, 4) === 'http') {
    url = url.split('/')
    return url[url.length - 1]
  }
  if (url.substring(0, 5) === 'data:') {
    url = url.split(',')
    url = url[0]
    url = url.substring(5).split(';')[0]
    return 'file.' + mime.extension(url)
  }
  return url
}

function handleClick () {
  if (input.value.files[0]) readFile(input.value.files[0])
}

function dropHandler (ev) {
  hover.value = false
  if (ev.dataTransfer.items) {
    for (let item of [...ev.dataTransfer.items])
      if (item.kind === 'file') return readFile(item.getAsFile())
  } else {
    const file = [...ev.dataTransfer.files][0]
    if (file) return readFile(file)
  }
}
const hover = ref(false)

onMounted(() => {
  if (!model.value) model.value = null
  inSetup.value = false
})
/**
 *      content: { type: 'string', format: 'byte' },
          filename: { type: 'string' }
 */
</script>

<template>
  <div v-if="!inSetup">
    <div
      @drop.prevent="dropHandler"
      @dragover.prevent="hover = true"
      @dragleave.prevent="hover = false"
      class="relative flex max-w-64 h-32 items-center justify-center border border-dashed border-gray-400 rounded-md text-sm cursor-pointer"
      :class="{ 'ring-4 ring-primary ring-inset': hover }"
      @click="input.click()"
    >
      {{ $t('Drop a file here, or click here') }}
      <UProgress
        animation="carousel"
        class="absolute bottom-0 left-0 w-full z-50"
        v-if="loading"
      />
    </div>
    <input
      type="file"
      ref="input"
      style="display: none"
      @change="handleClick"
    />
    <div class="mt-2 text-sm" v-if="model?.filename !== undefined">
      {{
        $t('This file will be uploaded: {filename}', {
          filename: model.filename
        })
      }}
      <UButton size="sm" variant="ghost" @click="model = null" class="ml-4">{{
        $t('Clear')
      }}</UButton>
    </div>
    <div class="mt-2 text-sm" v-if="typeof model === 'string'">
      {{
        $t('Filename: {filename}', {
          filename: getFilename(model)
        })
      }}
      <UButton size="sm" variant="ghost" @click="viewFile" class="ml-4">{{
        $t('View file')
      }}</UButton>
      <UButton size="sm" variant="ghost" @click="model = null" class="ml-4">{{
        $t('Clear')
      }}</UButton>
    </div>
  </div>
</template>
