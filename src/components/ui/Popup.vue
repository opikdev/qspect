<script setup lang="ts">
const props = defineProps<{
  isClosing?: boolean
  title?: string
  width?: string
  position?: 'right' | 'left'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(false)

// Default values
const width = computed(() => props.width || '16rem') // 64 = 16rem
const position = computed(() => props.position || 'right')

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
    class="fixed bg-dark-900 rounded-2xl shadow-lg p-4 z-100 transform transition-all duration-300 ease-in-out"
    :class="[
      isVisible
        ? 'opacity-100 translate-x-0'
        : 'opacity-0 translate-x-4',
      position === 'right' ? 'right-22' : 'left-22',
    ]"
    :style="{ width }"
  >
    <div v-if="title" class="text-white text-lg font-medium mb-4 text-center block">
      {{ title }}
    </div>

    <slot />
  </div>
</template>
