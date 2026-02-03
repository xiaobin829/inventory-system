<template>
  <div class="supplier-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2 class="page-title">供货商管理</h2>
      <t-button theme="primary" @click="handleCreate">
        <template #icon><t-icon name="add" /></template>
        新建供货商
      </t-button>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <div class="filter-label">状态</div>
          <div class="filter-buttons">
            <t-button
              v-for="item in statusOptions"
              :key="item.value || 'all'"
              :variant="queryParams.status === item.value ? 'base' : 'outline'"
              :theme="queryParams.status === item.value ? 'primary' : 'default'"
              size="small"
              @click="handleStatusChange(item.value)"
            >
              {{ item.label }}
            </t-button>
          </div>
        </div>

        <div class="filter-item">
          <t-input
            v-model="queryParams.keyword"
            placeholder="搜索供货商名称、编码或联系人"
            clearable
            style="width: 300px;"
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
        <!-- 供货商列 -->
        <template #supplier="{ row }">
          <div class="supplier-cell">
            <div class="supplier-name">{{ row.name }}</div>
            <div class="supplier-code">{{ row.code }}</div>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <t-tag :theme="row.status === 'enabled' ? 'success' : 'default'">
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </t-tag>
        </template>

        <!-- 账期列 -->
        <template #creditDays="{ row }">
          <span>{{ row.creditDays }} 天</span>
        </template>

        <!-- 操作列 -->
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-divider layout="vertical" />
            <t-link theme="primary" @click="handleToggleStatus(row)">
              {{ row.status === 'enabled' ? '禁用' : '启用' }}
            </t-link>
            <t-divider layout="vertical" />
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 新建/编辑供货商弹窗 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="isEdit ? '编辑供货商' : '新建供货商'"
      :width="680"
      :confirm-btn="{ content: '确定', theme: 'primary', loading: submitLoading }"
      :cancel-btn="{ content: '取消' }"
      @confirm="handleFormSubmit"
      @close="handleFormClose"
    >
      <t-tabs v-model="activeTab">
        <t-tab-panel value="basic" label="基本信息">
          <t-form
            ref="basicFormRef"
            :data="formData"
            :rules="formRules"
            label-width="100px"
            class="form-content"
          >
            <t-form-item label="供货商编码" name="code">
              <t-input v-model="formData.code" placeholder="请输入供货商编码" />
            </t-form-item>
            <t-form-item label="供货商名称" name="name">
              <t-input v-model="formData.name" placeholder="请输入供货商名称" />
            </t-form-item>
            <t-form-item label="联系人" name="contact">
              <t-input v-model="formData.contact" placeholder="请输入联系人姓名" />
            </t-form-item>
            <t-form-item label="联系电话" name="phone">
              <t-input v-model="formData.phone" placeholder="请输入联系电话" />
            </t-form-item>
            <t-form-item label="邮箱" name="email">
              <t-input v-model="formData.email" placeholder="请输入邮箱地址" />
            </t-form-item>
          </t-form>
        </t-tab-panel>

        <t-tab-panel value="bank" label="银行信息">
          <t-form
            ref="bankFormRef"
            :data="formData"
            :rules="formRules"
            label-width="100px"
            class="form-content"
          >
            <t-form-item label="开户银行" name="bankName">
              <t-input v-model="formData.bankName" placeholder="请输入开户银行" />
            </t-form-item>
            <t-form-item label="银行账号" name="bankAccount">
              <t-input v-model="formData.bankAccount" placeholder="请输入银行账号" />
            </t-form-item>
            <t-form-item label="税号" name="taxNo">
              <t-input v-model="formData.taxNo" placeholder="请输入税号" />
            </t-form-item>
          </t-form>
        </t-tab-panel>

        <t-tab-panel value="other" label="其他信息">
          <t-form
            ref="otherFormRef"
            :data="formData"
            :rules="formRules"
            label-width="100px"
            class="form-content"
          >
            <t-form-item label="地址" name="address">
              <t-textarea
                v-model="formData.address"
                placeholder="请输入详细地址"
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </t-form-item>
            <t-form-item label="账期" name="creditDays">
              <t-input-number
                v-model="formData.creditDays"
                :min="0"
                :max="365"
                suffix="天"
                placeholder="请输入账期天数"
                style="width: 200px;"
              />
            </t-form-item>
          </t-form>
        </t-tab-panel>
      </t-tabs>
    </t-dialog>

    <!-- 删除确认对话框 -->
    <t-dialog
      v-model:visible="deleteDialogVisible"
      header="删除确认"
      :body="`确定要删除供货商「${currentSupplier?.name}」吗？删除后无法恢复。`"
      :confirm-btn="{ content: '删除', theme: 'danger', loading: deleteLoading }"
      :cancel-btn="{ content: '取消' }"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { Supplier, SupplierQuery, SupplierStatus, SupplierFormData } from '@/types/supplier'
import type { PaginationProps, FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import * as supplierApi from '@/api/supplier'

// 表单ref
const basicFormRef = ref<FormInstanceFunctions | null>(null)
const bankFormRef = ref<FormInstanceFunctions | null>(null)
const otherFormRef = ref<FormInstanceFunctions | null>(null)

// 筛选参数
const queryParams = reactive<SupplierQuery>({
  status: undefined,
  keyword: '',
  page: 1,
  pageSize: 10
})

// 状态选项
const statusOptions = [
  { label: '全部', value: undefined },
  { label: '启用', value: 'enabled' as SupplierStatus },
  { label: '禁用', value: 'disabled' as SupplierStatus }
]

// 表格数据
const tableData = ref<Supplier[]>([])
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
const columns: any[] = [
  {
    colKey: 'supplier',
    title: '供货商',
    width: 220
  },
  {
    colKey: 'contact',
    title: '联系人',
    width: 100
  },
  {
    colKey: 'phone',
    title: '联系电话',
    width: 140
  },
  {
    colKey: 'email',
    title: '邮箱',
    width: 200
  },
  {
    colKey: 'creditDays',
    title: '账期',
    width: 100
  },
  {
    colKey: 'status',
    title: '状态',
    width: 80
  },
  {
    colKey: 'action',
    title: '操作',
    width: 180
  }
]

// 弹窗状态
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentSupplier = ref<Supplier | null>(null)
const isEdit = ref(false)
const submitLoading = ref(false)
const deleteLoading = ref(false)
const activeTab = ref('basic')

// 表单数据
const defaultFormData: SupplierFormData = {
  code: '',
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  bankName: '',
  bankAccount: '',
  taxNo: '',
  creditDays: 30,
  status: 'enabled'
}

const formData = reactive<SupplierFormData>({ ...defaultFormData })

// 表单验证规则
const formRules: Record<string, FormRule[]> = {
  code: [{ required: true, message: '请输入供货商编码' }],
  name: [{ required: true, message: '请输入供货商名称' }],
  contact: [{ required: true, message: '请输入联系人' }],
  phone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ],
  email: [
    { pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/, message: '请输入正确的邮箱地址' }
  ]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const response = await supplierApi.getSuppliers(queryParams)
    tableData.value = response.list
    pagination.total = response.total
  } catch (error) {
    console.error('加载数据失败:', error)
    MessagePlugin.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 状态切换
const handleStatusChange = (status: SupplierStatus | undefined) => {
  queryParams.status = status
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

// 新建供货商
const handleCreate = () => {
  isEdit.value = false
  currentSupplier.value = null
  Object.assign(formData, defaultFormData)
  activeTab.value = 'basic'
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: Supplier) => {
  isEdit.value = true
  currentSupplier.value = row
  Object.assign(formData, {
    id: row.id,
    code: row.code,
    name: row.name,
    contact: row.contact,
    phone: row.phone,
    email: row.email,
    address: row.address,
    bankName: row.bankName,
    bankAccount: row.bankAccount,
    taxNo: row.taxNo,
    creditDays: row.creditDays,
    status: row.status
  })
  activeTab.value = 'basic'
  formDialogVisible.value = true
}

// 表单提交
const handleFormSubmit = async () => {
  // 验证基本信息表单
  const basicValid = await basicFormRef.value?.validate()
  if (basicValid !== true) {
    activeTab.value = 'basic'
    return
  }

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      await supplierApi.updateSupplier(formData.id, formData)
      MessagePlugin.success('更新成功')
    } else {
      await supplierApi.createSupplier(formData)
      MessagePlugin.success('创建成功')
    }
    formDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('提交失败:', error)
    MessagePlugin.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 表单关闭
const handleFormClose = () => {
  basicFormRef.value?.reset()
  bankFormRef.value?.reset()
  otherFormRef.value?.reset()
}

// 删除
const handleDelete = (row: Supplier) => {
  currentSupplier.value = row
  deleteDialogVisible.value = true
}

// 确认删除
const handleDeleteConfirm = async () => {
  if (!currentSupplier.value) return

  deleteLoading.value = true
  try {
    await supplierApi.deleteSupplier(currentSupplier.value.id)
    MessagePlugin.success('删除成功')
    deleteDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('删除失败:', error)
    MessagePlugin.error('删除失败')
  } finally {
    deleteLoading.value = false
  }
}

// 切换状态
const handleToggleStatus = async (row: Supplier) => {
  try {
    await supplierApi.toggleSupplierStatus(row.id)
    const newStatus = row.status === 'enabled' ? '禁用' : '启用'
    MessagePlugin.success(`${newStatus}成功`)
    loadData()
  } catch (error) {
    console.error('操作失败:', error)
    MessagePlugin.error('操作失败')
  }
}

// 挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.supplier-page {
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

.supplier-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.supplier-name {
  font-weight: 500;
  color: #000;
}

.supplier-code {
  font-size: 12px;
  color: #999;
}

.form-content {
  padding: 20px 20px 0;
}
</style>
