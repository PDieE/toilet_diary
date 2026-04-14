<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  open?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const close = () => {
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-50">
        <div class="fixed inset-0 bg-black/50" @click="close" />
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <Transition name="scale">
            <div
              v-if="open"
              :class="cn('relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg', props.class)"
              @click.stop
            >
              <slot />
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
}
</style>
