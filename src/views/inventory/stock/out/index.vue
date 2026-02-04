<template>
  <div class="outbound-page">
    <div class="page-header">
      <h2 class="page-title">出库管理</h2>
      <t-space>
        <t-button theme="default" variant="outline" @click="handleExport">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="print" /></template>
          打印
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建出库单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          v-model="queryParams.type"
          placeholder="出库类型"
          clearable
          style="width: 140px;"
          @change="loadData"
        >
          <t-option value="sale" label="销售出库" />
          <t-option value="production" label="生产领料" />
          <t-option value="transfer" label="调拨出库" />
          <t-option value="loss" label="报损出库" />
          <t-option value="other" label="其他出库" />
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

        <t-input
          v-model="queryParams.keyword"
          placeholder="搜索单据编号"
          clearable
          style="width: 240px;"
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
            <div class="bill-date">{{ row.outboundDate }}</div>
          </div>
        </template>

        <!-- 出库类型列 -->
        <template #type="{ row }">
          <t-tag v-if="row.type === 'sale'" theme="primary" variant="light">销售出库</t-tag>
          <t-tag v-else-if="row.type === 'production'" theme="success" variant="light">生产领料</t-tag>
          <t-tag v-else-if="row.type === 'transfer'" theme="warning" variant="light">调拨出库</t-tag>
          <t-tag v-else-if="row.type === 'loss'" theme="danger" variant="light">报损出库</t-tag>
          <t-tag v-else variant="light">其他出库</t-tag>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <t-tag v-if="row.status === 'draft'" theme="default" variant="light">草稿</t-tag>
          <t-tag v-else-if="row.status === 'submitted'" theme="primary" variant="light">已提交</t-tag>
          <t-tag v-else-if="row.status === 'approved'" theme="warning" variant="light">已审核</t-tag>
          <t-tag v-else-if="row.status === 'completed'" theme="success" variant="light">已完成</t-tag>
          <t-tag v-else theme="danger" variant="light">已取消</t-tag>
        </template>

        <!-- 数量金额列 -->
        <template #amount="{ row }">
          <div class="amount-info">
            <div class="amount-row">数量: {{ row.totalQuantity }}</div>
            <div class="amount-row">金额: ¥{{ row.totalAmount.toFixed(2) }}</div>
          </div>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <t-space :size="0">
            <t-link theme="primary" @click="handleView(row)">查看</t-link>
            <t-divider layout="vertical" />
            <t-link v-if="row.status === 'draft'" theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link v-else theme="primary" @click="handlePrint(row)">打印</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 表单对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="dialogTitle"
      width="1000px"
      :footer="dialogMode === 'view' ? false : undefined"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: submitLoading }"
      :cancel-btn="{ content: '取消', theme: 'default' }"
      @confirm="handleSubmit"
      @close="resetForm"
    >
      <t-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        :disabled="dialogMode === 'view'"
        label-width="100px"
        class="outbound-form"
      >
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="出库类型" name="type">
              <t-select
                v-model="formData.type"
                placeholder="请选择出库类型"
                :disabled="dialogMode === 'view'"
                @change="handleTypeChange"
              >
                <t-option value="sale" label="销售出库" />
                <t-option value="production" label="生产领料" />
                <t-option value="transfer" label="调拨出库" />
                <t-option value="loss" label="报损出库" />
                <t-option value="other" label="其他出库" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="出库仓库" name="warehouseId">
              <t-select
                v-model="formData.warehouseId"
                placeholder="请选择仓库"
                :disabled="dialogMode === 'view'"
              >
                <t-option
                  v-for="warehouse in warehouseList"
                  :key="warehouse.id"
                  :value="String(warehouse.id)"
                  :label="warehouse.name"
                />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item :label="customerLabel" name="customerId">
              <t-select
                v-model="formData.customerId"
                :placeholder="`请选择${customerLabel}`"
                clearable
                :disabled="dialogMode === 'view' || !showCustomer"
              >
                <t-option
                  v-for="customer in filteredCustomerList"
                  :key="customer.id"
                  :value="customer.id"
                  :label="customer.name"
                />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="出库日期" name="outboundDate">
              <t-date-picker
                v-model="formData.outboundDate"
                placeholder="请选择出库日期"
                style="width: 100%;"
                :disabled="dialogMode === 'view'"
              />
            </t-form-item>
          </t-col>
        </t-row>

        <!-- 物料明细表格 -->
        <t-form-item label="出库明细" name="items" class="item-form-item">
          <div class="item-table-wrapper">
            <div class="item-table-header" v-if="dialogMode !== 'view'">
              <t-button theme="primary" variant="outline" size="small" @click="addItem">
                <template #icon><t-icon name="add" /></template>
                添加物料
              </t-button>
            </div>
            <t-table
              :data="formData.items"
              :columns="itemColumns"
              row-key="id"
              bordered
              size="small"
              max-height="300"
            >
              <!-- 物料选择列 -->
              <template #itemName="{ row, rowIndex }">
                <t-select
                  v-if="dialogMode !== 'view'"
                  v-model="row.itemId"
                  placeholder="选择物料/成品"
                  filterable
                  style="width: 100%;"
                  @change="(val: string) => handleItemSelect(val, rowIndex)"
                >
                  <t-option-group label="原材料">
                    <t-option
                      v-for="mat in materialList"
                      :key="mat.id"
                      :value="`material-${mat.id}`"
                      :label="`${mat.name} (${mat.code})`"
                    />
                  </t-option-group>
                  <t-option-group label="成品">
                    <t-option
                      v-for="prod in productList"
                      :key="prod.id"
                      :value="`product-${prod.id}`"
                      :label="`${prod.name} (${prod.code})`"
                    />
                  </t-option-group>
                </t-select>
                <span v-else>{{ row.itemName }}</span>
              </template>

              <!-- 数量输入列 -->
              <template #quantity="{ row }">
                <t-input-number
                  v-if="dialogMode !== 'view'"
                  v-model="row.quantity"
                  :min="1"
                  :max="99999"
                  theme="normal"
                  style="width: 100%;"
                  @change="calculateItemAmount(row)"
                />
                <span v-else>{{ row.quantity }}</span>
              </template>

              <!-- 单价列 -->
              <template #unitPrice="{ row }">
                <t-input-number
                  v-if="dialogMode !== 'view'"
                  v-model="row.unitPrice"
                  :min="0"
                  :max="999999"
                  :decimal-places="2"
                  theme="normal"
                  style="width: 100%;"
                  @change="calculateItemAmount(row)"
                />
                <span v-else>¥{{ (row.unitPrice || 0).toFixed(2) }}</span>
              </template>

              <!-- 金额列 -->
              <template #totalAmount="{ row }">
                <span class="amount-text">¥{{ (row.totalAmount || 0).toFixed(2) }}</span>
              </template>

              <!-- 操作列 -->
              <template #itemOperation="{ rowIndex }">
                <t-link
                  v-if="dialogMode !== 'view'"
                  theme="danger"
                  @click="removeItem(rowIndex)"
                >
                  删除
                </t-link>
              </template>
            </t-table>

            <!-- 合计 -->
            <div class="item-summary">
              <span>合计数量: <strong>{{ totalQuantity }}</strong></span>
              <span>合计金额: <strong class="amount-text">¥{{ totalAmount.toFixed(2) }}</strong></span>
            </div>
          </div>
        </t-form-item>

        <!-- 备注 -->
        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            placeholder="请输入备注信息"
            :maxlength="500"
            :disabled="dialogMode === 'view'"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type { PageInfo, FormInstanceFunctions, FormRule } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { OutboundBill, OutboundBillQuery, BillItem } from '@/types/bill';
import { OutboundType } from '@/types/bill';
import { getOutboundBills, getCustomerList, type Customer } from '@/api/bill';
import { getWarehouseList } from '@/api/warehouse';
import { getMaterialList } from '@/api/material';
import { getEnabledProducts } from '@/api/product';
import type { Warehouse } from '@/types/warehouse';
import type { Material } from '@/types/material';
import type { Product } from '@/types/product';

// 查询参数
const queryParams = reactive<OutboundBillQuery>({
  type: undefined,
  status: undefined,
  keyword: '',
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<OutboundBill[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 对话框状态
const formDialogVisible = ref(false);
const dialogMode = ref<'create' | 'edit' | 'view'>('create');
const submitLoading = ref(false);
const formRef = ref<FormInstanceFunctions>();

// 下拉选项数据
const warehouseList = ref<Warehouse[]>([]);
const customerList = ref<Customer[]>([]);
const materialList = ref<Material[]>([]);
const productList = ref<Product[]>([]);

// 表单数据
const getDefaultFormData = () => ({
  id: '',
  type: '' as OutboundType | '',
  warehouseId: '',
  customerId: '',
  outboundDate: '',
  items: [] as BillItem[],
  remark: ''
});

const formData = reactive(getDefaultFormData());

// 表单验证规则
const formRules: Record<string, FormRule[]> = {
  type: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择出库仓库', trigger: 'change' }],
  outboundDate: [{ required: true, message: '请选择出库日期', trigger: 'change' }],
  items: [{
    validator: () => formData.items.length > 0,
    message: '请至少添加一项出库物料',
    trigger: 'change'
  }]
};

// 是否显示客户/部门选择（销售出库显示客户，生产领料显示部门）
const showCustomer = computed(() => {
  return formData.type === OutboundType.SALE || formData.type === OutboundType.PRODUCTION;
});

// 客户标签（根据类型显示不同标签）
const customerLabel = computed(() => {
  if (formData.type === OutboundType.SALE) {
    return '客户';
  } else if (formData.type === OutboundType.PRODUCTION) {
    return '领料部门';
  }
  return '客户/部门';
});

// 根据出库类型过滤客户列表
const filteredCustomerList = computed(() => {
  if (formData.type === OutboundType.SALE) {
    return customerList.value.filter(c => c.type === 'customer');
  } else if (formData.type === OutboundType.PRODUCTION) {
    return customerList.value.filter(c => c.type === 'department');
  }
  return customerList.value;
});

// 计算合计数量
const totalQuantity = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
});

// 计算合计金额
const totalAmount = computed(() => {
  return formData.items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
});

// 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    create: '新建出库单',
    edit: '编辑出库单',
    view: '查看出库单'
  };
  return titles[dialogMode.value];
});

// 表格列配置
const columns = [
  { colKey: 'billInfo', title: '单据信息', width: 180, cell: 'billInfo' },
  { colKey: 'type', title: '出库类型', width: 120, cell: 'type' },
  { colKey: 'warehouseName', title: '出库仓库', width: 120 },
  { colKey: 'customerName', title: '客户/部门', width: 150 },
  { colKey: 'amount', title: '数量/金额', width: 140, cell: 'amount' },
  { colKey: 'operator', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 150, fixed: 'right', cell: 'operation' }
];

// 明细表格列配置
const itemColumns = computed(() => {
  const cols = [
    { colKey: 'itemName', title: '物料/成品', width: 200, cell: 'itemName' },
    { colKey: 'itemCode', title: '编码', width: 120 },
    { colKey: 'specification', title: '规格', width: 100 },
    { colKey: 'unit', title: '单位', width: 80 },
    { colKey: 'quantity', title: '数量', width: 120, cell: 'quantity' },
    { colKey: 'unitPrice', title: '单价', width: 120, cell: 'unitPrice' },
    { colKey: 'totalAmount', title: '金额', width: 120, cell: 'totalAmount' }
  ];

  if (dialogMode.value !== 'view') {
    cols.push({ colKey: 'itemOperation', title: '操作', width: 80, cell: 'itemOperation' });
  }

  return cols;
});

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    };

    const { list, total } = await getOutboundBills(params);
    tableData.value = list;
    pagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 加载下拉选项数据
const loadOptions = async () => {
  try {
    // 并行加载所有选项数据
    const [warehouseRes, customers, materialRes, products] = await Promise.all([
      getWarehouseList({ page: 1, pageSize: 100 }),
      getCustomerList(),
      getMaterialList({ page: 1, pageSize: 100 }),
      getEnabledProducts()
    ]);

    warehouseList.value = warehouseRes.data.list.filter((w: Warehouse) => w.status);
    customerList.value = customers;
    materialList.value = materialRes.data.list.filter((m: Material) => m.status);
    productList.value = products;
  } catch (error) {
    console.error('加载选项数据失败:', error);
  }
};

// 处理页码变化
const handlePageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  loadData();
};

// 处理新建
const handleCreate = () => {
  dialogMode.value = 'create';
  resetForm();
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: OutboundBill) => {
  dialogMode.value = 'view';
  fillForm(row);
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: OutboundBill) => {
  dialogMode.value = 'edit';
  fillForm(row);
  formDialogVisible.value = true;
};

// 填充表单数据
const fillForm = (row: OutboundBill) => {
  formData.id = row.id;
  formData.type = row.type;
  formData.warehouseId = row.warehouseId;
  formData.customerId = row.customerId || '';
  formData.outboundDate = row.outboundDate;
  formData.remark = row.remark || '';
  formData.items = row.items.map(item => ({ ...item }));
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, getDefaultFormData());
  formRef.value?.clearValidate();
};

// 处理出库类型变化
const handleTypeChange = () => {
  if (!showCustomer.value) {
    formData.customerId = '';
  } else {
    // 切换类型时清空选择，因为客户类型可能不同
    formData.customerId = '';
  }
};

// 添加明细项
const addItem = () => {
  const newItem: BillItem = {
    id: `item-${Date.now()}`,
    itemId: '',
    itemName: '',
    itemCode: '',
    itemType: 'material',
    specification: '',
    unit: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0
  };
  formData.items.push(newItem);
};

// 删除明细项
const removeItem = (index: number) => {
  formData.items.splice(index, 1);
};

// 处理物料选择
const handleItemSelect = (value: string, rowIndex: number) => {
  if (!value) return;

  const [type, id] = value.split('-');
  const item = formData.items[rowIndex];

  if (type === 'material') {
    const material = materialList.value.find(m => String(m.id) === id);
    if (material) {
      item.itemId = `material-${material.id}`;
      item.itemName = material.name;
      item.itemCode = material.code;
      item.itemType = 'material';
      item.specification = material.spec || '';
      item.unit = material.unit;
      item.unitPrice = material.purchasePrice || 0;
      calculateItemAmount(item);
    }
  } else if (type === 'product') {
    const product = productList.value.find(p => p.id === id);
    if (product) {
      item.itemId = `product-${product.id}`;
      item.itemName = product.name;
      item.itemCode = product.code;
      item.itemType = 'product';
      item.specification = product.specification || '';
      item.unit = product.unit;
      item.unitPrice = product.salePrice || product.costPrice || 0;
      calculateItemAmount(item);
    }
  }
};

// 计算明细项金额
const calculateItemAmount = (item: BillItem) => {
  item.totalAmount = (item.quantity || 0) * (item.unitPrice || 0);
};

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid !== true) return;

  // 验证明细项
  if (formData.items.length === 0) {
    MessagePlugin.warning('请至少添加一项出库物料');
    return;
  }

  // 验证每项物料是否已选择
  const invalidItems = formData.items.filter(item => !item.itemId || !item.itemName);
  if (invalidItems.length > 0) {
    MessagePlugin.warning('请完善物料明细信息');
    return;
  }

  submitLoading.value = true;
  try {
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 500));

    MessagePlugin.success(dialogMode.value === 'create' ? '创建成功' : '保存成功');
    formDialogVisible.value = false;
    loadData();
  } catch (error) {
    console.error('保存失败:', error);
    MessagePlugin.error('保存失败');
  } finally {
    submitLoading.value = false;
  }
};

// 处理打印
const handlePrint = (row: OutboundBill) => {
  MessagePlugin.info('打印功能开发中...');
};

// 处理导出
const handleExport = () => {
  if (tableData.value.length === 0) {
    MessagePlugin.warning('暂无数据可导出');
    return;
  }

  // 定义类型映射
  const typeMap: Record<string, string> = {
    sale: '销售出库',
    production: '生产领料',
    transfer: '调拨出库',
    loss: '报损出库',
    other: '其他出库'
  };

  const statusMap: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    approved: '已审核',
    completed: '已完成',
    cancelled: '已取消'
  };

  // 构建CSV内容
  const headers = ['单据编号', '出库类型', '出库仓库', '客户/部门', '总数量', '总金额', '状态', '操作人', '创建时间'];
  const rows = tableData.value.map(row => [
    row.billNo,
    typeMap[row.type] || row.type,
    row.warehouseName,
    row.customerName || '-',
    row.totalQuantity,
    row.totalAmount.toFixed(2),
    statusMap[row.status] || row.status,
    row.operator || '-',
    row.createTime
  ]);

  // 添加BOM头以支持中文
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `出库单_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  MessagePlugin.success('导出成功');
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
  loadOptions();
});
</script>

<style scoped lang="less">
.outbound-page {
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

// 表单样式
.outbound-form {
  .item-form-item {
    :deep(.t-form__label) {
      align-self: flex-start;
      padding-top: 8px;
    }
  }

  .item-table-wrapper {
    width: 100%;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    overflow: hidden;

    .item-table-header {
      padding: 12px;
      background: #fafafa;
      border-bottom: 1px solid #e7e7e7;
    }

    .item-summary {
      display: flex;
      justify-content: flex-end;
      gap: 24px;
      padding: 12px 16px;
      background: #fafafa;
      border-top: 1px solid #e7e7e7;
      font-size: 14px;
      color: #666;

      strong {
        color: #333;
        margin-left: 4px;
      }
    }
  }

  .amount-text {
    color: #e34d59;
    font-weight: 500;
  }
}
</style>
