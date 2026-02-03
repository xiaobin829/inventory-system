<template>
  <div class="inventory-page">
    <div class="page-header">
      <h2 class="page-title">盘点管理</h2>
      <t-space>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建盘点单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          v-model="queryParams.checkType"
          placeholder="盘点类型"
          clearable
          style="width: 140px;"
          @change="loadData"
        >
          <t-option value="full" label="全盘" />
          <t-option value="partial" label="抽盘" />
          <t-option value="spot" label="临时盘点" />
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
          placeholder="搜索单据编号"
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

        <!-- 盘点类型列 -->
        <template #checkType="{ row }">
          <t-tag v-if="row.checkType === 'full'" theme="primary" variant="light">全盘</t-tag>
          <t-tag v-else-if="row.checkType === 'partial'" theme="success" variant="light">抽盘</t-tag>
          <t-tag v-else theme="warning" variant="light">临时盘点</t-tag>
        </template>

        <!-- 差异数量列 -->
        <template #diffQuantity="{ row }">
          <span :class="getDiffClass(getTotalDiffQuantity(row))">
            {{ formatDiffQuantity(getTotalDiffQuantity(row)) }}
          </span>
        </template>

        <!-- 差异金额列 -->
        <template #diffAmount="{ row }">
          <span :class="getDiffClass(row.totalDiffAmount)">
            ¥{{ formatDiffAmount(row.totalDiffAmount) }}
          </span>
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
            </template>
            <t-divider layout="vertical" />
            <t-popconfirm content="确定删除该盘点单吗？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 表单对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      header="盘点单"
      width="900px"
    >
      <p style="text-align: center; color: #999; padding: 40px 0;">
        盘点单表单功能开发中...
      </p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { CheckOrder, CheckOrderQuery } from '@/types/bill';
import { getCheckOrders, deleteCheckOrder } from '@/api/bill';

// 日期范围
const dateRange = ref<string[]>([]);

// 查询参数
const queryParams = reactive<CheckOrderQuery>({
  checkType: undefined,
  status: undefined,
  keyword: '',
  startDate: undefined,
  endDate: undefined,
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<CheckOrder[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 对话框状态
const formDialogVisible = ref(false);

// 表格列配置
const columns = [
  { colKey: 'billInfo', title: '单据信息', width: 180, cell: 'billInfo' },
  { colKey: 'warehouseName', title: '仓库', width: 120 },
  { colKey: 'checkType', title: '盘点类型', width: 110, cell: 'checkType' },
  { colKey: 'diffQuantity', title: '差异数量', width: 100, cell: 'diffQuantity' },
  { colKey: 'diffAmount', title: '差异金额', width: 110, cell: 'diffAmount' },
  { colKey: 'operatorName', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 160, fixed: 'right', cell: 'operation' }
];

// 计算总差异数量
const getTotalDiffQuantity = (row: CheckOrder): number => {
  return row.items.reduce((sum, item) => sum + item.diffQuantity, 0);
};

// 格式化差异数量
const formatDiffQuantity = (diff: number): string => {
  if (diff > 0) return `+${diff}`;
  return String(diff);
};

// 格式化差异金额
const formatDiffAmount = (amount: number): string => {
  if (amount > 0) return `+${amount.toFixed(2)}`;
  return amount.toFixed(2);
};

// 获取差异样式类
const getDiffClass = (value: number): string => {
  if (value < 0) return 'diff-negative';
  if (value > 0) return 'diff-positive';
  return 'diff-zero';
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

    const { list, total } = await getCheckOrders(params);
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

// 处理新建
const handleCreate = () => {
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: CheckOrder) => {
  console.log('查看:', row);
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: CheckOrder) => {
  console.log('编辑:', row);
  formDialogVisible.value = true;
};

// 处理删除
const handleDelete = async (row: CheckOrder) => {
  try {
    await deleteCheckOrder(row.id);
    MessagePlugin.success('删除成功');
    loadData();
  } catch (error) {
    console.error('删除失败:', error);
    MessagePlugin.error('删除失败');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="less">
.inventory-page {
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

// 差异样式
.diff-negative {
  color: #e34d59;
  font-weight: 500;
}

.diff-positive {
  color: #00a870;
  font-weight: 500;
}

.diff-zero {
  color: #666;
}
</style>
