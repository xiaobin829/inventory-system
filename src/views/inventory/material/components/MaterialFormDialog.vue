<template>
  <t-dialog
    v-model:visible="dialogVisible"
    :header="isEdit ? '编辑原材料' : '新建原材料'"
    :width="700"
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
      <t-row :gutter="16">
        <t-col :span="12">
          <t-form-item label="物料名称" name="name">
            <t-input
              v-model="formData.name"
              placeholder="请输入物料名称"
              :maxlength="50"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col :span="12">
          <t-form-item label="物料编码" name="code">
            <t-input
              v-model="formData.code"
              placeholder="请输入物料编码"
              :maxlength="20"
              clearable
            />
          </t-form-item>
        </t-col>
      </t-row>

      <t-row :gutter="16">
        <t-col :span="12">
          <t-form-item label="物料分类" name="categoryId">
            <t-cascader
              v-model="formData.categoryId"
              :options="categoryOptions"
              :keys="{ value: 'id', label: 'name', children: 'children' }"
              placeholder="请选择物料分类"
              clearable
            />
          </t-form-item>
        </t-col>
        <t-col :span="12">
          <t-form-item label="规格" name="spec">
            <t-input
              v-model="formData.spec"
              placeholder="如：500g/袋"
              :maxlength="50"
              clearable
            />
          </t-form-item>
        </t-col>
      </t-row>

      <t-row :gutter="16">
        <t-col :span="12">
          <t-form-item label="计量单位" name="unit">
            <t-select
              v-model="formData.unit"
              placeholder="请选择计量单位"
              clearable
            >
              <t-option value="kg" label="千克(kg)" />
              <t-option value="g" label="克(g)" />
              <t-option value="L" label="升(L)" />
              <t-option value="ml" label="毫升(ml)" />
              <t-option value="个" label="个" />
              <t-option value="包" label="包" />
              <t-option value="盒" label="盒" />
              <t-option value="袋" label="袋" />
              <t-option value="瓶" label="瓶" />
              <t-option value="罐" label="罐" />
            </t-select>
          </t-form-item>
        </t-col>
        <t-col :span="12">
          <t-form-item label="状态" name="status">
            <t-switch v-model="formData.status" />
            <span style="margin-left: 8px; color: #666;">
              {{ formData.status ? '启用' : '禁用' }}
            </span>
          </t-form-item>
        </t-col>
      </t-row>

      <t-row :gutter="16">
        <t-col :span="12">
          <t-form-item label="采购价" name="purchasePrice">
            <t-input-number
              v-model="formData.purchasePrice"
              placeholder="请输入采购价"
              :min="0"
              :decimal-places="2"
              theme="normal"
            />
          </t-form-item>
        </t-col>
        <t-col :span="12">
          <t-form-item label="销售价" name="salePrice">
            <t-input-number
              v-model="formData.salePrice"
              placeholder="请输入销售价"
              :min="0"
              :decimal-places="2"
              theme="normal"
            />
          </t-form-item>
        </t-col>
      </t-row>

      <t-row :gutter="16">
        <t-col :span="12">
          <t-form-item label="最低库存" name="minStock">
            <t-input-number
              v-model="formData.minStock"
              placeholder="请输入最低库存"
              :min="0"
              :decimal-places="2"
              theme="normal"
            />
          </t-form-item>
        </t-col>
        <t-col :span="12">
          <t-form-item label="最高库存" name="maxStock">
            <t-input-number
              v-model="formData.maxStock"
              placeholder="请输入最高库存"
              :min="0"
              :decimal-places="2"
              theme="normal"
            />
          </t-form-item>
        </t-col>
      </t-row>

      <t-form-item label="备注" name="remark">
        <t-textarea
          v-model="formData.remark"
          placeholder="请输入备注信息"
          :maxlength="200"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import type { Material, MaterialFormData, MaterialCategory } from '@/types/material'
import * as materialApi from '@/api/material'

interface Props {
  visible: boolean
  editData?: Material | null
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

const dialogVisible = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)

// 分类选项
const categoryOptions = ref<MaterialCategory[]>([])

// 表单引用
const formRef = ref<FormInstanceFunctions>()

// 表单数据
const formData = reactive<MaterialFormData>({
  name: '',
  code: '',
  categoryId: undefined,
  spec: '',
  unit: 'kg',
  purchasePrice: undefined,
  salePrice: undefined,
  minStock: undefined,
  maxStock: undefined,
  status: true,
  remark: ''
})

// 表单验证规则
const formRules: Record<string, FormRule[]> = {
  name: [
    { required: true, message: '请输入物料名称', type: 'error' },
    { min: 2, max: 50, message: '物料名称长度为2-50个字符', type: 'error' }
  ],
  code: [
    { required: true, message: '请输入物料编码', type: 'error' },
    { 
      pattern: /^[A-Z0-9]+$/, 
      message: '物料编码只能包含大写字母和数字', 
      type: 'error' 
    },
    { min: 4, max: 20, message: '物料编码长度为4-20个字符', type: 'error' }
  ],
  categoryId: [
    { required: true, message: '请选择物料分类', type: 'error' }
  ],
  unit: [
    { required: true, message: '请选择计量单位', type: 'error' }
  ]
}

// 加载分类数据
const loadCategories = async () => {
  try {
    const response = await materialApi.getCategoryTree()
    if (response.code === 0) {
      categoryOptions.value = response.data
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
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
        categoryId: props.editData.categoryId,
        spec: props.editData.spec || '',
        unit: props.editData.unit,
        purchasePrice: props.editData.purchasePrice,
        salePrice: props.editData.salePrice,
        minStock: props.editData.minStock,
        maxStock: props.editData.maxStock,
        status: props.editData.status,
        remark: props.editData.remark || ''
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
      response = await materialApi.updateMaterial(props.editData.id, formData)
    } else {
      // 新建模式
      response = await materialApi.createMaterial(formData)
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
    categoryId: undefined,
    spec: '',
    unit: 'kg',
    purchasePrice: undefined,
    salePrice: undefined,
    minStock: undefined,
    maxStock: undefined,
    status: true,
    remark: ''
  })
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
:deep(.t-form__item) {
  margin-bottom: 20px;
}
</style>
