<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToiletStore } from '@/stores/toiletStore'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'
import { ArrowLeft, Calendar, TrendingUp, Droplets, BarChart3 } from 'lucide-vue-next'
import type { StoolType } from '@/types'

const router = useRouter()
const toiletStore = useToiletStore()

const currentMonthRecords = computed(() => toiletStore.getCurrentMonthRecords())

const getStoolTypeLabel = (type: StoolType) => {
  const option = toiletStore.stoolTypeOptions.find(o => o.value === type)
  return option?.label || type
}

const stoolTypeDistribution = computed(() => {
  const distribution: Record<StoolType, number> = {
    type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, type6: 0, type7: 0
  }
  
  currentMonthRecords.value.forEach(record => {
    distribution[record.type]++
  })
  
  return distribution
})

const mostCommonType = computed(() => {
  let maxCount = 0
  let mostCommon: StoolType | null = null
  
  for (const [type, count] of Object.entries(stoolTypeDistribution.value)) {
    if (count > maxCount) {
      maxCount = count
      mostCommon = type as StoolType
    }
  }
  
  return mostCommon
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background p-4 pb-24">
    <header class="mb-6">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="icon" @click="goHome">
          <ArrowLeft class="w-5 h-5" />
        </Button>
        <h1 class="text-2xl font-bold text-foreground">统计数据</h1>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <Card class="p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Calendar class="w-5 h-5 text-primary" />
          </div>
        </div>
        <div class="text-3xl font-bold text-foreground mb-1">
          {{ toiletStore.getMonthlyCount }}
        </div>
        <div class="text-sm text-muted-foreground">本月记录</div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-primary/10 rounded-lg">
            <TrendingUp class="w-5 h-5 text-primary" />
          </div>
        </div>
        <div class="text-3xl font-bold text-foreground mb-1">
          {{ toiletStore.getAverageFrequency.toFixed(1) }}
        </div>
        <div class="text-sm text-muted-foreground">日均次数</div>
      </Card>
    </div>

    <Card class="p-4 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Droplets class="w-5 h-5 text-primary" />
        </div>
        <h2 class="text-lg font-semibold">最常见性状</h2>
      </div>
      <div v-if="mostCommonType" class="text-center">
        <span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-lg font-medium">
          {{ getStoolTypeLabel(mostCommonType) }}
        </span>
        <p class="text-sm text-muted-foreground mt-2">
          {{ stoolTypeDistribution[mostCommonType] }} 次
        </p>
      </div>
      <div v-else class="text-center text-muted-foreground">
        暂无数据
      </div>
    </Card>

    <Card class="p-4">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 bg-primary/10 rounded-lg">
          <BarChart3 class="w-5 h-5 text-primary" />
        </div>
        <h2 class="text-lg font-semibold">性状分布</h2>
      </div>
      <div v-if="currentMonthRecords.length > 0" class="space-y-3">
        <div
          v-for="option in toiletStore.stoolTypeOptions"
          :key="option.value"
          class="flex items-center gap-3"
        >
          <div class="w-24 text-sm font-medium text-muted-foreground">
            {{ option.label }}
          </div>
          <div class="flex-1 bg-secondary rounded-full h-6 overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-500"
              :style="{
                width: currentMonthRecords.length > 0
                  ? `${(stoolTypeDistribution[option.value] / currentMonthRecords.length) * 100}%`
                  : '0%'
              }"
            />
          </div>
          <div class="w-8 text-right text-sm font-medium">
            {{ stoolTypeDistribution[option.value] }}
          </div>
        </div>
      </div>
      <div v-else class="text-center text-muted-foreground py-8">
        本月暂无记录
      </div>
    </Card>

    <div class="fixed bottom-6 right-6">
      <Button
        class="w-14 h-14 rounded-full shadow-lg"
        @click="goHome"
      >
        <ArrowLeft class="w-6 h-6" />
      </Button>
    </div>
  </div>
</template>
