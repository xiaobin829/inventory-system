<template>
  <div class="order-page">
    <div class="page-header">
      <h2 class="page-title">订货管理</h2>
      <t-space>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建订货单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          v-model="queryParams.supplierId"
          placeholder="选择供应商"
          clearable
          style="width: 180px;"
          @change="loadData"
        >
          <t-option
            v-for="supplier in supplierList"
            :key="supplier.id"
            :value="supplier.id"
            :label="supplier.name"
          />
        </t-select>

        <t-select
          v-model="queryParams.status"
          placeholder="单据状态"
          clearable
          style="width: 130px;"
          @change="loadData"
        >
          <t-option value="draft" label="草稿" />
          <t-option value="submitted" label="已提交" />
          <t-option value="approved" label="已审核" />
          <t-option value="completed" label="已完成" />
          <t-option value="cancelled" label="已取消" />
        </t-select>

        <t-date-range-picker
          v-model="dateRange"
          placeholder="选择日期范围"
          style="width: 260px;"
          @change="handleDateChange"
        />

        <t-input
          v-model="queryParams.keyword"
          placeholder="搜索单据编号/供应商"
          clearable
          style="width: 200px;"
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
        <!-- 单据信息列 -->
        <template #billInfo="{ row }">
          <div class="bill-info">
            <div class="bill-no">{{ row.billNo }}</div>
            <div class="bill-date">{{ row.date }}</div>
          </div>
        </template>

        <!-- 数量/金额列 -->
        <template #amount="{ row }">
          <div class="amount-info">
            <div class="amount-row">数量: {{ getTotalQuantity(row) }}</div>
            <div class="amount-row">金额: ¥{{ row.totalAmount.toFixed(2) }}</div>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <t-tag v-if="row.status === 'draft'" theme="default" variant="light">草稿</t-tag>
          <t-tag v-else-if="row.status === 'submitted'" theme="primary" variant="light">已提交</t-tag>
          <t-tag v-else-if="row.status === 'approved'" theme="warning" variant="light">已审核</t-tag>
          <t-tag v-else-if="row.status === 'completed'" theme="success" variant="light">已完成</t-tag>
          <t-tag v-else theme="danger" variant="light">已取消</t-tag>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <t-space :size="0">
            <t-link theme="primary" @click="handleView(row)">查看</t-link>
            <template v-if="row.status === 'draft'">
              <t-divider layout="vertical" />
              <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
              <t-divider layout="vertical" />
              <t-link theme="primary" @click="handleSubmit(row)">提交</t-link>
            </template>
            <t-divider layout="vertical" />
            <t-popconfirm content="确定删除该订货单吗？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 表单对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="dialogTitle"
      width="1000px"
      :footer="isViewMode ? false : undefined"
      @confirm="handleFormSubmit"
    >
      <t-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        label-width="100px"
        :disabled="isViewMode"
      >
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="供应商" name="supplierId">
              <t-select
                v-model="formData.supplierId"
                placeholder="请选择供应商"
                @change="handleSupplierChange"
              >
                <t-option
                  v-for="supplier in supplierList"
                  :key="supplier.id"
                  :value="supplier.id"
                  :label="supplier.name"
                />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="订货日期" name="date">
              <t-date-picker
                v-model="formData.date"
                placeholder="请选择日期"
                style="width: 100%;"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="交货日期" name="deliveryDate">
              <t-date-picker
                v-model="formData.deliveryDate"
                placeholder="请选择交货日期"
                style="width: 100%;"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="操作人">
              <t-input :value="formData.operatorName" disabled />
            </t-form-item>
          </t-col>
        </t-row>

        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            placeholder="请输入备注"
            :maxlength="200"
          />
        </t-form-item>

        <!-- 物料明细表格 -->
        <div class="items-section">
          <div class="items-header">
            <span class="items-title">物料明细</span>
            <t-button
              v-if="!isViewMode"
              theme="primary"
              variant="text"
              @click="handleAddItem"
            >
              <template #icon><t-icon name="add" /></template>
              添加物料
            </t-button>
          </div>
          <t-table
            :data="formData.items"
            :columns="itemColumns"
            row-key="materialId"
            size="small"
            bordered
          >
            <template #quantity="{ row, rowIndex }">
              <t-input-number
                v-if="!isViewMode"
                v-model="row.quantity"
                :min="1"
                theme="normal"
                style="width: 100px;"
                @change="handleItemChange(rowIndex)"
              />
              <span v-else>{{ row.quantity }}</span>
            </template>
            <template #unitPrice="{ row, rowIndex }">
              <t-input-number
                v-if="!isViewMode"
                v-model="row.unitPrice"
                :min="0"
                :decimal-places="2"
                theme="normal"
                style="width: 100px;"
                @change="handleItemChange(rowIndex)"
              />
              <span v-else>¥{{ row.unitPrice.toFixed(2) }}</span>
            </template>
            <template #totalPrice="{ row }">
              <span class="total-price">¥{{ row.totalPrice.toFixed(2) }}</span>
            </template>
            <template #itemOperation="{ rowIndex }">
              <t-link v-if="!isViewMode" theme="danger" @click="handleRemoveItem(rowIndex)">删除</t-link>
            </template>
          </t-table>
          <div class="items-footer">
            <span class="total-label">合计金额：</span>
            <span class="total-amount">¥{{ calculateTotalAmount().toFixed(2) }}</span>
          </div>
        </div>
      </t-form>
    </t-dialog>

    <!-- 添加物料对话框 -->
    <t-dialog
      v-model:visible="materialDialogVisible"
      header="选择物料"
      width="600px"
      @confirm="handleMaterialConfirm"
    >
      <t-table
        :data="materialList"
        :columns="materialColumns"
        row-key="id"
        size="small"
        :selected-row-keys="selectedMaterialIds"
        @select-change="handleMaterialSelect"
      />
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { PageInfo, FormInstanceFunctions } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { PurchaseOrder, PurchaseOrderQuery, PurchaseOrderDetail } from '@/types/bill';
import { getPurchaseOrders, deletePurchaseOrder, submitPurchaseOrder } from '@/api/bill';
import { getEnabledSuppliers } from '@/api/supplier';
import { getMaterialList } from '@/api/material';
import type { Supplier } from '@/types/supplier';
import type { Material } from '@/types/material';

// 供应商列表
const supplierList = ref<Supplier[]>([]);

// 物料列表
const materialList = ref<Material[]>([]);

// 日期范围
const dateRange = ref<string[]>([]);

// 查询参数
const queryParams = reactive<PurchaseOrderQuery>({
  supplierId: undefined,
  status: undefined,
  keyword: '',
  startDate: undefined,
  endDate: undefined,
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<PurchaseOrder[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 对话框状态
const formDialogVisible = ref(false);
const materialDialogVisible = ref(false);
const isViewMode = ref(false);
const isEditMode = ref(false);
const currentEditId = ref<string | null>(null);

// 表单引用
const formRef = ref<FormInstanceFunctions>();

// 表单数据
const formData = reactive({
  supplierId: '',
  supplierName: '',
  date: '',
  deliveryDate: '',
  remark: '',
  operatorName: '当前用户',
  items: [] as PurchaseOrderDetail[]
});

// 表单验证规则
const formRules = {
  supplierId: [{ required: true, message: '请选择供应商' }],
  date: [{ required: true, message: '请选择订货日期' }],
  deliveryDate: [{ required: true, message: '请选择交货日期' }]
};

// 选中的物料ID
const selectedMaterialIds = ref<(string | number)[]>([]);

// 对话框标题
const dialogTitle = computed(() => {
  if (isViewMode.value) return '查看订货单';
  if (isEditMode.value) return '编辑订货单';
  return '新建订货单';
});

// 表格列配置
const columns = [
  { colKey: 'billInfo', title: '单据信息', width: 180, cell: 'billInfo' },
  { colKey: 'supplierName', title: '供应商', width: 160 },
  { colKey: 'amount', title: '数量/金额', width: 140, cell: 'amount' },
  { colKey: 'deliveryDate', title: '交货日期', width: 120 },
  { colKey: 'operatorName', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 200, fixed: 'right', cell: 'operation' }
];

// 明细表格列配置
const itemColumns = [
  { colKey: 'materialName', title: '物料名称', width: 150 },
  { colKey: 'specification', title: '规格', width: 120 },
  { colKey: 'unit', title: '单位', width: 80 },
  { colKey: 'quantity', title: '数量', width: 120, cell: 'quantity' },
  { colKey: 'unitPrice', title: '单价', width: 120, cell: 'unitPrice' },
  { colKey: 'totalPrice', title: '金额', width: 120, cell: 'totalPrice' },
  { colKey: 'operation', title: '操作', width: 80, cell: 'itemOperation' }
];

// 物料选择表格列配置
const materialColumns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { colKey: 'code', title: '物料编码', width: 120 },
  { colKey: 'name', title: '物料名称', width: 150 },
  { colKey: 'spec', title: '规格', width: 120 },
  { colKey: 'unit', title: '单位', width: 80 },
  { colKey: 'purchasePrice', title: '采购价', width: 100 }
];

// 获取物料总数量
const getTotalQuantity = (row: PurchaseOrder) => {
  return row.items.reduce((sum, item) => sum + item.quantity, 0);
};

// 计算合计金额
const calculateTotalAmount = () => {
  return formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
};

// 加载供应商列表
const loadSuppliers = async () => {
  try {
    const data = await getEnabledSuppliers();
    supplierList.value = data;
  } catch (error) {
    console.error('加载供应商失败:', error);
  }
};

// 加载物料列表
const loadMaterials = async () => {
  try {
    const res = await getMaterialList({ page: 1, pageSize: 100 });
    if (res.code === 0) {
      materialList.value = res.data.list;
    }
  } catch (error) {
    console.error('加载物料失败:', error);
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

    const { list, total } = await getPurchaseOrders(params);
    tableData.value = list;
    pagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 处理日期变化
const handleDateChange = (val: string[]) => {
  if (val && val.length === 2) {
    queryParams.startDate = val[0];
    queryParams.endDate = val[1];
  } else {
    queryParams.startDate = undefined;
    queryParams.endDate = undefined;
  }
  loadData();
};

// 处理页码变化
const handlePageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  loadData();
};

// 重置表单
const resetForm = () => {
  formData.supplierId = '';
  formData.supplierName = '';
  formData.date = '';
  formData.deliveryDate = '';
  formData.remark = '';
  formData.operatorName = '当前用户';
  formData.items = [];
  currentEditId.value = null;
};

// 处理新建
const handleCreate = () => {
  resetForm();
  isViewMode.value = false;
  isEditMode.value = false;
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: PurchaseOrder) => {
  resetForm();
  formData.supplierId = row.supplierId;
  formData.supplierName = row.supplierName;
  formData.date = row.date;
  formData.deliveryDate = row.deliveryDate;
  formData.remark = row.remark || '';
  formData.operatorName = row.operatorName;
  formData.items = [...row.items];
  isViewMode.value = true;
  isEditMode.value = false;
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: PurchaseOrder) => {
  resetForm();
  formData.supplierId = row.supplierId;
  formData.supplierName = row.supplierName;
  formData.date = row.date;
  formData.deliveryDate = row.deliveryDate;
  formData.remark = row.remark || '';
  formData.operatorName = row.operatorName;
  formData.items = [...row.items];
  currentEditId.value = row.id;
  isViewMode.value = false;
  isEditMode.value = true;
  formDialogVisible.value = true;
};

// 处理提交订货单
const handleSubmit = async (row: PurchaseOrder) => {
  try {
    await submitPurchaseOrder(row.id);
    MessagePlugin.success('提交成功');
    loadData();
  } catch (error) {
    console.error('提交失败:', error);
    MessagePlugin.error('提交失败');
  }
};

// 处理删除
const handleDelete = async (row: PurchaseOrder) => {
  try {
    await deletePurchaseOrder(row.id);
    MessagePlugin.success('删除成功');
    loadData();
  } catch (error) {
    console.error('删除失败:', error);
    MessagePlugin.error('删除失败');
  }
};

// 处理供应商变化
const handleSupplierChange = (val: string) => {
  const supplier = supplierList.value.find(s => s.id === val);
  formData.supplierName = supplier?.name || '';
};

// 处理添加物料
const handleAddItem = () => {
  selectedMaterialIds.value = formData.items.map(item => item.materialId);
  materialDialogVisible.value = true;
};

// 处理物料选择
const handleMaterialSelect = (selectedRowKeys: (string | number)[]) => {
  selectedMaterialIds.value = selectedRowKeys;
};

// 处理物料确认
const handleMaterialConfirm = () => {
  const existingIds = formData.items.map(item => item.materialId);

  selectedMaterialIds.value.forEach(id => {
    if (!existingIds.includes(String(id))) {
      const material = materialList.value.find(m => m.id === id);
      if (material) {
        formData.items.push({
          materialId: String(material.id),
          materialName: material.name,
          specification: material.spec,
          unit: material.unit,
          quantity: 1,
          unitPrice: material.purchasePrice || 0,
          totalPrice: material.purchasePrice || 0
        });
      }
    }
  });

  // 移除取消选择的物料
  formData.items = formData.items.filter(item =>
    selectedMaterialIds.value.includes(item.materialId) ||
    selectedMaterialIds.value.includes(Number(item.materialId))
  );

  materialDialogVisible.value = false;
};

// 处理物料数量/单价变化
const handleItemChange = (index: number) => {
  const item = formData.items[index];
  item.totalPrice = item.quantity * item.unitPrice;
};

// 处理移除物料
const handleRemoveItem = (index: number) => {
  formData.items.splice(index, 1);
};

// 处理表单提交
const handleFormSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid !== true) return;

  if (formData.items.length === 0) {
    MessagePlugin.warning('请添加物料明细');
    return;
  }

  // Mock: 这里只是模拟保存，实际项目中需要调用API
  MessagePlugin.success(isEditMode.value ? '编辑成功' : '创建成功');
  formDialogVisible.value = false;
  loadData();
};

// 组件挂载时加载数据
onMounted(() => {
  loadSuppliers();
  loadMaterials();
  loadData();
});
</script>

<style scoped lang="less">
.order-page {
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
.bill-info {
  .bill-no {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .bill-date {
    font-size: 12px;
    color: #999;
  }
}

.amount-info {
  font-size: 13px;

  .amount-row {
    margin-bottom: 4px;
    color: #666;

    &:last-child {
      margin-bottom: 0;
      color: #e34d59;
      font-weight: 500;
    }
  }
}

// 物料明细区域样式
.items-section {
  margin-top: 16px;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  padding: 16px;

  .items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .items-title {
      font-weight: 500;
      color: #333;
    }
  }

  .items-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e7e7e7;

    .total-label {
      color: #666;
      margin-right: 8px;
    }

    .total-amount {
      font-size: 18px;
      font-weight: 600;
      color: #e34d59;
    }
  }
}

.total-price {
  color: #e34d59;
  font-weight: 500;
}
</style>
