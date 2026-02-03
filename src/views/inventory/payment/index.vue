<template>
  <div class="payment-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2 class="page-title">支付设置</h2>
      <t-button theme="primary" @click="handleCreate">
        <template #icon><t-icon name="add" /></template>
        新增支付方式
      </t-button>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <t-input
            v-model="searchKeyword"
            placeholder="搜索支付方式名称"
            clearable
            style="width: 300px;"
            @enter="handleSearch"
            @clear="handleSearch"
          >
            <template #suffix-icon>
              <t-icon name="search" @click="handleSearch" style="cursor: pointer;" />
            </template>
          </t-input>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <t-table
        :data="filteredData"
        :columns="columns"
        row-key="id"
        stripe
      >
        <!-- 名称列 -->
        <template #name="{ row }">
          <span class="payment-name">{{ row.name }}</span>
        </template>

        <!-- 启用状态列 -->
        <template #enabled="{ row }">
          <t-switch
            v-model="row.enabled"
            @change="(val: boolean) => handleToggleEnabled(row, val)"
          />
        </template>

        <!-- 默认支付方式列 -->
        <template #isDefault="{ row }">
          <t-radio
            :checked="row.isDefault"
            :disabled="!row.enabled"
            @change="() => handleSetDefault(row)"
          />
        </template>

        <!-- 备注列 -->
        <template #remark="{ row }">
          <span class="remark-text">{{ row.remark || '-' }}</span>
        </template>

        <!-- 操作列 -->
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-divider layout="vertical" />
            <t-link theme="danger" @click="handleDelete(row)" :disabled="row.isDefault">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 新建/编辑支付方式弹窗 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="isEdit ? '编辑支付方式' : '新增支付方式'"
      :width="500"
      :confirm-btn="{ content: '确定', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="handleFormSubmit"
      @close="handleFormClose"
    >
      <t-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        label-width="100px"
        class="form-content"
      >
        <t-form-item label="名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入支付方式名称" maxlength="20" />
        </t-form-item>
        <t-form-item label="启用状态" name="enabled">
          <t-switch v-model="formData.enabled" />
        </t-form-item>
        <t-form-item label="设为默认" name="isDefault">
          <t-switch v-model="formData.isDefault" :disabled="!formData.enabled" />
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            placeholder="请输入备注信息"
            :autosize="{ minRows: 2, maxRows: 4 }"
            maxlength="100"
          />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 删除确认对话框 -->
    <t-dialog
      v-model:visible="deleteDialogVisible"
      header="删除确认"
      :body="`确定要删除支付方式「${currentPayment?.name}」吗？删除后无法恢复。`"
      :confirm-btn="{ content: '删除', theme: 'danger' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'

// 支付方式类型
interface PaymentMethod {
  id: string
  name: string
  enabled: boolean
  isDefault: boolean
  remark: string
}

// 表单数据类型
interface PaymentFormData {
  id?: string
  name: string
  enabled: boolean
  isDefault: boolean
  remark: string
}

// localStorage key
const STORAGE_KEY = 'payment_methods'

// 默认支付方式数据
const defaultPaymentMethods: PaymentMethod[] = [
  { id: '1', name: '现金', enabled: true, isDefault: true, remark: '现金支付' },
  { id: '2', name: '微信支付', enabled: true, isDefault: false, remark: '微信扫码支付' },
  { id: '3', name: '支付宝', enabled: true, isDefault: false, remark: '支付宝扫码支付' },
  { id: '4', name: '银行卡', enabled: true, isDefault: false, remark: '银行卡刷卡支付' },
  { id: '5', name: '转账', enabled: false, isDefault: false, remark: '银行转账' }
]

// 表单ref
const formRef = ref<FormInstanceFunctions | null>(null)

// 搜索关键词
const searchKeyword = ref('')

// 支付方式数据
const paymentMethods = ref<PaymentMethod[]>([])

// 过滤后的数据
const filteredData = computed(() => {
  if (!searchKeyword.value) {
    return paymentMethods.value
  }
  return paymentMethods.value.filter(item =>
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 表格列配置
const columns = [
  {
    colKey: 'name',
    title: '支付方式名称',
    width: 200
  },
  {
    colKey: 'enabled',
    title: '启用状态',
    width: 120
  },
  {
    colKey: 'isDefault',
    title: '默认',
    width: 100
  },
  {
    colKey: 'remark',
    title: '备注',
    ellipsis: true
  },
  {
    colKey: 'action',
    title: '操作',
    width: 140
  }
]

// 弹窗状态
const formDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentPayment = ref<PaymentMethod | null>(null)
const isEdit = ref(false)

// 表单数据
const defaultFormData: PaymentFormData = {
  name: '',
  enabled: true,
  isDefault: false,
  remark: ''
}

const formData = reactive<PaymentFormData>({ ...defaultFormData })

// 表单验证规则
const formRules: Record<string, FormRule[]> = {
  name: [
    { required: true, message: '请输入支付方式名称' },
    { max: 20, message: '名称不能超过20个字符' },
    {
      validator: (val: string) => {
        const exists = paymentMethods.value.some(
          item => item.name === val && item.id !== formData.id
        )
        return !exists
      },
      message: '该支付方式名称已存在'
    }
  ]
}

// 从localStorage加载数据
const loadFromStorage = (): PaymentMethod[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
  return [...defaultPaymentMethods]
}

// 保存到localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentMethods.value))
  } catch (error) {
    console.error('保存数据失败:', error)
  }
}

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 搜索
const handleSearch = () => {
  // 搜索通过computed自动过滤
}

// 新建支付方式
const handleCreate = () => {
  isEdit.value = false
  currentPayment.value = null
  Object.assign(formData, { ...defaultFormData, id: undefined })
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: PaymentMethod) => {
  isEdit.value = true
  currentPayment.value = row
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    enabled: row.enabled,
    isDefault: row.isDefault,
    remark: row.remark
  })
  formDialogVisible.value = true
}

// 表单提交
const handleFormSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid !== true) {
    return
  }

  if (isEdit.value && formData.id) {
    // 编辑模式
    const index = paymentMethods.value.findIndex(item => item.id === formData.id)
    if (index !== -1) {
      // 如果设为默认，取消其他默认
      if (formData.isDefault) {
        paymentMethods.value.forEach(item => {
          item.isDefault = false
        })
      }
      paymentMethods.value[index] = {
        id: formData.id,
        name: formData.name,
        enabled: formData.enabled,
        isDefault: formData.isDefault,
        remark: formData.remark
      }
      MessagePlugin.success('更新成功')
    }
  } else {
    // 新建模式
    // 如果设为默认，取消其他默认
    if (formData.isDefault) {
      paymentMethods.value.forEach(item => {
        item.isDefault = false
      })
    }
    const newPayment: PaymentMethod = {
      id: generateId(),
      name: formData.name,
      enabled: formData.enabled,
      isDefault: formData.isDefault,
      remark: formData.remark
    }
    paymentMethods.value.push(newPayment)
    MessagePlugin.success('创建成功')
  }

  saveToStorage()
  formDialogVisible.value = false
}

// 表单关闭
const handleFormClose = () => {
  formRef.value?.reset()
}

// 删除
const handleDelete = (row: PaymentMethod) => {
  if (row.isDefault) {
    MessagePlugin.warning('默认支付方式不能删除')
    return
  }
  currentPayment.value = row
  deleteDialogVisible.value = true
}

// 确认删除
const handleDeleteConfirm = () => {
  if (!currentPayment.value) return

  const index = paymentMethods.value.findIndex(item => item.id === currentPayment.value?.id)
  if (index !== -1) {
    paymentMethods.value.splice(index, 1)
    saveToStorage()
    MessagePlugin.success('删除成功')
  }
  deleteDialogVisible.value = false
}

// 切换启用状态
const handleToggleEnabled = (row: PaymentMethod, enabled: boolean) => {
  row.enabled = enabled
  // 如果禁用且是默认，则取消默认
  if (!enabled && row.isDefault) {
    row.isDefault = false
    // 找一个启用的设为默认
    const enabledItem = paymentMethods.value.find(item => item.enabled && item.id !== row.id)
    if (enabledItem) {
      enabledItem.isDefault = true
    }
  }
  saveToStorage()
  MessagePlugin.success(enabled ? '已启用' : '已禁用')
}

// 设为默认
const handleSetDefault = (row: PaymentMethod) => {
  if (!row.enabled) {
    MessagePlugin.warning('请先启用该支付方式')
    return
  }
  // 取消其他默认
  paymentMethods.value.forEach(item => {
    item.isDefault = item.id === row.id
  })
  saveToStorage()
  MessagePlugin.success('已设为默认支付方式')
}

// 挂载时加载数据
onMounted(() => {
  paymentMethods.value = loadFromStorage()
})
</script>

<style scoped>
.payment-page {
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

.table-section {
  margin-top: 16px;
}

.payment-name {
  font-weight: 500;
  color: #000;
}

.remark-text {
  color: #666;
}

.form-content {
  padding: 20px 20px 0;
}
</style>
