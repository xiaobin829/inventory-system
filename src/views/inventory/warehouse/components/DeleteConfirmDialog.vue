<template>
  <t-dialog
    v-model:visible="dialogVisible"
    header="删除确认"
    :width="480"
    :confirm-btn="{
      content: '确认删除',
      theme: 'danger',
      loading: deleteLoading
    }"
    :cancel-btn="{ content: '取消' }"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <div class="delete-content">
      <div class="warning-icon">
        <t-icon name="error-circle" size="48px" style="color: #e34d59;" />
      </div>
      <div class="warning-text">
        <p class="main-text">确定要删除仓库 <strong>{{ warehouse?.name }}</strong> 吗？</p>
        <p class="sub-text">仓库编码：{{ warehouse?.code }}</p>
        <p class="tip-text">删除后数据将无法恢复，请谨慎操作！</p>
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { Warehouse } from '@/types/warehouse'
import * as warehouseApi from '@/api/warehouse'

interface Props {
  visible: boolean
  warehouse?: Warehouse | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  warehouse: null
})

const emit = defineEmits<Emits>()

const dialogVisible = ref(false)
const deleteLoading = ref(false)

// 监听弹窗显示状态
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

// 确认删除
const handleConfirm = async () => {
  if (!props.warehouse) return

  deleteLoading.value = true
  try {
    const response = await warehouseApi.deleteWarehouse(props.warehouse.id)
    
    if (response.code === 0) {
      MessagePlugin.success('删除成功')
      emit('success')
      handleClose()
    } else {
      MessagePlugin.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    MessagePlugin.error('删除失败')
  } finally {
    deleteLoading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
.delete-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
}

.warning-icon {
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
}

.main-text {
  font-size: 16px;
  color: #000;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.main-text strong {
  color: #e34d59;
  font-weight: 600;
}

.sub-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
}

.tip-text {
  font-size: 13px;
  color: #ff9800;
  margin: 0;
  padding: 8px 12px;
  background: #fff3e0;
  border-radius: 4px;
  border-left: 3px solid #ff9800;
}
</style>
