<script setup lang="ts">
defineProps<{
  isClosing: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

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
</script>

<template>
  <Popup
    title="Settings"
    :is-closing="isClosing"
    width="16rem"
    position="right"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <Combobox
        v-model="settings.project"
        :items="projects"
        display-key="label"
        placeholder="Select Project"
      />
      <Combobox
        v-model="settings.page"
        :items="pages"
        display-key="label"
        placeholder="Select Page"
      />
    </div>
  </Popup>
</template>
