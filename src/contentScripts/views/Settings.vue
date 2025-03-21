<script setup lang="ts">
const props = defineProps<{
  isClosing: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(false)

const settings = ref({
  theme: 'dark',
  position: 'right',
  animation: true,
})

const themes = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
]

const positions = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
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

function closeSettings() {
  isVisible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>

<template>
  <div
    class="un-fixed un-right-22 un-w-64 un-bg-dark-900 un-rounded-2xl un-shadow-lg un-p-4 un-z-100 un-transform un-transition-all un-duration-300 un-ease-in-out"
    :class="[
      isVisible
        ? 'un-opacity-100 un-translate-x-0'
        : 'un-opacity-0 un-translate-x-4',
    ]"
  >
    <div class="un-flex un-justify-between un-items-center un-mb-4">
      <h3 class="un-text-white un-text-lg un-font-medium">
        Settings
      </h3>
      <button
        class="un-text-gray-400 hover:un-text-white un-transition-colors"
        @click="closeSettings"
      >
        <div class="i-iconamoon-close" />
      </button>
    </div>

    <div class="un-space-y-4">
      <!-- Theme Setting -->
      <div>
        <label class="un-block un-text-sm un-text-gray-400 un-mb-2">
          Theme
        </label>
        <select
          v-model="settings.theme"
          class="un-w-full un-bg-dark-800 un-text-white un-rounded-md un-px-3 un-py-2 un-border un-border-dark-700 focus:un-outline-none focus:un-border-[#ffca13]"
        >
          <option
            v-for="theme in themes"
            :key="theme.value"
            :value="theme.value"
          >
            {{ theme.label }}
          </option>
        </select>
      </div>

      <!-- Position Setting -->
      <div>
        <label class="un-block un-text-sm un-text-gray-400 un-mb-2">
          Position
        </label>
        <select
          v-model="settings.position"
          class="un-w-full un-bg-dark-800 un-text-white un-rounded-md un-px-3 un-py-2 un-border un-border-dark-700 focus:un-outline-none focus:un-border-[#ffca13]"
        >
          <option
            v-for="position in positions"
            :key="position.value"
            :value="position.value"
          >
            {{ position.label }}
          </option>
        </select>
      </div>

      <!-- Animation Setting -->
      <div class="un-flex un-items-center un-justify-between">
        <label class="un-text-sm un-text-gray-400">
          Enable Animation
        </label>
        <button
          class="un-relative un-inline-flex un-h-6 un-w-11 un-flex-shrink-0 un-cursor-pointer un-rounded-full un-border-2 un-border-transparent un-bg-dark-700 un-transition-colors un-duration-200 un-ease-in-out focus:un-outline-none focus:un-ring-2 focus:un-ring-[#ffca13] focus:un-ring-offset-2"
          :class="{ 'un-bg-[#ffca13]': settings.animation }"
          @click="settings.animation = !settings.animation"
        >
          <span
            class="un-pointer-events-none un-inline-block un-h-5 un-w-5 un-transform un-rounded-full un-bg-white un-shadow un-ring-0 un-transition un-duration-200 un-ease-in-out"
            :class="{ 'un-translate-x-5': settings.animation }"
          />
        </button>
      </div>
    </div>
  </div>
</template>
