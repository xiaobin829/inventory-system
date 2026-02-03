<template>
  <div class="transfer-page">
    <div class="page-header">
      <h2 class="page-title">调拨管理</h2>
      <t-space>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建调拨单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
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

        <!-- 仓库调拨列 -->
        <template #warehouseTransfer="{ row }">
          <div class="warehouse-transfer">
            <span class="from-warehouse">{{ row.fromWarehouseName }}</span>
            <t-icon name="arrow-right" class="transfer-arrow" />
            <span class="to-warehouse">{{ row.toWarehouseName }}</span>
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
            <template v-if="row.status === 'draft'">
              <t-divider layout="vertical" />
              <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            </template>
            <t-divider layout="vertical" />
            <t-popconfirm content="确定删除该调拨单吗？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 表单对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      header="调拨单"
      width="900px"
    >
      <p style="text-align: center; color: #999; padding: 40px 0;">
        调拨单表单功能开发中...
      </p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { TransferOrder, TransferOrderQuery } from '@/types/bill';
import { getTransferOrders, deleteTransferOrder } from '@/api/bill';

// 日期范围
const dateRange = ref<string[]>([]);

// 查询参数
const queryParams = reactive<TransferOrderQuery>({
  status: undefined,
  keyword: '',
  startDate: undefined,
  endDate: undefined,
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<TransferOrder[]>([]);
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
  { colKey: 'warehouseTransfer', title: '仓库调拨', width: 200, cell: 'warehouseTransfer' },
  { colKey: 'amount', title: '数量/金额', width: 140, cell: 'amount' },
  { colKey: 'operatorName', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 160, fixed: 'right', cell: 'operation' }
];

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    };

    const { list, total } = await getTransferOrders(params);
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
const handleView = (row: TransferOrder) => {
  console.log('查看:', row);
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: TransferOrder) => {
  console.log('编辑:', row);
  formDialogVisible.value = true;
};

// 处理删除
const handleDelete = async (row: TransferOrder) => {
  try {
    await deleteTransferOrder(row.id);
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
.transfer-page {
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

.warehouse-transfer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;

  .from-warehouse {
    color: #666;
  }

  .transfer-arrow {
    color: #0052d9;
    font-size: 14px;
  }

  .to-warehouse {
    color: #0052d9;
    font-weight: 500;
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
</style>
