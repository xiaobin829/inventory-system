<template>
  <div class="inbound-page">
    <div class="page-header">
      <h2 class="page-title">入库管理</h2>
      <t-space>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="print" /></template>
          打印
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建入库单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          v-model="queryParams.type"
          placeholder="入库类型"
          clearable
          style="width: 140px;"
          @change="loadData"
        >
          <t-option value="purchase" label="采购入库" />
          <t-option value="production" label="生产入库" />
          <t-option value="return" label="退货入库" />
          <t-option value="transfer" label="调拨入库" />
          <t-option value="other" label="其他入库" />
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
            <div class="bill-date">{{ row.inboundDate }}</div>
          </div>
        </template>

        <!-- 入库类型列 -->
        <template #type="{ row }">
          <t-tag v-if="row.type === 'purchase'" theme="primary" variant="light">采购入库</t-tag>
          <t-tag v-else-if="row.type === 'production'" theme="success" variant="light">生产入库</t-tag>
          <t-tag v-else-if="row.type === 'return'" theme="warning" variant="light">退货入库</t-tag>
          <t-tag v-else-if="row.type === 'transfer'" theme="default" variant="light">调拨入库</t-tag>
          <t-tag v-else variant="light">其他入库</t-tag>
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

    <!-- 表单对话框（占位）-->
    <t-dialog
      v-model:visible="formDialogVisible"
      header="入库单"
      width="900px"
    >
      <p style="text-align: center; color: #999; padding: 40px 0;">
        入库单表单功能开发中...
      </p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { InboundBill, InboundBillQuery } from '@/types/bill';
import { getInboundBills } from '@/api/bill';

// 查询参数
const queryParams = reactive<InboundBillQuery>({
  type: undefined,
  status: undefined,
  keyword: '',
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<InboundBill[]>([]);
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
  { colKey: 'type', title: '入库类型', width: 120, cell: 'type' },
  { colKey: 'warehouseName', title: '入库仓库', width: 120 },
  { colKey: 'supplierName', title: '供应商', width: 150 },
  { colKey: 'amount', title: '数量/金额', width: 140, cell: 'amount' },
  { colKey: 'operator', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 150, fixed: 'right', cell: 'operation' }
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
    
    const { list, total } = await getInboundBills(params);
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

// 处理新建
const handleCreate = () => {
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: InboundBill) => {
  console.log('查看:', row);
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: InboundBill) => {
  console.log('编辑:', row);
  formDialogVisible.value = true;
};

// 处理打印
const handlePrint = (row: InboundBill) => {
  MessagePlugin.info('打印功能开发中...');
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="less">
.inbound-page {
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
</style>
