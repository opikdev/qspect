<script setup lang="ts">
const props = defineProps<{
  isClosing: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(false)

const settings = ref({
  project: null,
  page: null,
})

const projects = [
  { value: 'project1', label: 'Project 1' },
  { value: 'project2', label: 'Project 2' },
]

const pages = [
  { value: 'page1', label: 'Page 1' },
  { value: 'page2', label: 'Page 2' },
]

onMounted(() => {
  // Start animation after component is mounted
  setTimeout(() => {
    isVisible.value = true
  }, 50)
})

watch(() => props.isClosing, (newValue: boolean) => {
  if (newValue) {
    isVisible.value = false
    setTimeout(() => {
      emit('close')
    }, 300)
  }
})
</script>

<template>
  <div
    class="fixed right-22 w-64 bg-dark-900 rounded-2xl shadow-lg p-4 z-100 transform transition-all duration-300 ease-in-out"
    :class="[
      isVisible
        ? 'opacity-100 translate-x-0'
        : 'opacity-0 translate-x-4',
    ]"
  >
    <div class="text-white text-lg font-medium mb-4 text-center block">
      Settings
    </div>

    <div class="space-y-4">
      <Combobox v-model="settings.project" :items="projects" display-key="label" placeholder="Select Project" />
      <Combobox v-model="settings.page" :items="pages" display-key="label" placeholder="Select Page" />
    </div>
  </div>
</template>
