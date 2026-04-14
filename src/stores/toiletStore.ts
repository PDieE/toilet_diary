import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ToiletRecord, StoolType, StoolTypeOption } from '@/types'

export const useToiletStore = defineStore('toilet', function() {
  const records = ref<ToiletRecord[]>([])

  const stoolTypeOptions: StoolTypeOption[] = [
    { value: 'type1', label: '坚果状', description: '像坚果一样的硬便' },
    { value: 'type2', label: '腊肠状', description: '表面有裂纹的硬便' },
    { value: 'type3', label: '香肠状', description: '表面有裂纹的软便' },
    { value: 'type4', label: '光滑柔软', description: '像香肠或蛇一样，光滑柔软' },
    { value: 'type5', label: '软团状', description: '边缘清晰的软团' },
    { value: 'type6', label: '糊状', description: '糊状便' },
    { value: 'type7', label: '水样', description: '完全水样便' },
  ]

  const addRecord = function(record: Omit<ToiletRecord, 'id' | 'createdAt'>) {
    const newRecord: ToiletRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    records.value.push(newRecord)
  }

  const deleteRecord = function(id: string) {
    const index = records.value.findIndex(function(r) { return r.id === id })
    if (index !== -1) {
      records.value.splice(index, 1)
    }
  }

  const getRecordsByDate = function(date: string) {
    return records.value
      .filter(function(r) { return r.date === date })
      .sort(function(a, b) { return a.time.localeCompare(b.time) })
  }

  const getRecordCountByDate = function(date: string) {
    return records.value.filter(function(r) { return r.date === date }).length
  }

  const getCurrentMonthRecords = function() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    return records.value.filter(function(r) {
      const recordDate = new Date(r.date)
      return recordDate.getFullYear() === year && recordDate.getMonth() === month
    })
  }

  const getMonthlyCount = computed(function() {
    return getCurrentMonthRecords().length
  })

  const getAverageFrequency = computed(function() {
    const monthRecords = getCurrentMonthRecords()
    if (monthRecords.length === 0) return 0
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const today = now.getDate()
    const daysPassed = Math.min(today, daysInMonth)
    return monthRecords.length / daysPassed
  })

  return {
    records,
    stoolTypeOptions,
    addRecord,
    deleteRecord,
    getRecordsByDate,
    getRecordCountByDate,
    getMonthlyCount,
    getAverageFrequency,
  }
}, {
  persist: true,
})
