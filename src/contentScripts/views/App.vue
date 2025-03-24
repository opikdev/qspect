<script setup lang="ts">
import { sendMessage } from 'webext-bridge/content-script'
import icon from '../../assets/q.svg'
import Settings from './Settings.vue'
import 'uno.css'

// Constants
const BUTTON_SIZE = 36 // 9 * 4
const GAP_SIZE = 6 // 1.5 * 4
const TRANSITION_DURATION = 300
const TRANSITION_DELAY = 50

const isVisible = ref(false)
const activeTool = ref<typeof tools[0] | null>(null)
const isSettingsClosing = ref(false)
const hoveredIndex = ref<number | null>(null)
const isInitialLoad = ref(true)

const tools = [
  { title: 'UI Check', icon: 'i-iconamoon-eye' },
  { title: 'UI Feedback', icon: 'i-iconamoon-comment-add' },
  { title: 'Standardization Check', icon: 'i-iconamoon-file-check' },
  { title: 'Content Check', icon: 'i-iconamoon-file-document' },
  { title: 'Settings', icon: 'i-iconamoon-settings' },
  { title: 'Close', icon: 'i-iconamoon-close' },
]

const containerHeight = computed(() =>
  isVisible.value
    ? BUTTON_SIZE + GAP_SIZE + (BUTTON_SIZE + GAP_SIZE) * tools.length - GAP_SIZE
    : BUTTON_SIZE,
)

const toolsContainerHeight = computed(() =>
  isVisible.value
    ? containerHeight.value - BUTTON_SIZE
    : 0,
)

function toggleVisibility() {
  isVisible.value = !isVisible.value
  if (!isVisible.value) {
    activeTool.value = null
  }
  isInitialLoad.value = false
}

function getTransitionDelay(index: number) {
  return `${index * TRANSITION_DELAY}ms`
}

function handleToolClick(tool: typeof tools[0]) {
  if (tool.title === 'Settings') {
    if (!activeTool.value) {
      activeTool.value = tool
      isSettingsClosing.value = false
    }
    else {
      isSettingsClosing.value = true
      setTimeout(() => {
        activeTool.value = null
        isSettingsClosing.value = false
      }, 300)
    }
  }
  else if (tool.title === 'Close') {
    sendMessage('close', { data: {} })
  }
}

function handleSettingsClose() {
  isSettingsClosing.value = true
  setTimeout(() => {
    activeTool.value = null
    isSettingsClosing.value = false
  }, 300)
}

function handleMouseEnter(index: number) {
  hoveredIndex.value = index
}

function handleMouseLeave() {
  hoveredIndex.value = null
}

onMounted(() => {
  setTimeout(() => {
    isInitialLoad.value = false
  }, 500)
})
</script>

<template>
  <div class="fixed inset-y-0 right-0 my-auto mr-5 w-max h-max z-100 flex items-center font-sans select-none leading-1em">
    <div
      class="flex flex-col gap-1.5 rounded-full p-1.5 bg-dark-900"
      :style="{
        height: `${containerHeight}px`,
        transition: `height ${TRANSITION_DURATION}ms ease-in-out`,
      }"
    >
      <button
        class="bg-[#ffca13] border-none shrink-0 inline-flex items-center justify-center rounded-full w-9 h-9 cursor-pointer hover:opacity-80"
        :style="{
          transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
        }"
        @click="toggleVisibility"
      >
        <img :src="icon" class="w-4 h-4">
      </button>

      <div class="relative">
        <div class="absolute inset-0 pointer-events-none">
          <div
            v-for="(tool, index) in tools"
            :key="`tooltip-${tool.icon}`"
            class="absolute pointer-events-none"
            :style="{
              top: `${index * (BUTTON_SIZE + GAP_SIZE)}px`,
              left: 0,
              width: '100%',
              height: `${BUTTON_SIZE}px`,
            }"
          >
            <div
              class="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-dark-800 text-white text-sm rounded-md whitespace-nowrap z-50"
              :class="[
                !isInitialLoad
                  ? 'transition-all duration-200 ease-in-out'
                  : '',
                isVisible && hoveredIndex === index
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2',
              ]"
            >
              {{ tool.title }}
            </div>
          </div>
        </div>

        <div
          class="flex flex-col gap-1.5 overflow-hidden"
          :style="{
            height: `${toolsContainerHeight}px`,
            transition: `height ${TRANSITION_DURATION}ms ease-in-out`,
          }"
        >
          <div
            v-for="(tool, index) in tools"
            :key="tool.icon"
            class="relative"
          >
            <button
              class="relative shrink-0 rounded-full w-9 h-9 border-none inline-flex items-center justify-center cursor-pointer text-lg transform origin-right"
              :class="[
                tool.title === 'Close'
                  ? 'hover:bg-red-500 hover:text-white'
                  : 'hover:bg-white hover:text-dark-900',
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-4 pointer-events-none',
                activeTool && tool.title === activeTool.title
                  ? 'bg-white text-dark-900'
                  : 'bg-dark-500 text-white',
              ]"
              :style="{
                transition: `all ${TRANSITION_DURATION}ms ease-in-out ${getTransitionDelay(index)}`,
              }"
              @click="handleToolClick(tool)"
              @mouseenter="handleMouseEnter(index)"
              @mouseleave="handleMouseLeave"
            >
              <div :class="tool.icon" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <Settings
      v-if="activeTool?.title === 'Settings'"
      :is-closing="isSettingsClosing"
      @close="handleSettingsClose"
    />
  </div>
</template>
