<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToiletStore } from '@/stores/toiletStore'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const toiletStore = useToiletStore()

const currentDate = new Date()
const selectedDate = ref(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
const currentMonth = ref(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
]

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const formatDate = function(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const calendarDays = computed(function() {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: Date[] = []
  
  const startDay = firstDay.getDay()
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push(d)
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
})

const isToday = function(date: Date) {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

const isCurrentMonth = function(date: Date) {
  return date.getMonth() === currentMonth.value.getMonth() &&
         date.getFullYear() === currentMonth.value.getFullYear()
}

const isSelected = function(date: Date) {
  return date.getDate() === selectedDate.value.getDate() &&
         date.getMonth() === selectedDate.value.getMonth() &&
         date.getFullYear() === selectedDate.value.getFullYear()
}

const getRecordCount = function(date: Date) {
  return toiletStore.getRecordCountByDate(formatDate(date))
}

const selectDate = function(date: Date) {
  selectedDate.value = date
}

const prevMonth = function() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

const nextMonth = function() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}

defineExpose({
  selectedDate,
  formatDate,
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-4">
      <button
        @click="prevMonth"
        class="p-2 rounded-full hover:bg-accent transition-colors"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <h2 class="text-xl font-semibold">
        {{ currentMonth.getFullYear() }}年 {{ monthNames[currentMonth.getMonth()] }}
      </h2>
      <button
        @click="nextMonth"
        class="p-2 rounded-full hover:bg-accent transition-colors"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
    
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-sm font-medium text-muted-foreground py-2"
      >
        {{ day }}
      </div>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="(date, index) in calendarDays"
        :key="index"
        @click="selectDate(date)"
        :class="[
          'aspect-square flex flex-col items-center justify-center rounded-lg transition-all relative',
          !isCurrentMonth(date) && 'text-muted-foreground opacity-40',
          isSelected(date) && 'bg-primary/20',
          !isSelected(date) && 'hover:bg-accent',
        ]"
      >
        <span
          :class="[
            'text-sm font-medium',
            isToday(date) && 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center',
          ]"
        >
          {{ date.getDate() }}
        </span>
        <div v-if="getRecordCount(date) > 0" class="absolute bottom-1">
          <div class="flex gap-0.5">
            <div
              v-for="i in Math.min(getRecordCount(date), 3)"
              :key="i"
              class="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
