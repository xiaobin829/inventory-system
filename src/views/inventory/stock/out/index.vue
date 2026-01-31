<template>
  <div class="outbound-page">
    <div class="page-header">
      <h2 class="page-title">出库管理</h2>
      <t-space>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="default" variant="outline">
          <template #icon><t-icon name="print" /></template>
          打印
        </t-button>
        <t-button theme="primary">
          <template #icon><t-icon name="add" /></template>
          新建出库单
        </t-button>
      </t-space>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <t-select
          placeholder="出库类型"
          clearable
          style="width: 140px;"
        >
          <t-option value="sale" label="销售出库" />
          <t-option value="production" label="生产领料" />
          <t-option value="transfer" label="调拨出库" />
          <t-option value="loss" label="损耗出库" />
          <t-option value="other" label="其他出库" />
        </t-select>

        <t-select
          placeholder="单据状态"
          clearable
          style="width: 130px;"
        >
          <t-option value="draft" label="草稿" />
          <t-option value="submitted" label="已提交" />
          <t-option value="approved" label="已审核" />
          <t-option value="completed" label="已完成" />
          <t-option value="cancelled" label="已取消" />
        </t-select>

        <t-input
          placeholder="搜索单据编号"
          clearable
          style="width: 240px;"
        >
          <template #suffix-icon>
            <t-icon name="search" style="cursor: pointer;" />
          </template>
        </t-input>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <t-table
        :data="[]"
        :columns="columns"
        :loading="false"
      >
      </t-table>
      
      <div class="empty-state">
        <t-empty description="暂无出库单数据，点击右上角新建出库单" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 表格列配置
const columns = [
  { colKey: 'billNo', title: '单据编号', width: 180 },
  { colKey: 'type', title: '出库类型', width: 120 },
  { colKey: 'warehouseName', title: '出库仓库', width: 120 },
  { colKey: 'customerName', title: '客户', width: 150 },
  { colKey: 'totalQuantity', title: '数量', width: 100 },
  { colKey: 'totalAmount', title: '金额', width: 120 },
  { colKey: 'operator', title: '操作人', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'operation', title: '操作', width: 150, fixed: 'right' }
];
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
    position: relative;

    .empty-state {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
