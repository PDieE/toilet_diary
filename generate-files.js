const fs = require('fs');
const path = require('path');

const homeContent = `&lt;script setup lang="ts"&gt;
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToiletStore } from '@/stores/toiletStore'
import Calendar from '@/components/Calendar.vue'
import Card from '@/components/ui/card.vue'
import Button from '@/components/ui/button.vue'
import Dialog from '@/components/ui/dialog.vue'
import Input from '@/components/ui/input.vue'
import { Plus, Trash2, Activity } from 'lucide-vue-next'
import type { StoolType } from '@/types'

const router = useRouter()
const toiletStore = useToiletStore()

const calendarRef = ref&lt;InstanceType&lt;typeof Calendar&gt;&gt;()
const isDialogOpen = ref(false)
const selectedType = ref&lt;StoolType&gt;('type4')
const description = ref('')
const timeValue = ref('')

const selectedDateFormatted = computed(() =&gt; {
  if (calendarRef.value?.selectedDate) {
    return calendarRef.value.formatDate(calendarRef.value.selectedDate)
  }
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return \`\${year}-\${month}-\${day}\`
})

const recordsForSelectedDate = computed(() =&gt; {
  return toiletStore.getRecordsByDate(selectedDateFormatted.value)
})

const getStoolTypeLabel = (type: StoolType) =&gt; {
  const option = toiletStore.stoolTypeOptions.find(o =&gt; o.value === type)
  return option?.label || type
}

const openDialog = () =&gt; {
  const now = new Date()
  timeValue.value = \`\${String(now.getHours()).padStart(2, '0')}:\${String(now.getMinutes()).padStart(2, '0')}\`
  selectedType.value = 'type4'
  description.value = ''
  isDialogOpen.value = true
}

const saveRecord = () =&gt; {
  if (!timeValue.value) return
  
  toiletStore.addRecord({
    date: selectedDateFormatted.value,
    time: timeValue.value,
    type: selectedType.value,
    description: description.value,
  })
  
  isDialogOpen.value = false
}

const deleteRecord = (id: string) =&gt; {
  toiletStore.deleteRecord(id)
}
&lt;/script&gt;

&lt;template&gt;
  &lt;div class="min-h-screen pb-24"&gt;
    &lt;header class="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-4 py-4"&gt;
      &lt;h1 class="text-2xl font-bold text-center"&gt;如厕日记&lt;/h1&gt;
    &lt;/header&gt;
    
    &lt;main class="p-4"&gt;
      &lt;section class="mb-6"&gt;
        &lt;Calendar ref="calendarRef" /&gt;
      &lt;/section&gt;
      
      &lt;section&gt;
        &lt;h2 class="text-lg font-semibold mb-4"&gt;
          {{ selectedDateFormatted }} 的记录
        &lt;/h2&gt;
        
        &lt;div v-if="recordsForSelectedDate.length &gt; 0" class="space-y-3"&gt;
          &lt;Card v-for="record in recordsForSelectedDate" :key="record.id" class="p-4"&gt;
            &lt;div class="flex items-start justify-between"&gt;
              &lt;div class="flex-1"&gt;
                &lt;div class="flex items-center gap-3 mb-2"&gt;
                  &lt;span class="text-lg font-semibold"&gt;{{ record.time }}&lt;/span&gt;
                  &lt;span class="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"&gt;
                    {{ getStoolTypeLabel(record.type) }}
                  &lt;/span&gt;
                &lt;/div&gt;
                &lt;p v-if="record.description" class="text-muted-foreground text-sm"&gt;
                  {{ record.description }}
                &lt;/p&gt;
              &lt;/div&gt;
              &lt;button
                @click="deleteRecord(record.id)"
                class="p-2 text-muted-foreground hover:text-destructive transition-colors"
              &gt;
                &lt;Trash2 class="w-5 h-5" /&gt;
              &lt;/button&gt;
            &lt;/div&gt;
          &lt;/Card&gt;
        &lt;/div&gt;
        
        &lt;div v-else class="text-center py-12 text-muted-foreground"&gt;
          &lt;p&gt;暂无记录&lt;/p&gt;
          &lt;p class="text-sm mt-1"&gt;点击下方按钮添加记录&lt;/p&gt;
        &lt;/div&gt;
      &lt;/section&gt;
    &lt;/main&gt;
    
    &lt;div class="fixed bottom-6 right-6 flex flex-col gap-3"&gt;
      &lt;button
        @click="router.push('/stats')"
        class="w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-secondary/80 transition-all"
      &gt;
        &lt;Activity class="w-6 h-6" /&gt;
      &lt;/button&gt;
      &lt;button
        @click="openDialog"
        class="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
      &gt;
        &lt;Plus class="w-6 h-6" /&gt;
      &lt;/button&gt;
    &lt;/div&gt;
    
    &lt;Dialog v-model:open="isDialogOpen"&gt;
      &lt;div class="space-y-6"&gt;
        &lt;h3 class="text-xl font-semibold"&gt;添加如厕记录&lt;/h3&gt;
        
        &lt;div class="space-y-4"&gt;
          &lt;div&gt;
            &lt;label class="block text-sm font-medium mb-2"&gt;日期&lt;/label&gt;
            &lt;div class="p-3 bg-muted rounded-lg"&gt;
              {{ selectedDateFormatted }}
            &lt;/div&gt;
          &lt;/div&gt;
          
          &lt;div&gt;
            &lt;label class="block text-sm font-medium mb-2"&gt;时间&lt;/label&gt;
            &lt;Input v-model="timeValue" type="time" /&gt;
          &lt;/div&gt;
          
          &lt;div&gt;
            &lt;label class="block text-sm font-medium mb-2"&gt;性状&lt;/label&gt;
            &lt;div class="grid grid-cols-2 gap-2"&gt;
              &lt;button
                v-for="option in toiletStore.stoolTypeOptions"
                :key="option.value"
                @click="selectedType = option.value"
                :class="[
                  'p-3 rounded-lg border text-sm transition-all',
                  selectedType === option.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-accent'
                ]"
              &gt;
                &lt;div class="font-medium"&gt;{{ option.label }}&lt;/div&gt;
                &lt;div class="text-xs opacity-70"&gt;{{ option.description }}&lt;/div&gt;
              &lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          
          &lt;div&gt;
            &lt;label class="block text-sm font-medium mb-2"&gt;描述（可选）&lt;/label&gt;
            &lt;textarea
              v-model="description"
              class="w-full p-3 border rounded-lg bg-background min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="添加一些备注..."
            /&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        
        &lt;div class="flex gap-3"&gt;
          &lt;Button @click="isDialogOpen = false" variant="outline" class="flex-1"&gt;
            取消
          &lt;/Button&gt;
          &lt;Button @click="saveRecord" class="flex-1"&gt;
            保存
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/Dialog&gt;
  &lt;/div&gt;
&lt;/template&gt;`;

const statsContent = `&lt;script setup lang="ts"&gt;
import { useRouter } from 'vue-router'
import { useToiletStore } from '@/stores/toiletStore'
import Card from '@/components/ui/card.vue'
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-vue-next'

const router = useRouter()
const toiletStore = useToiletStore()
&lt;/script&gt;

&lt;template&gt;
  &lt;div class="min-h-screen"&gt;
    &lt;header class="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-4 py-4"&gt;
      &lt;div class="flex items-center gap-3"&gt;
        &lt;button
          @click="router.push('/')"
          class="p-2 rounded-full hover:bg-accent transition-colors"
        &gt;
          &lt;ArrowLeft class="w-5 h-5" /&gt;
        &lt;/button&gt;
        &lt;h1 class="text-2xl font-bold"&gt;统计数据&lt;/h1&gt;
      &lt;/div&gt;
    &lt;/header&gt;
    
    &lt;main class="p-4"&gt;
      &lt;div class="grid grid-cols-1 md:grid-cols-2 gap-4"&gt;
        &lt;Card class="p-6"&gt;
          &lt;div class="flex items-center gap-3 mb-4"&gt;
            &lt;div class="p-3 bg-primary/10 rounded-full"&gt;
              &lt;Calendar class="w-6 h-6 text-primary" /&gt;
            &lt;/div&gt;
            &lt;h2 class="text-lg font-semibold"&gt;本月如厕次数&lt;/h2&gt;
          &lt;/div&gt;
          &lt;div class="text-4xl font-bold text-primary"&gt;
            {{ toiletStore.getMonthlyCount }}
          &lt;/div&gt;
          &lt;p class="text-muted-foreground text-sm mt-2"&gt;
            从本月初至今
          &lt;/p&gt;
        &lt;/Card&gt;
        
        &lt;Card class="p-6"&gt;
          &lt;div class="flex items-center gap-3 mb-4"&gt;
            &lt;div class="p-3 bg-secondary rounded-full"&gt;
              &lt;TrendingUp class="w-6 h-6 text-secondary-foreground" /&gt;
            &lt;/div&gt;
            &lt;h2 class="text-lg font-semibold"&gt;平均频率&lt;/h2&gt;
          &lt;/div&gt;
          &lt;div class="text-4xl font-bold"&gt;
            {{ toiletStore.getAverageFrequency.toFixed(1) }}
          &lt;/div&gt;
          &lt;p class="text-muted-foreground text-sm mt-2"&gt;
            次/天
          &lt;/p&gt;
        &lt;/Card&gt;
      &lt;/div&gt;
      
      &lt;div class="mt-6"&gt;
        &lt;Card class="p-6"&gt;
          &lt;h2 class="text-lg font-semibold mb-4"&gt;性状分布&lt;/h2&gt;
          &lt;div class="space-y-3"&gt;
            &lt;div
              v-for="option in toiletStore.stoolTypeOptions"
              :key="option.value"
              class="flex items-center justify-between"
            &gt;
              &lt;div class="flex items-center gap-3"&gt;
                &lt;div class="w-3 h-3 rounded-full bg-primary" /&gt;
                &lt;span&gt;{{ option.label }}&lt;/span&gt;
              &lt;/div&gt;
              &lt;span class="text-muted-foreground"&gt;
                {{ toiletStore.records.filter(r =&gt; r.type === option.value).length }} 次
              &lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/Card&gt;
      &lt;/div&gt;
    &lt;/main&gt;
  &lt;/div&gt;
&lt;/template&gt;`;

fs.writeFileSync(path.join(__dirname, 'src/pages/home.vue'), homeContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src/pages/stats.vue'), statsContent, 'utf8');

console.log('Files generated successfully!');
