<template>
  <t-dialog
    :visible="visible"
    :header="isEdit ? '编辑成品' : '新建成品'"
    :width="1000"
    :confirm-btn="confirmBtn"
    :on-confirm="handleConfirm"
    @close="handleClose"
  >
    <t-tabs v-model="activeTab" :lazy="false">
      <!-- 基础信息 -->
      <t-tab-panel value="basic" label="基础信息">
        <t-form
          ref="basicFormRef"
          :data="formData"
          :rules="basicRules"
          label-width="120px"
          @submit="handleConfirm"
        >
          <t-row :gutter="16">
            <t-col :span="6">
              <t-form-item label="成品名称" name="name">
                <t-input v-model="formData.name" placeholder="请输入成品名称" clearable />
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="成品编码" name="code">
                <t-input
                  v-model="formData.code"
                  placeholder="请输入成品编码"
                  :disabled="isEdit"
                  clearable
                />
              </t-form-item>
            </t-col>
          </t-row>

          <t-row :gutter="16">
            <t-col :span="6">
              <t-form-item label="成品分类" name="categoryId">
                <t-select
                  v-model="formData.categoryId"
                  placeholder="请选择分类"
                  clearable
                >
                  <t-option-group
                    v-for="group in categoryOptions"
                    :key="group.id"
                    :label="group.name"
                  >
                    <t-option
                      v-for="child in group.children"
                      :key="child.id"
                      :value="child.id"
                      :label="child.name"
                    />
                  </t-option-group>
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="规格型号" name="specification">
                <t-input v-model="formData.specification" placeholder="如：500ml" clearable />
              </t-form-item>
            </t-col>
          </t-row>

          <t-row :gutter="16">
            <t-col :span="6">
              <t-form-item label="计量单位" name="unit">
                <t-select v-model="formData.unit" placeholder="请选择单位">
                  <t-option value="piece" label="个" />
                  <t-option value="box" label="箱" />
                  <t-option value="bag" label="袋" />
                  <t-option value="kg" label="千克" />
                  <t-option value="g" label="克" />
                  <t-option value="l" label="升" />
                  <t-option value="ml" label="毫升" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="6">
              <t-form-item label="条形码" name="barcode">
                <t-input v-model="formData.barcode" placeholder="请输入条形码" clearable />
              </t-form-item>
            </t-col>
          </t-row>

          <t-divider>价格信息</t-divider>

          <t-row :gutter="16">
            <t-col :span="4">
              <t-form-item label="成本价" name="costPrice">
                <t-input-number
                  v-model="formData.costPrice"
                  placeholder="0.00"
                  :decimal-places="2"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="销售价" name="salePrice">
                <t-input-number
                  v-model="formData.salePrice"
                  placeholder="0.00"
                  :decimal-places="2"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="市场价" name="marketPrice">
                <t-input-number
                  v-model="formData.marketPrice"
                  placeholder="0.00"
                  :decimal-places="2"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
          </t-row>

          <t-divider>库存设置</t-divider>

          <t-row :gutter="16">
            <t-col :span="4">
              <t-form-item label="最低库存" name="minStock">
                <t-input-number
                  v-model="formData.minStock"
                  placeholder="0"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="最高库存" name="maxStock">
                <t-input-number
                  v-model="formData.maxStock"
                  placeholder="0"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="安全库存" name="safetyStock">
                <t-input-number
                  v-model="formData.safetyStock"
                  placeholder="0"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
          </t-row>

          <t-divider>生产信息</t-divider>

          <t-row :gutter="16">
            <t-col :span="6">
              <t-form-item label="成本卡" name="costCardId">
                <t-select
                  v-model="formData.costCardId"
                  placeholder="请选择成本卡"
                  clearable
                  filterable
                >
                  <t-option value="cc-001" label="珍珠奶茶成本卡" />
                  <t-option value="cc-002" label="芒果冰沙成本卡" />
                  <t-option value="cc-003" label="红豆吐司成本卡" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="保质期(天)" name="shelfLife">
                <t-input-number
                  v-model="formData.shelfLife"
                  placeholder="0"
                  :min="0"
                  theme="normal"
                />
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item label="储存条件" name="storageCondition">
                <t-input v-model="formData.storageCondition" placeholder="如：冷藏" clearable />
              </t-form-item>
            </t-col>
          </t-row>

          <t-form-item label="生产工艺" name="productionProcess">
            <t-textarea
              v-model="formData.productionProcess"
              placeholder="请输入生产工艺说明"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </t-form-item>

          <t-form-item label="备注" name="remark">
            <t-textarea
              v-model="formData.remark"
              placeholder="请输入备注信息"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </t-form-item>

          <t-form-item label="启用状态" name="enabled">
            <t-switch v-model="formData.enabled" />
            <span style="margin-left: 8px; color: #666;">
              {{ formData.enabled ? '启用' : '禁用' }}
            </span>
          </t-form-item>
        </t-form>
      </t-tab-panel>

      <!-- BOM配方 -->
      <t-tab-panel value="bom" label="BOM配方">
        <div class="bom-section">
          <div class="bom-header">
            <t-button theme="primary" size="small" @click="handleAddBOM">
              <template #icon><t-icon name="add" /></template>
              添加原材料
            </t-button>
            <div class="bom-cost-summary">
              <span class="label">配方总成本：</span>
              <span class="value">¥{{ totalBOMCost.toFixed(2) }}</span>
            </div>
          </div>

          <t-table
            :data="formData.bomItems || []"
            :columns="bomColumns"
            row-key="id"
            size="small"
            :max-height="300"
          >
            <template #quantity="{ row, rowIndex }">
              <t-input-number
                v-model="row.quantity"
                :min="0"
                :decimal-places="2"
                size="small"
                theme="normal"
                @change="handleBOMChange(rowIndex)"
              />
            </template>

            <template #unit="{ row }">
              <t-select v-model="row.unit" size="small" style="width: 80px;">
                <t-option value="kg" label="千克" />
                <t-option value="g" label="克" />
                <t-option value="l" label="升" />
                <t-option value="ml" label="毫升" />
                <t-option value="piece" label="个" />
              </t-select>
            </template>

            <template #cost="{ row }">
              ¥{{ row.cost?.toFixed(2) || '0.00' }}
            </template>

            <template #remark="{ row }">
              <t-input
                v-model="row.remark"
                placeholder="备注"
                size="small"
              />
            </template>

            <template #operation="{ rowIndex }">
              <t-link theme="danger" @click="handleDeleteBOM(rowIndex)">删除</t-link>
            </template>
          </t-table>

          <t-dialog
            v-model:visible="bomDialogVisible"
            header="选择原材料"
            width="600px"
            @confirm="handleConfirmBOM"
          >
            <t-input
              v-model="bomSearchKeyword"
              placeholder="搜索原材料名称或编码"
              clearable
              style="margin-bottom: 16px;"
            >
              <template #suffix-icon>
                <t-icon name="search" />
              </template>
            </t-input>

            <t-table
              :data="filteredMaterials"
              :columns="materialSelectColumns"
              row-key="id"
              :selected-row-keys="selectedMaterialIds"
              :max-height="400"
              @select-change="handleMaterialSelect"
            >
            </t-table>
          </t-dialog>
        </div>
      </t-tab-panel>
    </t-tabs>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstanceFunctions, FormRule, SubmitContext } from 'tdesign-vue-next';
import type { ProductFormData, BOMItem, ProductCategory } from '@/types/product';
import { MeasureUnit } from '@/types/product';
import { MessagePlugin } from 'tdesign-vue-next';
import { getProductCategories } from '@/api/product';

// Props
interface Props {
  visible: boolean;
  data?: ProductFormData;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
});

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean];
  confirm: [data: ProductFormData];
}>();

// Tab 状态
const activeTab = ref('basic');

// 表单引用
const basicFormRef = ref<FormInstanceFunctions>();

// 分类选项
const categoryOptions = ref<ProductCategory[]>([]);

// 表单数据
const formData = reactive<ProductFormData>({
  name: '',
  code: '',
  categoryId: '',
  specification: '',
  unit: MeasureUnit.PIECE,
  costPrice: undefined,
  salePrice: undefined,
  marketPrice: undefined,
  minStock: undefined,
  maxStock: undefined,
  safetyStock: undefined,
  costCardId: undefined,
  bomItems: [],
  productionProcess: '',
  shelfLife: undefined,
  storageCondition: '',
  barcode: '',
  remark: '',
  enabled: true
});

// 基础信息表单验证规则
const basicRules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入成品名称', type: 'error' }],
  code: [{ required: true, message: '请输入成品编码', type: 'error' }],
  categoryId: [{ required: true, message: '请选择成品分类', type: 'error' }],
  unit: [{ required: true, message: '请选择计量单位', type: 'error' }]
};

// 确认按钮配置
const confirmBtn = {
  content: '确定',
  theme: 'primary',
  loading: false
};

// BOM 对话框
const bomDialogVisible = ref(false);
const bomSearchKeyword = ref('');
const selectedMaterialIds = ref<string[]>([]);

// Mock 原材料数据
const mockMaterials = ref([
  { id: 'mat-1', name: '珍珠', code: 'MAT-001', unit: MeasureUnit.G, price: 0.03 },
  { id: 'mat-2', name: '牛奶', code: 'MAT-002', unit: MeasureUnit.ML, price: 0.015 },
  { id: 'mat-3', name: '红茶', code: 'MAT-003', unit: MeasureUnit.G, price: 0.10 },
  { id: 'mat-4', name: '糖浆', code: 'MAT-004', unit: MeasureUnit.ML, price: 0.033 },
  { id: 'mat-5', name: '芒果', code: 'MAT-005', unit: MeasureUnit.G, price: 0.04 },
  { id: 'mat-6', name: '冰块', code: 'MAT-006', unit: MeasureUnit.G, price: 0.005 },
  { id: 'mat-7', name: '糖', code: 'MAT-007', unit: MeasureUnit.G, price: 0.025 },
  { id: 'mat-8', name: '吐司面包', code: 'MAT-008', unit: MeasureUnit.G, price: 0.025 },
  { id: 'mat-9', name: '红豆沙', code: 'MAT-009', unit: MeasureUnit.G, price: 0.03 }
]);

// 过滤后的原材料
const filteredMaterials = computed(() => {
  if (!bomSearchKeyword.value) return mockMaterials.value;
  
  const keyword = bomSearchKeyword.value.toLowerCase();
  return mockMaterials.value.filter(m =>
    m.name.toLowerCase().includes(keyword) ||
    m.code.toLowerCase().includes(keyword)
  );
});

// BOM 表格列
const bomColumns = [
  { colKey: 'materialName', title: '原材料名称', width: 150 },
  { colKey: 'materialCode', title: '原材料编码', width: 120 },
  { colKey: 'quantity', title: '用量', width: 120, cell: 'quantity' },
  { colKey: 'unit', title: '单位', width: 100, cell: 'unit' },
  { colKey: 'cost', title: '成本', width: 100, cell: 'cost' },
  { colKey: 'remark', title: '备注', minWidth: 150, cell: 'remark' },
  { colKey: 'operation', title: '操作', width: 80, cell: 'operation' }
];

// 原材料选择表格列
const materialSelectColumns = [
  { colKey: 'name', title: '原材料名称', width: 200 },
  { colKey: 'code', title: '编码', width: 150 },
  { colKey: 'unit', title: '单位', width: 100 }
];

// 计算 BOM 总成本
const totalBOMCost = computed(() => {
  if (!formData.bomItems) return 0;
  return formData.bomItems.reduce((sum, item) => sum + (item.cost || 0), 0);
});

// 处理添加 BOM
const handleAddBOM = () => {
  bomDialogVisible.value = true;
  selectedMaterialIds.value = [];
  bomSearchKeyword.value = '';
};

// 处理原材料选择
const handleMaterialSelect = (selectedKeys: string[]) => {
  selectedMaterialIds.value = selectedKeys;
};

// 确认添加 BOM
const handleConfirmBOM = () => {
  const newItems: BOMItem[] = selectedMaterialIds.value.map(id => {
    const material = mockMaterials.value.find(m => m.id === id);
    if (!material) return null;
    
    return {
      id: `bom-${Date.now()}-${id}`,
      materialId: material.id,
      materialName: material.name,
      materialCode: material.code,
      quantity: 0,
      unit: material.unit,
      cost: 0,
      remark: ''
    };
  }).filter(Boolean) as BOMItem[];

  if (!formData.bomItems) {
    formData.bomItems = [];
  }
  
  formData.bomItems.push(...newItems);
  bomDialogVisible.value = false;
};

// 处理 BOM 数据变化
const handleBOMChange = (index: number) => {
  if (!formData.bomItems) return;
  
  const item = formData.bomItems[index];
  const material = mockMaterials.value.find(m => m.id === item.materialId);
  
  if (material && item.quantity) {
    item.cost = item.quantity * material.price;
  } else {
    item.cost = 0;
  }
};

// 删除 BOM 项
const handleDeleteBOM = (index: number) => {
  if (!formData.bomItems) return;
  formData.bomItems.splice(index, 1);
};

// 加载分类数据
const loadCategories = async () => {
  try {
    const categories = await getProductCategories();
    // 只获取有子分类的部分
    categoryOptions.value = categories[0]?.children || [];
  } catch (error) {
    console.error('加载分类失败:', error);
  }
};

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadCategories();
    activeTab.value = 'basic';
    
    if (props.data) {
      Object.assign(formData, props.data);
    } else {
      resetForm();
    }
  }
});

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    code: '',
    categoryId: '',
    specification: '',
    unit: MeasureUnit.PIECE,
    costPrice: undefined,
    salePrice: undefined,
    marketPrice: undefined,
    minStock: undefined,
    maxStock: undefined,
    safetyStock: undefined,
    costCardId: undefined,
    bomItems: [],
    productionProcess: '',
    shelfLife: undefined,
    storageCondition: '',
    barcode: '',
    remark: '',
    enabled: true
  });
  
  basicFormRef.value?.clearValidate();
};

// 处理确认
const handleConfirm = async () => {
  const valid = await basicFormRef.value?.validate();
  
  if (valid === true) {
    emit('confirm', { ...formData });
    return true;
  }
  
  // 验证失败，切换到基础信息 Tab
  if (activeTab.value !== 'basic') {
    activeTab.value = 'basic';
    MessagePlugin.warning('请先完善基础信息');
  }
  
  return false;
};

// 处理关闭
const handleClose = () => {
  emit('update:visible', false);
};
</script>

<style scoped lang="less">
.bom-section {
  .bom-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .bom-cost-summary {
      .label {
        color: #666;
        margin-right: 8px;
      }

      .value {
        font-size: 18px;
        font-weight: 600;
        color: #e34d59;
      }
    }
  }
}

:deep(.t-form__item) {
  margin-bottom: 16px;
}

:deep(.t-divider) {
  margin: 20px 0 16px 0;
}
</style>
