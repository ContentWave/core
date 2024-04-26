<script setup>
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
      const { url } = await api.post('/dashboard/upload-image', {
        content: reader.result.split(',')[1],
        filename: file.name,
        resize: props.conf.resize ? 'true' : 'false',
        crop: props.conf.crop ? 'true' : 'false',
        maxHeight: `${props.conf.maxHeight ?? 0}`,
        maxWidth: `${props.conf.maxWidth ?? 0}`
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

function isImage (filename) {
  const ext = filename.toLowerCase().split('.')
  switch (ext[ext.length - 1]) {
    case 'jpg':
    case 'webp':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'bmp':
    case 'tif':
    case 'svg':
    case 'jng':
      return true
    default:
      return false
  }
}

function viewFile () {
  let url = ''
  if (model.value.filename !== undefined) {
    const ext = model.value.filename.toLowerCase().split('.')
    url = `data:image/${ext[ext.length - 1]};base64,${model.value.content}`
  } else {
    url = model.value
  }
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
}

const imagePreview = computed(() => {
  if (!model.value) return {}
  let url = ''
  if (model.value.filename !== undefined) {
    const ext = model.value.filename.toLowerCase().split('.')
    url = `data:image/${ext[ext.length - 1]};base64,${model.value.content}`
  } else {
    url = model.value
  }
  return {
    background: `url(${url}) no-repeat center center`,
    backgroundSize: 'cover',
    border: 'none !important'
  }
})

function handleClick () {
  if (input.value.files[0]) readFile(input.value.files[0])
}

function dropHandler (ev) {
  hover.value = false
  if (ev.dataTransfer.items) {
    for (let item of [...ev.dataTransfer.items]) {
      const file = item.getAsFile()
      if (item.kind === 'file' && isImage(file.name)) return readFile(file)
    }
  } else {
    const file = [...ev.dataTransfer.files].find(file => isImage(file.name))
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
      class="form-image-preview relative overflow-hidden flex max-w-64 h-36 items-center justify-center border border-dashed border-gray-400 rounded-md text-sm cursor-pointer"
      :class="{ 'ring-4 ring-primary ring-inset': hover }"
      @click="input.click()"
      :style="imagePreview"
    >
      <div class="hover" :class="{ noText: !!model }">
        {{ $t('Drop a file here, or click here') }}
      </div>
      <UProgress
        animation="carousel"
        class="absolute bottom-0 left-0 w-full z-50"
        v-if="loading"
      />
    </div>
    <input
      type="file"
      ref="input"
      accept="image/*"
      style="display: none"
      @change="handleClick"
    />
    <div class="mt-2 text-sm" v-if="model">
      <UButton size="sm" variant="ghost" @click="viewFile" class="mr-4">{{
        $t('Open image in a new tab')
      }}</UButton>
      <UButton size="sm" variant="ghost" @click="model = null">{{
        $t('Clear')
      }}</UButton>
    </div>
  </div>
</template>

<style lang="scss">
.form-image-preview {
  .hover {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 200ms ease-in-out;

    &.noText {
      opacity: 0;
    }

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
    }
  }
}
</style>
