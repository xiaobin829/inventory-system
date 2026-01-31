<template>
  <div class="category-tree">
    <div class="tree-header">
      <span class="tree-title">物料分类</span>
    </div>
    <div class="tree-content">
      <t-tree
        v-if="treeData.length > 0"
        :data="treeData"
        :keys="treeKeys"
        :expand-all="true"
        :active-multiple="false"
        hover
        @active="handleActive"
      >
        <template #label="{ node }">
          <div class="tree-node-label">
            <span class="node-name">{{ node.data.name }}</span>
            <span class="node-count">({{ getNodeCount(node.data.id) }})</span>
          </div>
        </template>
      </t-tree>
      <div v-else class="tree-empty">
        <t-loading v-if="loading" />
        <t-empty v-else description="暂无分类数据" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { MaterialCategory } from '@/types/material'
import * as materialApi from '@/api/material'

interface Emits {
  (e: 'change', categoryId: number | undefined): void
}

const emit = defineEmits<Emits>()

const loading = ref(false)
const treeData = ref<MaterialCategory[]>([])
const activeCategoryId = ref<number>()

// Tree 组件配置
const treeKeys = {
  value: 'id',
  label: 'name',
  children: 'children'
}

// 每个分类的数量（这里简化处理，实际应该从API获取）
const categoryCountMap = ref<Record<number, number>>({
  1: 12,
  11: 5,
  12: 4,
  13: 3,
  2: 8,
  21: 3,
  22: 2,
  23: 3,
  3: 6,
  31: 3,
  32: 3
})

// 获取节点数量
const getNodeCount = (categoryId: number) => {
  return categoryCountMap.value[categoryId] || 0
}

// 加载分类树
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await materialApi.getCategoryTree()
    if (response.code === 0) {
      // 在树数据前面添加"全部"节点
      treeData.value = [
        {
          id: 0,
          name: '全部分类',
          code: 'ALL',
          parentId: null
        },
        ...response.data
      ]
    } else {
      MessagePlugin.error(response.message || '加载分类失败')
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    MessagePlugin.error('加载分类失败')
  } finally {
    loading.value = false
  }
}

// 节点点击
const handleActive = (value: Array<string | number>) => {
  if (value.length > 0) {
    const categoryId = Number(value[0])
    activeCategoryId.value = categoryId === 0 ? undefined : categoryId
    emit('change', activeCategoryId.value)
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e7e7e7;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid #e7e7e7;
}

.tree-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.tree-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.tree-node-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.node-name {
  font-size: 14px;
  color: #333;
}

.node-count {
  font-size: 12px;
  color: #999;
}

.tree-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

/* 自定义滚动条样式 */
.tree-content::-webkit-scrollbar {
  width: 6px;
}

.tree-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.tree-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.tree-content::-webkit-scrollbar-track {
  background: transparent;
}
</style>
