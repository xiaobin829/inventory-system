<template>
  <div class="production-page">
    <div class="page-header">
      <h2 class="page-title">生产加工</h2>
      <t-space>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建生产单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          v-model="queryParams.productId"
          placeholder="选择成品"
          clearable
          style="width: 180px;"
          @change="loadData"
        >
          <t-option
            v-for="product in productList"
            :key="product.id"
            :value="product.id"
            :label="product.name"
          />
        </t-select>

        <div class="status-buttons">
          <t-button
            :theme="!queryParams.status ? 'primary' : 'default'"
            :variant="!queryParams.status ? 'base' : 'outline'"
            size="small"
            @click="handleStatusFilter(undefined)"
          >
            全部
          </t-button>
          <t-button
            :theme="queryParams.status === ProductionStatus.DRAFT ? 'primary' : 'default'"
            :variant="queryParams.status === ProductionStatus.DRAFT ? 'base' : 'outline'"
            size="small"
            @click="handleStatusFilter(ProductionStatus.DRAFT)"
          >
            草稿
          </t-button>
          <t-button
            :theme="queryParams.status === ProductionStatus.PROCESSING ? 'primary' : 'default'"
            :variant="queryParams.status === ProductionStatus.PROCESSING ? 'base' : 'outline'"
            size="small"
            @click="handleStatusFilter(ProductionStatus.PROCESSING)"
          >
            生产中
          </t-button>
          <t-button
            :theme="queryParams.status === ProductionStatus.COMPLETED ? 'primary' : 'default'"
            :variant="queryParams.status === ProductionStatus.COMPLETED ? 'base' : 'outline'"
            size="small"
            @click="handleStatusFilter(ProductionStatus.COMPLETED)"
          >
            已完成
          </t-button>
          <t-button
            :theme="queryParams.status === ProductionStatus.CANCELLED ? 'primary' : 'default'"
            :variant="queryParams.status === ProductionStatus.CANCELLED ? 'base' : 'outline'"
            size="small"
            @click="handleStatusFilter(ProductionStatus.CANCELLED)"
          >
            已取消
          </t-button>
        </div>

        <t-date-range-picker
          v-model="dateRange"
          placeholder="选择日期范围"
          style="width: 260px;"
          @change="handleDateChange"
        />

        <t-input
          v-model="queryParams.keyword"
          placeholder="搜索单据编号/成品名称"
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
        <template #orderInfo="{ row }">
          <div class="order-info">
            <div class="order-no">{{ row.orderNo }}</div>
            <div class="order-date">{{ row.date }}</div>
          </div>
        </template>

        <!-- 数量列 -->
        <template #quantity="{ row }">
          <div class="quantity-info">
            <div class="quantity-row">计划: {{ row.planQuantity }}</div>
            <div class="quantity-row actual">实际: {{ row.actualQuantity || '-' }}</div>
          </div>
        </template>

        <!-- 物料数量列 -->
        <template #materialsCount="{ row }">
          <t-tag theme="primary" variant="light">{{ row.materials.length }} 种</t-tag>
        </template>

        <!-- 时间列 -->
        <template #timeRange="{ row }">
          <div class="time-info">
            <div v-if="row.startTime" class="time-row">开始: {{ formatTime(row.startTime) }}</div>
            <div v-if="row.endTime" class="time-row">结束: {{ formatTime(row.endTime) }}</div>
            <div v-if="!row.startTime && !row.endTime" class="time-row empty">-</div>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <t-tag v-if="row.status === ProductionStatus.DRAFT" theme="default" variant="light">草稿</t-tag>
          <t-tag v-else-if="row.status === ProductionStatus.PROCESSING" theme="warning" variant="light">生产中</t-tag>
          <t-tag v-else-if="row.status === ProductionStatus.COMPLETED" theme="success" variant="light">已完成</t-tag>
          <t-tag v-else theme="danger" variant="light">已取消</t-tag>
        </template>

        <!-- 操作列 -->
        <template #operation="{ row }">
          <t-space :size="0">
            <t-link theme="primary" @click="handleView(row)">查看</t-link>
            <template v-if="row.status === ProductionStatus.DRAFT">
              <t-divider layout="vertical" />
              <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
              <t-divider layout="vertical" />
              <t-popconfirm content="确定开始生产吗？" @confirm="handleStart(row)">
                <t-link theme="primary">开始</t-link>
              </t-popconfirm>
            </template>
            <template v-if="row.status === ProductionStatus.PROCESSING">
              <t-divider layout="vertical" />
              <t-link theme="primary" @click="handleComplete(row)">完成</t-link>
            </template>
            <template v-if="row.status === ProductionStatus.DRAFT">
              <t-divider layout="vertical" />
              <t-popconfirm content="确定删除该生产单吗？" @confirm="handleDelete(row)">
                <t-link theme="danger">删除</t-link>
              </t-popconfirm>
            </template>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 表单对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="dialogTitle"
      width="900px"
      :footer="isViewMode ? false : undefined"
      :confirm-btn="isCompleteMode ? { content: '完成生产', theme: 'primary' } : undefined"
      @confirm="handleFormSubmit"
    >
      <t-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        label-width="100px"
        :disabled="isViewMode && !isCompleteMode"
      >
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="成品" name="productId">
              <t-select
                v-model="formData.productId"
                placeholder="请选择成品"
                :disabled="isEditMode || isViewMode"
                @change="handleProductChange"
              >
                <t-option
                  v-for="product in productList"
                  :key="product.id"
                  :value="product.id"
                  :label="product.name"
                />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="生产日期" name="date">
              <t-date-picker
                v-model="formData.date"
                placeholder="请选择日期"
                style="width: 100%;"
                :disabled="isViewMode"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="计划数量" name="planQuantity">
              <t-input-number
                v-model="formData.planQuantity"
                :min="1"
                theme="normal"
                style="width: 100%;"
                :disabled="isViewMode"
                @change="handlePlanQuantityChange"
              />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="操作人">
              <t-input :value="formData.operatorName" disabled />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row v-if="isCompleteMode" :gutter="16">
          <t-col :span="6">
            <t-form-item label="实际数量" name="actualQuantity">
              <t-input-number
                v-model="formData.actualQuantity"
                :min="0"
                theme="normal"
                style="width: 100%;"
              />
            </t-form-item>
          </t-col>
        </t-row>

        <t-row v-if="isViewMode && !isCompleteMode" :gutter="16">
          <t-col :span="6">
            <t-form-item label="开始时间">
              <t-input :value="formData.startTime || '-'" disabled />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="结束时间">
              <t-input :value="formData.endTime || '-'" disabled />
            </t-form-item>
          </t-col>
        </t-row>

        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            placeholder="请输入备注"
            :maxlength="200"
            :disabled="isViewMode && !isCompleteMode"
          />
        </t-form-item>

        <!-- 物料明细表格 -->
        <div class="materials-section">
          <div class="materials-header">
            <span class="materials-title">物料消耗明细</span>
          </div>
          <t-table
            :data="formData.materials"
            :columns="materialColumns"
            row-key="materialId"
            size="small"
            bordered
          >
            <template #planQuantity="{ row }">
              <span>{{ row.planQuantity }} {{ row.unit }}</span>
            </template>
            <template #actualQuantity="{ row, rowIndex }">
              <t-input-number
                v-if="isCompleteMode"
                v-model="row.actualQuantity"
                :min="0"
                theme="normal"
                style="width: 120px;"
              />
              <span v-else>{{ row.actualQuantity || '-' }} {{ row.actualQuantity ? row.unit : '' }}</span>
            </template>
          </t-table>
        </div>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { PageInfo, FormInstanceFunctions } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { ProductionOrder, ProductionOrderQuery, ProductionMaterial } from '@/types/production';
import { ProductionStatus } from '@/types/production';
import {
  getProductionOrders,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
  startProduction,
  completeProduction
} from '@/api/production';
import { getEnabledProducts } from '@/api/product';
import type { Product } from '@/types/product';

// 成品列表
const productList = ref<Product[]>([]);

// 日期范围
const dateRange = ref<string[]>([]);

// 查询参数
const queryParams = reactive<ProductionOrderQuery>({
  productId: undefined,
  status: undefined,
  keyword: '',
  startDate: undefined,
  endDate: undefined,
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<ProductionOrder[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 对话框状态
const formDialogVisible = ref(false);
const isViewMode = ref(false);
const isEditMode = ref(false);
const isCompleteMode = ref(false);
const currentEditId = ref<string | null>(null);

// 表单引用
const formRef = ref<FormInstanceFunctions>();

// 表单数据
const formData = reactive({
  productId: '',
  productName: '',
  date: '',
  planQuantity: 1,
  actualQuantity: 0,
  materials: [] as ProductionMaterial[],
  remark: '',
  operatorName: '当前用户',
  startTime: '',
  endTime: ''
});

// 表单验证规则
const formRules = {
  productId: [{ required: true, message: '请选择成品' }],
  date: [{ required: true, message: '请选择生产日期' }],
  planQuantity: [{ required: true, message: '请输入计划数量' }]
};

// 对话框标题
const dialogTitle = computed(() => {
  if (isCompleteMode.value) return '完成生产';
  if (isViewMode.value) return '查看生产单';
  if (isEditMode.value) return '编辑生产单';
  return '新建生产单';
});

// 表格列配置
const columns = [
  { colKey: 'orderInfo', title: '单据信息', width: 160, cell: 'orderInfo' },
  { colKey: 'productName', title: '成品名称', width: 140 },
  { colKey: 'quantity', title: '计划/实际数量', width: 130, cell: 'quantity' },
  { colKey: 'materialsCount', title: '物料种类', width: 100, cell: 'materialsCount' },
  { colKey: 'timeRange', title: '开始-结束时间', width: 160, cell: 'timeRange' },
  { colKey: 'operatorName', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 200, fixed: 'right', cell: 'operation' }
];

// 物料表格列配置
const materialColumns = [
  { colKey: 'materialName', title: '物料名称', width: 160 },
  { colKey: 'planQuantity', title: '计划用量', width: 140, cell: 'planQuantity' },
  { colKey: 'actualQuantity', title: '实际用量', width: 160, cell: 'actualQuantity' }
];

// 格式化时间显示
const formatTime = (timeStr: string) => {
  if (!timeStr) return '-';
  return timeStr.substring(5, 16).replace('T', ' ');
};

// 处理状态筛选
const handleStatusFilter = (status: ProductionStatus | undefined) => {
  queryParams.status = status;
  pagination.current = 1;
  loadData();
};

// 加载成品列表
const loadProducts = async () => {
  try {
    const data = await getEnabledProducts();
    productList.value = data;
  } catch (error) {
    console.error('加载成品失败:', error);
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

    const { list, total } = await getProductionOrders(params);
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
  formData.productId = '';
  formData.productName = '';
  formData.date = '';
  formData.planQuantity = 1;
  formData.actualQuantity = 0;
  formData.materials = [];
  formData.remark = '';
  formData.operatorName = '当前用户';
  formData.startTime = '';
  formData.endTime = '';
  currentEditId.value = null;
};

// 处理成品选择变化
const handleProductChange = (val: string) => {
  const product = productList.value.find(p => p.id === val);
  if (product) {
    formData.productName = product.name;
    // 根据成品的BOM生成物料消耗明细
    if (product.bomItems && product.bomItems.length > 0) {
      formData.materials = product.bomItems.map(item => ({
        materialId: item.materialId,
        materialName: item.materialName,
        planQuantity: item.quantity * formData.planQuantity,
        actualQuantity: 0,
        unit: item.unit
      }));
    } else {
      formData.materials = [];
    }
  }
};

// 处理计划数量变化
const handlePlanQuantityChange = () => {
  const product = productList.value.find(p => p.id === formData.productId);
  if (product && product.bomItems) {
    formData.materials = product.bomItems.map(item => ({
      materialId: item.materialId,
      materialName: item.materialName,
      planQuantity: item.quantity * formData.planQuantity,
      actualQuantity: 0,
      unit: item.unit
    }));
  }
};

// 处理新建
const handleCreate = () => {
  resetForm();
  isViewMode.value = false;
  isEditMode.value = false;
  isCompleteMode.value = false;
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: ProductionOrder) => {
  resetForm();
  formData.productId = row.productId;
  formData.productName = row.productName;
  formData.date = row.date;
  formData.planQuantity = row.planQuantity;
  formData.actualQuantity = row.actualQuantity;
  formData.materials = [...row.materials];
  formData.remark = row.remark || '';
  formData.operatorName = row.operatorName;
  formData.startTime = row.startTime || '';
  formData.endTime = row.endTime || '';
  isViewMode.value = true;
  isEditMode.value = false;
  isCompleteMode.value = false;
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: ProductionOrder) => {
  resetForm();
  formData.productId = row.productId;
  formData.productName = row.productName;
  formData.date = row.date;
  formData.planQuantity = row.planQuantity;
  formData.actualQuantity = row.actualQuantity;
  formData.materials = [...row.materials];
  formData.remark = row.remark || '';
  formData.operatorName = row.operatorName;
  currentEditId.value = row.id;
  isViewMode.value = false;
  isEditMode.value = true;
  isCompleteMode.value = false;
  formDialogVisible.value = true;
};

// 处理开始生产
const handleStart = async (row: ProductionOrder) => {
  try {
    await startProduction(row.id);
    MessagePlugin.success('已开始生产');
    loadData();
  } catch (error: any) {
    console.error('开始生产失败:', error);
    MessagePlugin.error(error.message || '开始生产失败');
  }
};

// 处理完成生产
const handleComplete = (row: ProductionOrder) => {
  resetForm();
  formData.productId = row.productId;
  formData.productName = row.productName;
  formData.date = row.date;
  formData.planQuantity = row.planQuantity;
  formData.actualQuantity = row.planQuantity; // 默认实际数量等于计划数量
  formData.materials = row.materials.map(m => ({
    ...m,
    actualQuantity: m.planQuantity // 默认实际用量等于计划用量
  }));
  formData.remark = row.remark || '';
  formData.operatorName = row.operatorName;
  formData.startTime = row.startTime || '';
  currentEditId.value = row.id;
  isViewMode.value = true;
  isEditMode.value = false;
  isCompleteMode.value = true;
  formDialogVisible.value = true;
};

// 处理删除
const handleDelete = async (row: ProductionOrder) => {
  try {
    await deleteProductionOrder(row.id);
    MessagePlugin.success('删除成功');
    loadData();
  } catch (error: any) {
    console.error('删除失败:', error);
    MessagePlugin.error(error.message || '删除失败');
  }
};

// 处理表单提交
const handleFormSubmit = async () => {
  if (isCompleteMode.value) {
    // 完成生产
    try {
      await completeProduction(currentEditId.value!, {
        actualQuantity: formData.actualQuantity,
        materials: formData.materials.map(m => ({
          materialId: m.materialId,
          actualQuantity: m.actualQuantity
        }))
      });
      MessagePlugin.success('生产完成');
      formDialogVisible.value = false;
      loadData();
    } catch (error: any) {
      console.error('完成生产失败:', error);
      MessagePlugin.error(error.message || '完成生产失败');
    }
    return;
  }

  const valid = await formRef.value?.validate();
  if (valid !== true) return;

  if (formData.materials.length === 0) {
    MessagePlugin.warning('该成品没有配方，请先配置BOM');
    return;
  }

  try {
    const orderData = {
      productId: formData.productId,
      productName: formData.productName,
      date: formData.date,
      planQuantity: formData.planQuantity,
      materials: formData.materials,
      remark: formData.remark
    };

    if (isEditMode.value && currentEditId.value) {
      await updateProductionOrder(currentEditId.value, orderData);
      MessagePlugin.success('编辑成功');
    } else {
      await createProductionOrder(orderData);
      MessagePlugin.success('创建成功');
    }

    formDialogVisible.value = false;
    loadData();
  } catch (error: any) {
    console.error('保存失败:', error);
    MessagePlugin.error(error.message || '保存失败');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadProducts();
  loadData();
});
</script>

<style scoped lang="less">
.production-page {
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
      flex-wrap: wrap;
    }

    .status-buttons {
      display: flex;
      gap: 4px;
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
.order-info {
  .order-no {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .order-date {
    font-size: 12px;
    color: #999;
  }
}

.quantity-info {
  font-size: 13px;

  .quantity-row {
    margin-bottom: 4px;
    color: #666;

    &.actual {
      color: #0052d9;
      font-weight: 500;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.time-info {
  font-size: 12px;
  color: #666;

  .time-row {
    margin-bottom: 2px;

    &.empty {
      color: #999;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 物料明细区域样式
.materials-section {
  margin-top: 16px;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  padding: 16px;

  .materials-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .materials-title {
      font-weight: 500;
      color: #333;
    }
  }
}
</style>
