<script setup>
import { v4 as uuid } from 'uuid'
import L from 'leaflet'

const { locale } = useI18n({ useScope: 'global' })
const model = defineModel()
const mapId = uuid()
let map, marker

onMounted(() => {
  map = L.map(mapId).setView([model.value.lat, model.value.lng], 17)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)
  marker = L.marker([model.value.lat, model.value.lng], {
    draggable: true,
    autoPan: false
  }).addTo(map)
  marker.on('move', function () {
    const pos = marker.getLatLng()
    model.value.lat = pos.lat
    model.value.lng = pos.lng
  })
})

watch(
  () => model.value,
  () => {
    marker.setLatLng([model.value.lat, model.value.lng])
    const bounds = map.getBounds()
    if (!bounds.contains([model.value.lat, model.value.lng]))
      map.setView([model.value.lat, model.value.lng])
  },
  { deep: true }
)
</script>

<template>
  <div :id="mapId" style="height: 400px"></div>
</template>
