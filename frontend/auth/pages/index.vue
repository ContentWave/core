<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  router.push(
    '/error?msg=' +
      encodeURIComponent('You should be coming from authorization endpoint.')
  )
})
</script>
