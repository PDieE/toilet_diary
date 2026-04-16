<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToiletStore } from '@/stores/toiletStore'
import Calendar from '@/components/Calendar.vue'
import Empty from '@/components/Empty.vue'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import Dialog from '@/components/ui/dialog.vue'
import Input from '@/components/ui/input.vue'
import { Plus, Trash2, Activity, Clock, Edit3 } from 'lucide-vue-next'
import type { ToiletRecord, StoolType } from '@/types'

const router = useRouter()
const toiletStore = useToiletStore()
const calendarRef = ref<InstanceType<typeof Calendar>>()

const isDialogOpen = ref(false)
const isEditing = ref(false)
const editingRecordId = ref<string | null>(null)
const selectedDateStr = ref('')
const selectedTime = ref('')
const selectedType = ref<StoolType>('type4')
const description = ref('')

const records = computed(() => {
  if (!selectedDateStr.value) return []
  return toiletStore.getRecordsByDate(selectedDateStr.value)
})

const getStoolTypeLabel = (type: StoolType) => {
  const option = toiletStore.stoolTypeOptions.find(o => o.value === type)
  return option?.label || type
}

const getStoolTypeDescription = (type: StoolType) => {
  const option = toiletStore.stoolTypeOptions.find(o => o.value === type)
  return option?.description || ''
}

const openAddDialog = () => {
  isEditing.value = false
  editingRecordId.value = null
  resetForm()
  if (selectedDateStr.value) {
    const now = new Date()
    selectedTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }
  isDialogOpen.value = true
}

const openEditDialog = (record: ToiletRecord) => {
  isEditing.value = true
  editingRecordId.value = record.id
  selectedDateStr.value = record.date
  selectedTime.value = record.time
  selectedType.value = record.type
  description.value = record.description
  isDialogOpen.value = true
}

const resetForm = () => {
  if (calendarRef.value) {
    selectedDateStr.value = calendarRef.value.formatDate(calendarRef.value.selectedDate)
  }
  selectedTime.value = ''
  selectedType.value = 'type4'
  description.value = ''
}

const saveRecord = () => {
  if (!selectedDateStr.value || !selectedTime.value) return

  if (isEditing.value && editingRecordId.value) {
    toiletStore.deleteRecord(editingRecordId.value)
  }

  toiletStore.addRecord({
    date: selectedDateStr.value,
    time: selectedTime.value,
    type: selectedType.value,
    description: description.value,
  })

  isDialogOpen.value = false
  resetForm()
}

const deleteRecord = (id: string) => {
  toiletStore.deleteRecord(id)
}

const goToStats = () => {
  router.push('/stats')
}

watch(() => calendarRef.value?.selectedDate, (newDate) => {
  if (newDate) {
    selectedDateStr.value = calendarRef.value!.formatDate(newDate)
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-background p-4 pb-24 max-w-[500px] mx-auto">
    <header class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-foreground">如厕日记</h1>
        <Button variant="ghost" size="icon" @click="goToStats">
          <Activity class="w-5 h-5" />
        </Button>
      </div>
    </header>

    <Card class="p-4 mb-6">
      <Calendar ref="calendarRef" />
    </Card>

    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-3">
        {{ selectedDateStr || '选择日期' }} 的记录
      </h2>
      <div v-if="records.length > 0" class="space-y-3">
        <Card v-for="record in records" :key="record.id" class="p-4">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Clock class="w-4 h-4 text-muted-foreground" />
                <span class="text-sm font-medium">{{ record.time }}</span>
              </div>
              <div class="mb-2">
                <span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {{ getStoolTypeLabel(record.type) }}
                </span>
              </div>
              <p v-if="record.description" class="text-sm text-muted-foreground">
                {{ record.description }}
              </p>
            </div>
            <div class="flex gap-2 ml-4">
              <Button variant="ghost" size="icon" @click="openEditDialog(record)">
                <Edit3 class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="deleteRecord(record.id)">
                <Trash2 class="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <div v-else>
        <Empty />
      </div>
    </div>

    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">{{ isEditing ? '编辑记录' : '添加记录' }}</h3>
        
        <div>
          <label class="block text-sm font-medium mb-1">日期</label>
          <Input
            type="date"
            v-model="selectedDateStr"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">时间</label>
          <Input
            type="time"
            v-model="selectedTime"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">性状</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in toiletStore.stoolTypeOptions"
              :key="option.value"
              @click="selectedType = option.value"
              :class="[
                'p-3 rounded-lg border text-sm transition-all',
                selectedType === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input hover:border-primary/50'
              ]"
            >
              <div class="font-medium">{{ option.label }}</div>
              <div class="text-xs text-muted-foreground">{{ option.description }}</div>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">描述（可选）</label>
          <Input
            type="text"
            v-model="description"
            placeholder="添加一些描述..."
          />
        </div>

        <div class="flex gap-3 pt-2">
          <Button variant="outline" class="flex-1" @click="isDialogOpen = false">
            取消
          </Button>
          <Button class="flex-1" @click="saveRecord">
            {{ isEditing ? '更新' : '保存' }}
          </Button>
        </div>
      </div>
    </Dialog>

    <div class="fixed bottom-6 right-6">
      <Button
        class="w-14 h-14 rounded-full shadow-lg"
        @click="openAddDialog"
      >
        <Plus class="w-6 h-6" />
      </Button>
    </div>
  </div>
</template>
