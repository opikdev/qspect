<script setup lang="ts">
interface Item {
  value: string | number
  [key: string]: any
}

// Props
const props = defineProps<{
  modelValue: Item | null
  items: Item[]
  displayKey?: string
  placeholder?: string
  label?: string
  searchKey?: string
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Item | null]
  'search': [query: string]
}>()

// Refs and computed
const isOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const displayKey = computed(() => props.displayKey || 'name')
const searchKey = computed(() => props.searchKey || displayKey.value)

// Computed
const filteredItems = computed(() => {
  return query.value === ''
    ? props.items
    : props.items.filter(item =>
        item[searchKey.value]
          .toLowerCase()
          .includes(query.value.toLowerCase()),
      )
})

const selectedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

// Methods
function handleSearch(event: Event) {
  const value = (event.target as HTMLInputElement).value
  query.value = value
  emit('search', value)
  isOpen.value = true
}

function handleSelect(item: Item) {
  selectedValue.value = item
  isOpen.value = false
  query.value = ''
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClear(e: Event) {
  e.stopPropagation() // Prevent dropdown toggle
  selectedValue.value = null
  query.value = ''
}

// Close dropdown when clicking outside
onClickOutside(inputRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div class="relative mt-1">
    <label v-if="label" class="block text-sm text-gray-400 mb-2">
      {{ label }}
    </label>

    <div ref="inputRef" class="relative">
      <input
        type="text"
        class="w-full border-none pl-4 pr-16 rounded-lg bg-dark-800 h-10 text-sm text-white focus:outline-none box-border"
        :placeholder="placeholder"
        :value="modelValue ? modelValue[displayKey] : ''"
        @input="handleSearch"
        @focus="isOpen = true"
      >

      <div class="absolute inset-y-0 right-0 flex items-center gap-1">
        <button
          v-if="modelValue"
          class="flex items-center px-1 border-0 bg-transparent text-gray-400 hover:text-white transition-colors"
          type="button"
          @click="handleClear"
        >
          <div i-mdi-close class="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          class="flex items-center pr-2 border-0 bg-transparent"
          type="button"
          @click="toggleDropdown"
        >
          <div
            i-mdi-chevron-down
            class="h-5 w-5 text-gray-400 transition-all duration-200"
            :class="{ 'rotate-180': isOpen }"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <Transition name="fade">
      <ul
        v-if="isOpen"
        class="absolute z-10 mt-1 p-0 max-h-60 w-[100%] left-0 right-0 overflow-auto rounded-md bg-dark-500 text-sm shadow-lg ring-1 ring-black/5 list-none"
      >
        <li
          v-if="filteredItems.length === 0"
          class="px-4 py-2 text-gray-400"
        >
          Nothing found.
        </li>

        <li
          v-for="item in filteredItems"
          :key="item.value"
          class="relative cursor-pointer select-none py-2.5 pl-10 pr-4 hover:bg-white hover:text-dark-900 transition-all duration-200"
          :class="{
            'bg-white text-dark-900': modelValue?.value === item.value,
            'text-white': modelValue?.value !== item.value,
          }"
          @click="handleSelect(item)"
        >
          <span class="block truncate" :class="{ 'font-medium': modelValue?.value === item.value }">
            {{ item[displayKey] }}
          </span>

          <span
            v-if="modelValue?.value === item.value"
            class="absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <div i-mdi-check class="h-4 w-4" aria-hidden="true" />
          </span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
