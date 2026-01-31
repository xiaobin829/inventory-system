<template>
  <div class="warehouse-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2 class="page-title">仓库管理</h2>
      <t-button theme="primary" @click="handleCreate">
        <template #icon><t-icon name="add" /></template>
        新建仓库
      </t-button>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <div class="filter-label">类型</div>
          <div class="filter-buttons">
            <t-button
              v-for="item in typeOptions"
              :key="item.value || 'all'"
              :variant="queryParams.type === item.value ? 'primary' : 'outline'"
              size="small"
              @click="handleTypeChange(item.value)"
            >
              {{ item.label }}
            </t-button>
          </div>
        </div>
        
        <div class="filter-item">
          <t-input
            v-model="queryParams.keyword"
            placeholder="搜索仓库名称或编码"
            clearable
            style="width: 280px;"
            @enter="loadData"
            @clear="loadData"
          >
            <template #suffix-icon>
              <t-icon name="search" @click="loadData" style="cursor: pointer;" />
            </template>
          </t-input>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @page-change="handlePageChange"
      >
        <!-- 仓库列 -->
        <template #warehouse="{ row }">
          <div class="warehouse-cell">
            <div class="warehouse-name">{{ row.name }}</div>
            <div class="warehouse-code">{{ row.code }}</div>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <t-tag :theme="row.status ? 'success' : 'default'">
            {{ row.status ? '启用' : '禁用' }}
          </t-tag>
        </template>

        <!-- 期初状态列 -->
        <template #openingStatus="{ row }">
          <t-tag :theme="row.openingStatus === 'confirmed' ? 'success' : 'warning'">
            {{ row.openingStatus === 'confirmed' ? '已确认' : '未确认' }}
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
            <t-divider layout="vertical" />
            <t-link theme="primary" @click="handleOpeningInit(row)">期初</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 新建/编辑仓库弹窗 -->
    <WarehouseFormDialog
      v-model:visible="formDialogVisible"
      :edit-data="currentWarehouse"
      @success="handleFormSuccess"
    />

    <!-- 删除确认对话框 -->
    <DeleteConfirmDialog
      v-model:visible="deleteDialogVisible"
      :warehouse="currentWarehouse"
      @success="handleDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { Warehouse, WarehouseQuery, WarehouseType } from '@/types/warehouse'
import type { PaginationProps, TableColumnController } from 'tdesign-vue-next'
import WarehouseFormDialog from './components/WarehouseFormDialog.vue'
import DeleteConfirmDialog from './components/DeleteConfirmDialog.vue'
import * as warehouseApi from '@/api/warehouse'

// 筛选参数
const queryParams = reactive<WarehouseQuery>({
  type: undefined,
  keyword: '',
  page: 1,
  pageSize: 10
})

// 类型选项
const typeOptions = [
  { label: '全部', value: undefined },
  { label: '配送中心仓库', value: 'distribution' as WarehouseType },
  { label: '门店仓库', value: 'store' as WarehouseType }
]

// 表格数据
const tableData = ref<Warehouse[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive<PaginationProps>({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50, 100],
  totalContent: '共 {total} 条数据'
})

// 表格列配置
const columns: TableColumnController<Warehouse>[] = [
  {
    colKey: 'warehouse',
    title: '仓库',
    width: 200,
    cell: 'warehouse'
  },
  {
    colKey: 'type',
    title: '类型',
    width: 150,
    cell: (h, { row }) => {
      return row.type === 'distribution' ? '配送中心仓库' : '门店仓库'
    }
  },
  {
    colKey: 'contact',
    title: '联系人',
    width: 120
  },
  {
    colKey: 'phone',
    title: '联系方式',
    width: 150
  },
  {
    colKey: 'address',
    title: '地址',
    minWidth: 200
  },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cell: 'status'
  },
  {
    colKey: 'openingStatus',
    title: '期初状态',
    width: 120,
    cell: 'openingStatus'
  },
  {
    colKey: 'action',
    title: '操作',
    width: 240,
    fixed: 'right',
    cell: 'action'
  }
]

// 弹窗状态
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentWarehouse = ref<Warehouse | null>(null)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await warehouseApi.getWarehouseList(queryParams)
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

// 类型切换
const handleTypeChange = (type: WarehouseType | undefined) => {
  queryParams.type = type
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

// 新建仓库
const handleCreate = () => {
  currentWarehouse.value = null
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: Warehouse) => {
  currentWarehouse.value = row
  formDialogVisible.value = true
}

// 删除
const handleDelete = (row: Warehouse) => {
  currentWarehouse.value = row
  deleteDialogVisible.value = true
}

// 切换状态
const handleToggleStatus = async (row: Warehouse) => {
  try {
    const newStatus = !row.status
    const response = await warehouseApi.toggleWarehouseStatus(row.id, newStatus)
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

// 期初设置
const handleOpeningInit = (row: Warehouse) => {
  MessagePlugin.info(`设置期初: ${row.name}（功能开发中）`)
  // TODO: 跳转到期初设置页面
}

// 表单提交成功
const handleFormSuccess = () => {
  loadData()
}

// 删除成功
const handleDeleteSuccess = () => {
  loadData()
}

// 挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.warehouse-page {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #000;
}

.filter-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 6px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-weight: 500;
  color: #666;
  white-space: nowrap;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.table-section {
  margin-top: 16px;
}

.warehouse-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.warehouse-name {
  font-weight: 500;
  color: #000;
}

.warehouse-code {
  font-size: 12px;
  color: #999;
}
</style>
