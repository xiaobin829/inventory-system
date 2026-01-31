<template>
  <div class="material-page">
    <div class="page-container">
      <!-- 左侧分类树 -->
      <div class="left-sidebar">
        <CategoryTree @change="handleCategoryChange" />
      </div>

      <!-- 右侧内容区 -->
      <div class="right-content">
        <!-- 页面标题和操作按钮 -->
        <div class="page-header">
          <h2 class="page-title">原材料管理</h2>
          <t-space>
            <t-button theme="default" variant="outline" @click="handleImport">
              <template #icon><t-icon name="upload" /></template>
              导入Excel
            </t-button>
            <t-button theme="primary" @click="handleCreate">
              <template #icon><t-icon name="add" /></template>
              新建原材料
            </t-button>
          </t-space>
        </div>

        <!-- 筛选区域 -->
        <div class="filter-section">
          <div class="filter-row">
            <t-input
              v-model="queryParams.keyword"
              placeholder="搜索物料名称或编码"
              clearable
              style="width: 280px;"
              @enter="loadData"
              @clear="loadData"
            >
              <template #suffix-icon>
                <t-icon name="search" @click="loadData" style="cursor: pointer;" />
              </template>
            </t-input>

            <t-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              style="width: 120px;"
              @change="loadData"
            >
              <t-option :value="true" label="启用" />
              <t-option :value="false" label="禁用" />
            </t-select>
          </div>
        </div>

        <!-- 批量操作栏 -->
        <div v-if="selectedRowKeys.length > 0" class="batch-action-bar">
          <span class="selected-info">已选 {{ selectedRowKeys.length }} 项</span>
          <t-space>
            <t-button theme="danger" variant="outline" @click="handleBatchDelete">
              批量删除
            </t-button>
            <t-button variant="outline" @click="clearSelection">
              取消选择
            </t-button>
          </t-space>
        </div>

        <!-- 数据表格 -->
        <div class="table-section">
          <t-table
            :data="tableData"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            :selected-row-keys="selectedRowKeys"
            row-key="id"
            @page-change="handlePageChange"
            @select-change="handleSelectionChange"
          >
            <!-- 物料列 -->
            <template #material="{ row }">
              <div class="material-cell">
                <div class="material-name">{{ row.name }}</div>
                <div class="material-code">{{ row.code }}</div>
              </div>
            </template>

            <!-- 价格列 -->
            <template #price="{ row }">
              <div class="price-cell">
                <div v-if="row.purchasePrice" class="price-item">
                  <span class="price-label">采购：</span>
                  <span class="price-value">¥{{ row.purchasePrice }}</span>
                </div>
                <div v-if="row.salePrice" class="price-item">
                  <span class="price-label">销售：</span>
                  <span class="price-value">¥{{ row.salePrice }}</span>
                </div>
              </div>
            </template>

            <!-- 库存列 -->
            <template #stock="{ row }">
              <div class="stock-cell">
                <div v-if="row.minStock !== undefined" class="stock-item">
                  <span class="stock-label">最低：</span>
                  <span class="stock-value">{{ row.minStock }}</span>
                </div>
                <div v-if="row.maxStock !== undefined" class="stock-item">
                  <span class="stock-label">最高：</span>
                  <span class="stock-value">{{ row.maxStock }}</span>
                </div>
              </div>
            </template>

            <!-- 状态列 -->
            <template #status="{ row }">
              <t-tag :theme="row.status ? 'success' : 'default'">
                {{ row.status ? '启用' : '禁用' }}
              </t-tag>
            </template>

            <!-- 操作列 -->
            <template #action="{ row }">
              <t-space>
                <t-link theme="primary" @click="handleToggleStatus(row)">
                  {{ row.status ? '禁用' : '启用' }}
                </t-link>
                <t-divider layout="vertical" />
                <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
                <t-divider layout="vertical" />
                <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
              </t-space>
            </template>
          </t-table>
        </div>
      </div>
    </div>

    <!-- 新建/编辑原材料弹窗 -->
    <MaterialFormDialog
      v-model:visible="formDialogVisible"
      :edit-data="currentMaterial"
      @success="handleFormSuccess"
    />

    <!-- 导入Excel弹窗 -->
    <ImportDialog
      v-model:visible="importDialogVisible"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import type { Material, MaterialQuery } from '@/types/material'
import type { PaginationProps } from 'tdesign-vue-next'
import CategoryTree from './components/CategoryTree.vue'
import MaterialFormDialog from './components/MaterialFormDialog.vue'
import ImportDialog from './components/ImportDialog.vue'
import * as materialApi from '@/api/material'

// 筛选参数
const queryParams = reactive<MaterialQuery>({
  categoryId: undefined,
  keyword: '',
  status: undefined,
  page: 1,
  pageSize: 20
})

// 表格数据
const tableData = ref<Material[]>([])
const loading = ref(false)
const selectedRowKeys = ref<number[]>([])

// 分页配置
const pagination = reactive<PaginationProps>({
  current: 1,
  pageSize: 20,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [20, 50, 100, 200],
  totalContent: '共 {total} 条数据'
})

// 表格列配置
const columns: any[] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50
  },
  {
    colKey: 'material',
    title: '物料',
    width: 200
  },
  {
    colKey: 'categoryName',
    title: '分类',
    width: 120
  },
  {
    colKey: 'spec',
    title: '规格',
    width: 150
  },
  {
    colKey: 'unit',
    title: '单位',
    width: 80
  },
  {
    colKey: 'price',
    title: '价格',
    width: 150
  },
  {
    colKey: 'stock',
    title: '库存设置',
    width: 150
  },
  {
    colKey: 'status',
    title: '状态',
    width: 100
  },
  {
    colKey: 'action',
    title: '操作',
    width: 200
  }
]

// 弹窗状态
const formDialogVisible = ref(false)
const importDialogVisible = ref(false)
const currentMaterial = ref<Material | null>(null)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await materialApi.getMaterialList(queryParams)
    if (response.code === 0) {
      tableData.value = response.data.list
      pagination.total = response.data.total
    } else {
      MessagePlugin.error(response.message || '加载数据失败')
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    MessagePlugin.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 分类切换
const handleCategoryChange = (categoryId: number | undefined) => {
  queryParams.categoryId = categoryId
  queryParams.page = 1
  pagination.current = 1
  loadData()
}

// 分页变化
const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  queryParams.page = pageInfo.current
  queryParams.pageSize = pageInfo.pageSize
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  loadData()
}

// 选择变化
const handleSelectionChange = (value: number[]) => {
  selectedRowKeys.value = value
}

// 清空选择
const clearSelection = () => {
  selectedRowKeys.value = []
}

// 新建原材料
const handleCreate = () => {
  currentMaterial.value = null
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: Material) => {
  currentMaterial.value = row
  formDialogVisible.value = true
}

// 删除
const handleDelete = (row: Material) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '删除确认',
    body: `确定要删除原材料 "${row.name}" 吗？删除后数据将无法恢复！`,
    confirmBtn: {
      content: '确认删除',
      theme: 'danger'
    },
    onConfirm: async () => {
      try {
        const response = await materialApi.deleteMaterial(row.id)
        if (response.code === 0) {
          MessagePlugin.success('删除成功')
          loadData()
          confirmDialog.destroy()
        } else {
          MessagePlugin.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        MessagePlugin.error('删除失败')
      }
    }
  })
}

// 批量删除
const handleBatchDelete = () => {
  const confirmDialog = DialogPlugin.confirm({
    header: '批量删除确认',
    body: `确定要删除选中的 ${selectedRowKeys.value.length} 条原材料吗？删除后数据将无法恢复！`,
    confirmBtn: {
      content: '确认删除',
      theme: 'danger'
    },
    onConfirm: async () => {
      try {
        const response = await materialApi.batchDeleteMaterials(selectedRowKeys.value)
        if (response.code === 0) {
          MessagePlugin.success('删除成功')
          clearSelection()
          loadData()
          confirmDialog.destroy()
        } else {
          MessagePlugin.error(response.message || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        MessagePlugin.error('删除失败')
      }
    }
  })
}

// 切换状态
const handleToggleStatus = async (row: Material) => {
  try {
    const newStatus = !row.status
    const response = await materialApi.toggleMaterialStatus(row.id, newStatus)
    if (response.code === 0) {
      MessagePlugin.success(`${newStatus ? '启用' : '禁用'}成功`)
      loadData()
    } else {
      MessagePlugin.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    MessagePlugin.error('操作失败')
  }
}

// 导入
const handleImport = () => {
  importDialogVisible.value = true
}

// 表单提交成功
const handleFormSuccess = () => {
  loadData()
}

// 导入成功
const handleImportSuccess = () => {
  loadData()
}

// 挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.material-page {
  width: 100%;
  height: 100%;
}

.page-container {
  display: flex;
  gap: 16px;
  height: 100%;
}

.left-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #000;
}

.filter-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 6px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.batch-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: #e7f3ff;
  border-radius: 6px;
  border: 1px solid #b3d8ff;
}

.selected-info {
  font-size: 14px;
  color: #0052d9;
  font-weight: 500;
}

.table-section {
  flex: 1;
  overflow: hidden;
}

.material-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.material-name {
  font-weight: 500;
  color: #000;
}

.material-code {
  font-size: 12px;
  color: #999;
}

.price-cell,
.stock-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-item,
.stock-item {
  font-size: 13px;
}

.price-label,
.stock-label {
  color: #999;
  margin-right: 4px;
}

.price-value,
.stock-value {
  color: #333;
  font-weight: 500;
}
</style>
