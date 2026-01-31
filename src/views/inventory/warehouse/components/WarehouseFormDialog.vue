<template>
  <t-dialog
    v-model:visible="dialogVisible"
    :header="isEdit ? '编辑仓库' : '新建仓库'"
    :width="600"
    :confirm-btn="{
      content: '确定',
      theme: 'primary',
      loading: submitLoading
    }"
    :cancel-btn="{ content: '取消' }"
    @confirm="handleSubmit"
    @close="handleClose"
  >
    <t-form
      ref="formRef"
      :data="formData"
      :rules="formRules"
      label-width="100px"
      @submit="handleSubmit"
    >
      <t-form-item label="仓库名称" name="name">
        <t-input
          v-model="formData.name"
          placeholder="请输入仓库名称"
          :maxlength="50"
          clearable
        />
      </t-form-item>

      <t-form-item label="仓库编码" name="code">
        <t-input
          v-model="formData.code"
          placeholder="请输入仓库编码"
          :maxlength="20"
          clearable
        />
      </t-form-item>

      <t-form-item label="仓库类型" name="type">
        <t-select
          v-model="formData.type"
          placeholder="请选择仓库类型"
          clearable
        >
          <t-option value="distribution" label="配送中心仓库" />
          <t-option value="store" label="门店仓库" />
        </t-select>
      </t-form-item>

      <t-form-item label="联系人" name="contact">
        <t-input
          v-model="formData.contact"
          placeholder="请输入联系人"
          :maxlength="30"
          clearable
        />
      </t-form-item>

      <t-form-item label="联系方式" name="phone">
        <t-input
          v-model="formData.phone"
          placeholder="请输入联系方式"
          :maxlength="20"
          clearable
        />
      </t-form-item>

      <t-form-item label="地址" name="address">
        <t-textarea
          v-model="formData.address"
          placeholder="请输入地址"
          :maxlength="200"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </t-form-item>

      <t-form-item label="状态" name="status">
        <t-switch v-model="formData.status" />
        <span style="margin-left: 8px; color: #666;">
          {{ formData.status ? '启用' : '禁用' }}
        </span>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import type { Warehouse, WarehouseFormData } from '@/types/warehouse'
import * as warehouseApi from '@/api/warehouse'

interface Props {
  visible: boolean
  editData?: Warehouse | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  editData: null
})

const emit = defineEmits<Emits>()

// 弹窗显示状态
const dialogVisible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)

// 表单引用
const formRef = ref<FormInstanceFunctions>()

// 表单数据
const formData = reactive<WarehouseFormData>({
  name: '',
  code: '',
  type: undefined,
  contact: '',
  phone: '',
  address: '',
  status: true
})

// 表单验证规则
const formRules: Record<string, FormRule[]> = {
  name: [
    { required: true, message: '请输入仓库名称', type: 'error' },
    { min: 2, max: 50, message: '仓库名称长度为2-50个字符', type: 'error' }
  ],
  code: [
    { required: true, message: '请输入仓库编码', type: 'error' },
    { 
      pattern: /^[A-Z0-9]+$/, 
      message: '仓库编码只能包含大写字母和数字', 
      type: 'error' 
    },
    { min: 4, max: 20, message: '仓库编码长度为4-20个字符', type: 'error' }
  ],
  type: [
    { required: true, message: '请选择仓库类型', type: 'error' }
  ],
  contact: [
    { required: true, message: '请输入联系人', type: 'error' },
    { min: 2, max: 30, message: '联系人长度为2-30个字符', type: 'error' }
  ],
  phone: [
    { required: true, message: '请输入联系方式', type: 'error' },
    { 
      pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, 
      message: '请输入正确的手机号或固定电话', 
      type: 'warning' 
    }
  ]
}

// 监听弹窗显示状态
watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    isEdit.value = !!props.editData
    if (props.editData) {
      // 编辑模式，填充数据
      Object.assign(formData, {
        name: props.editData.name,
        code: props.editData.code,
        type: props.editData.type,
        contact: props.editData.contact,
        phone: props.editData.phone,
        address: props.editData.address || '',
        status: props.editData.status
      })
    }
  }
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

// 提交表单
const handleSubmit = async () => {
  // 表单验证
  const valid = await formRef.value?.validate()
  if (!valid) {
    return
  }

  submitLoading.value = true
  try {
    let response
    if (isEdit.value && props.editData) {
      // 编辑模式
      response = await warehouseApi.updateWarehouse(props.editData.id, formData)
    } else {
      // 新建模式
      response = await warehouseApi.createWarehouse(formData)
    }

    if (response.code === 0) {
      MessagePlugin.success(isEdit.value ? '编辑成功' : '创建成功')
      emit('success')
      handleClose()
    } else {
      MessagePlugin.error(response.message || (isEdit.value ? '编辑失败' : '创建失败'))
    }
  } catch (error) {
    console.error('提交失败:', error)
    MessagePlugin.error(isEdit.value ? '编辑失败' : '创建失败')
  } finally {
    submitLoading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  formRef.value?.reset()
  // 重置表单数据
  Object.assign(formData, {
    name: '',
    code: '',
    type: undefined,
    contact: '',
    phone: '',
    address: '',
    status: true
  })
}
</script>

<style scoped>
/* 表单样式优化 */
:deep(.t-form__item) {
  margin-bottom: 24px;
}
</style>
