<template>
  <div class="initial-page">
    <div class="page-header">
      <h2 class="page-title">仓库期初</h2>
      <t-space>
        <t-button theme="default" variant="outline" @click="handleBatchImport">
          <template #icon><t-icon name="upload" /></template>
          批量导入
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新增期初
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          v-model="queryParams.warehouseId"
          placeholder="选择仓库"
          clearable
          style="width: 180px;"
          @change="loadData"
        >
          <t-option
            v-for="item in warehouseOptions"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </t-select>

        <t-select
          v-model="queryParams.materialId"
          placeholder="选择物料"
          clearable
          filterable
          style="width: 200px;"
          @change="loadData"
        >
          <t-option
            v-for="item in materialOptions"
            :key="item.id"
            :value="item.id"
            :label="`${item.name} (${item.spec})`"
          />
        </t-select>

        <t-input
          v-model="queryParams.keyword"
          placeholder="搜索物料名称/批次号"
          clearable
          style="width: 220px;"
          @enter="loadData"
          @clear="loadData"
        >
          <template #suffix-icon>
            <t-icon name="search" @click="loadData" style="cursor: pointer;" />
          </template>
        </t-input>
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
          <span>{{ row.warehouseName }}</span>
        </template>

        <!-- 物料信息列 -->
        <template #material="{ row }">
          <div class="material-info">
            <div class="material-name">{{ row.materialName }}</div>
            <div class="material-spec">{{ row.specification || '-' }}</div>
          </div>
        </template>

        <!-- 数量列 -->
        <template #quantity="{ row }">
          <span>{{ row.quantity }} {{ row.unit }}</span>
        </template>

        <!-- 单价列 -->
        <template #unitCost="{ row }">
          <span class="cost-text">¥{{ row.unitCost.toFixed(2) }}</span>
        </template>

        <!-- 总成本列 -->
        <template #totalCost="{ row }">
          <span class="cost-text total">¥{{ row.totalCost.toFixed(2) }}</span>
        </template>

        <!-- 批次/效期列 -->
        <template #batchInfo="{ row }">
          <div class="batch-info">
            <div v-if="row.batchNo">批次: {{ row.batchNo }}</div>
            <div v-if="row.expiryDate" :class="{ 'expired': isExpired(row.expiryDate), 'near-expiry': isNearExpiry(row.expiryDate) }">
              效期: {{ row.expiryDate }}
            </div>
            <span v-if="!row.batchNo && !row.expiryDate">-</span>
          </div>
        </template>

        <!-- 操作人列 -->
        <template #operator="{ row }">
          <div class="operator-info">
            <div>{{ row.operatorName }}</div>
            <div class="create-time">{{ row.createTime }}</div>
          </div>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <t-space :size="0">
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-divider layout="vertical" />
            <t-popconfirm content="确定删除该期初记录吗？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 新增/编辑对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="isEdit ? '编辑期初库存' : '新增期初库存'"
      width="600px"
      :confirm-btn="{ loading: submitLoading }"
      @confirm="handleSubmit"
      @close="resetForm"
    >
      <t-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        label-width="100px"
      >
        <t-form-item label="仓库" name="warehouseId">
          <t-select
            v-model="formData.warehouseId"
            placeholder="请选择仓库"
            :disabled="isEdit"
          >
            <t-option
              v-for="item in warehouseOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </t-select>
        </t-form-item>

        <t-form-item label="物料" name="materialId">
          <t-select
            v-model="formData.materialId"
            placeholder="请选择物料"
            filterable
            :disabled="isEdit"
            @change="handleMaterialChange"
          >
            <t-option
              v-for="item in materialOptions"
              :key="item.id"
              :value="item.id"
              :label="`${item.name} (${item.spec})`"
            />
          </t-select>
        </t-form-item>

        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="数量" name="quantity">
              <t-input-number
                v-model="formData.quantity"
                :min="0"
                :decimal-places="2"
                placeholder="请输入数量"
                @change="calculateTotalCost"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="单位成本" name="unitCost">
              <t-input-number
                v-model="formData.unitCost"
                :min="0"
                :decimal-places="2"
                placeholder="请输入单位成本"
                @change="calculateTotalCost"
              >
                <template #prefix>¥</template>
              </t-input-number>
            </t-form-item>
          </t-col>
        </t-row>

        <t-form-item label="总成本">
          <t-input :value="'¥' + totalCost.toFixed(2)" disabled />
        </t-form-item>

        <t-form-item label="批次号" name="batchNo">
          <t-input v-model="formData.batchNo" placeholder="请输入批次号（选填）" />
        </t-form-item>

        <t-form-item label="有效期" name="expiryDate">
          <t-date-picker
            v-model="formData.expiryDate"
            placeholder="请选择有效期（选填）"
            style="width: 100%;"
          />
        </t-form-item>

        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            placeholder="请输入备注信息（选填）"
            :maxlength="200"
          />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 批量导入对话框 -->
    <t-dialog
      v-model:visible="importDialogVisible"
      header="批量导入期初库存"
      width="800px"
      :confirm-btn="{ loading: importLoading, disabled: importData.length === 0 }"
      @confirm="handleImportConfirm"
      @close="resetImport"
    >
      <div class="import-content">
        <t-alert theme="info" style="margin-bottom: 16px;">
          <template #message>
            请按照格式添加数据：选择仓库、物料，填写数量和单价。系统会自动计算总成本。
          </template>
        </t-alert>

        <div class="import-actions" style="margin-bottom: 16px;">
          <t-button theme="primary" variant="outline" @click="addImportRow">
            <template #icon><t-icon name="add" /></template>
            添加行
          </t-button>
        </div>

        <t-table
          :data="importData"
          :columns="importColumns"
          row-key="tempId"
          max-height="400px"
        >
          <template #warehouseId="{ row }">
            <t-select v-model="row.warehouseId" placeholder="选择仓库" size="small">
              <t-option
                v-for="item in warehouseOptions"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </t-select>
          </template>

          <template #materialId="{ row }">
            <t-select
              v-model="row.materialId"
              placeholder="选择物料"
              filterable
              size="small"
              @change="(val: string) => handleImportMaterialChange(row, val)"
            >
              <t-option
                v-for="item in materialOptions"
                :key="item.id"
                :value="item.id"
                :label="`${item.name} (${item.spec})`"
              />
            </t-select>
          </template>

          <template #quantity="{ row }">
            <t-input-number
              v-model="row.quantity"
              :min="0"
              :decimal-places="2"
              size="small"
              @change="() => calculateImportTotalCost(row)"
            />
          </template>

          <template #unitCost="{ row }">
            <t-input-number
              v-model="row.unitCost"
              :min="0"
              :decimal-places="2"
              size="small"
              @change="() => calculateImportTotalCost(row)"
            />
          </template>

          <template #totalCost="{ row }">
            <span class="cost-text">¥{{ ((row.quantity || 0) * (row.unitCost || 0)).toFixed(2) }}</span>
          </template>

          <template #batchNo="{ row }">
            <t-input v-model="row.batchNo" placeholder="批次号" size="small" />
          </template>

          <template #operation="{ row, rowIndex }">
            <t-link theme="danger" @click="removeImportRow(rowIndex)">删除</t-link>
          </template>
        </t-table>

        <!-- 导入结果 -->
        <div v-if="importResult" class="import-result" style="margin-top: 16px;">
          <t-alert :theme="importResult.failed > 0 ? 'warning' : 'success'">
            <template #message>
              导入完成：成功 {{ importResult.success }} 条，失败 {{ importResult.failed }} 条
              <div v-if="importResult.errors.length > 0" style="margin-top: 8px;">
                <div v-for="error in importResult.errors" :key="error.row" style="color: #e34d59;">
                  第 {{ error.row }} 行：{{ error.message }}
                </div>
              </div>
            </template>
          </t-alert>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type { PageInfo, FormInstanceFunctions, FormRule } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { InitialInventory, InitialInventoryQuery, InitialInventoryFormData, BatchImportResult } from '@/types/initial';
import {
  getInitialInventory,
  createInitialInventory,
  updateInitialInventory,
  deleteInitialInventory,
  batchImportInitialInventory,
  getEnabledWarehouses,
  getEnabledMaterials
} from '@/api/initial';

// 下拉选项
const warehouseOptions = ref<Array<{ id: string; name: string }>>([]);
const materialOptions = ref<Array<{ id: string; name: string; spec: string; unit: string; price: number }>>([]);

// 查询参数
const queryParams = reactive<InitialInventoryQuery>({
  warehouseId: undefined,
  materialId: undefined,
  keyword: '',
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<InitialInventory[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 表单相关
const formDialogVisible = ref(false);
const formRef = ref<FormInstanceFunctions>();
const isEdit = ref(false);
const editingId = ref<string>('');
const submitLoading = ref(false);

const formData = reactive<InitialInventoryFormData>({
  warehouseId: '',
  materialId: '',
  quantity: 0,
  unitCost: 0,
  batchNo: '',
  expiryDate: '',
  remark: ''
});

const formRules: Record<string, FormRule[]> = {
  warehouseId: [{ required: true, message: '请选择仓库' }],
  materialId: [{ required: true, message: '请选择物料' }],
  quantity: [{ required: true, message: '请输入数量' }],
  unitCost: [{ required: true, message: '请输入单位成本' }]
};

// 计算总成本
const totalCost = computed(() => {
  return (formData.quantity || 0) * (formData.unitCost || 0);
});

// 导入相关
const importDialogVisible = ref(false);
const importLoading = ref(false);
const importData = ref<Array<InitialInventoryFormData & { tempId: number }>>([]);
const importResult = ref<BatchImportResult | null>(null);
let importTempId = 0;

// 表格列配置
const columns = [
  { colKey: 'warehouse', title: '仓库', width: 140, cell: 'warehouse' },
  { colKey: 'material', title: '物料/规格', width: 180, cell: 'material' },
  { colKey: 'quantity', title: '数量', width: 100, cell: 'quantity' },
  { colKey: 'unitCost', title: '单价', width: 100, cell: 'unitCost' },
  { colKey: 'totalCost', title: '总成本', width: 120, cell: 'totalCost' },
  { colKey: 'batchInfo', title: '批次/效期', width: 160, cell: 'batchInfo' },
  { colKey: 'operator', title: '操作人/时间', width: 160, cell: 'operator' },
  { colKey: 'operation', title: '操作', width: 120, fixed: 'right' as const, cell: 'operation' }
];

// 导入表格列配置
const importColumns = [
  { colKey: 'warehouseId', title: '仓库', width: 150, cell: 'warehouseId' },
  { colKey: 'materialId', title: '物料', width: 180, cell: 'materialId' },
  { colKey: 'quantity', title: '数量', width: 100, cell: 'quantity' },
  { colKey: 'unitCost', title: '单价', width: 100, cell: 'unitCost' },
  { colKey: 'totalCost', title: '总成本', width: 100, cell: 'totalCost' },
  { colKey: 'batchNo', title: '批次号', width: 120, cell: 'batchNo' },
  { colKey: 'operation', title: '操作', width: 80, cell: 'operation' }
];

// 判断是否过期
const isExpired = (date: string) => {
  return new Date(date) < new Date();
};

// 判断是否临近过期（30天内）
const isNearExpiry = (date: string) => {
  const expiryDate = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 30;
};

// 加载下拉选项
const loadOptions = async () => {
  try {
    const [warehouses, materials] = await Promise.all([
      getEnabledWarehouses(),
      getEnabledMaterials()
    ]);
    warehouseOptions.value = warehouses;
    materialOptions.value = materials;
  } catch (error) {
    console.error('加载下拉选项失败:', error);
  }
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    };

    const { list, total } = await getInitialInventory(params);
    tableData.value = list;
    pagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  loadData();
};

// 处理物料选择变化
const handleMaterialChange = (value: string) => {
  const material = materialOptions.value.find(item => item.id === value);
  if (material) {
    formData.unitCost = material.price;
    calculateTotalCost();
  }
};

// 计算总成本
const calculateTotalCost = () => {
  // 计算在computed中处理
};

// 处理新建
const handleCreate = () => {
  isEdit.value = false;
  editingId.value = '';
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: InitialInventory) => {
  isEdit.value = true;
  editingId.value = row.id;
  formData.warehouseId = row.warehouseId;
  formData.materialId = row.materialId;
  formData.quantity = row.quantity;
  formData.unitCost = row.unitCost;
  formData.batchNo = row.batchNo || '';
  formData.expiryDate = row.expiryDate || '';
  formData.remark = row.remark || '';
  formDialogVisible.value = true;
};

// 处理删除
const handleDelete = async (row: InitialInventory) => {
  try {
    await deleteInitialInventory(row.id);
    MessagePlugin.success('删除成功');
    loadData();
  } catch (error) {
    console.error('删除失败:', error);
    MessagePlugin.error('删除失败');
  }
};

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid !== true) return;

  submitLoading.value = true;
  try {
    if (isEdit.value) {
      await updateInitialInventory(editingId.value, formData);
      MessagePlugin.success('更新成功');
    } else {
      await createInitialInventory(formData);
      MessagePlugin.success('创建成功');
    }
    formDialogVisible.value = false;
    loadData();
  } catch (error) {
    console.error('操作失败:', error);
    MessagePlugin.error('操作失败');
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formData.warehouseId = '';
  formData.materialId = '';
  formData.quantity = 0;
  formData.unitCost = 0;
  formData.batchNo = '';
  formData.expiryDate = '';
  formData.remark = '';
  formRef.value?.reset();
};

// 批量导入相关
const handleBatchImport = () => {
  importDialogVisible.value = true;
  importResult.value = null;
  // 默认添加一行
  if (importData.value.length === 0) {
    addImportRow();
  }
};

// 添加导入行
const addImportRow = () => {
  importData.value.push({
    tempId: importTempId++,
    warehouseId: '',
    materialId: '',
    quantity: 0,
    unitCost: 0,
    batchNo: '',
    expiryDate: '',
    remark: ''
  });
};

// 删除导入行
const removeImportRow = (index: number) => {
  importData.value.splice(index, 1);
};

// 导入物料选择变化
const handleImportMaterialChange = (row: InitialInventoryFormData & { tempId: number }, value: string) => {
  const material = materialOptions.value.find(item => item.id === value);
  if (material) {
    row.unitCost = material.price;
  }
};

// 计算导入行总成本
const calculateImportTotalCost = (_row: InitialInventoryFormData & { tempId: number }) => {
  // 总成本在模板中直接计算
};

// 确认导入
const handleImportConfirm = async () => {
  // 验证数据
  const validData = importData.value.filter(item => item.warehouseId && item.materialId && item.quantity > 0);
  if (validData.length === 0) {
    MessagePlugin.warning('请至少填写一条有效数据');
    return;
  }

  importLoading.value = true;
  try {
    const result = await batchImportInitialInventory(validData);
    importResult.value = result;

    if (result.success > 0) {
      MessagePlugin.success(`成功导入 ${result.success} 条数据`);
      loadData();
    }

    if (result.failed === 0) {
      // 全部成功则关闭对话框
      setTimeout(() => {
        importDialogVisible.value = false;
      }, 1500);
    }
  } catch (error) {
    console.error('导入失败:', error);
    MessagePlugin.error('导入失败');
  } finally {
    importLoading.value = false;
  }
};

// 重置导入
const resetImport = () => {
  importData.value = [];
  importResult.value = null;
};

// 组件挂载时加载数据
onMounted(() => {
  loadOptions();
  loadData();
});
</script>

<style scoped lang="less">
.initial-page {
  height: 100%;
  padding: 24px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  .filter-section {
    background: #fff;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .filter-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .table-section {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }
}

// 表格单元格样式
.material-info {
  .material-name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .material-spec {
    font-size: 12px;
    color: #999;
  }
}

.cost-text {
  color: #666;

  &.total {
    color: #e34d59;
    font-weight: 500;
  }
}

.batch-info {
  font-size: 13px;
  color: #666;

  .expired {
    color: #e34d59;
  }

  .near-expiry {
    color: #ed7b2f;
  }
}

.operator-info {
  font-size: 13px;

  .create-time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
}

// 导入对话框
.import-content {
  .import-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
