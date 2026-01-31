<template>
  <div class="realtime-stock-page">
    <!-- 统计卡片区域 -->
    <div class="statistics-section">
      <t-row :gutter="16">
        <t-col :span="3">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <t-icon name="layers" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">总物料数</div>
              <div class="stat-value">{{ statistics.totalItems }}</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <t-icon name="chart-bar" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">总库存价值</div>
              <div class="stat-value">¥{{ statistics.totalValue.toFixed(2) }}</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="stat-card warning">
            <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
              <t-icon name="error-circle" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">库存预警</div>
              <div class="stat-value">{{ statistics.lowStockCount + statistics.criticalCount }}</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="stat-card overflow">
            <div class="stat-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
              <t-icon name="arrow-up" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">超储预警</div>
              <div class="stat-value">{{ statistics.overflowCount }}</div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 页面标题和操作按钮 -->
      <div class="page-header">
        <h2 class="page-title">实时库存</h2>
        <t-space>
          <t-button theme="default" variant="outline" @click="handleShowWarnings">
            <template #icon><t-icon name="notification" /></template>
            库存预警
            <t-badge v-if="warnings.length > 0" :count="warnings.length" />
          </t-button>
          <t-button theme="default" variant="outline" @click="handleExport">
            <template #icon><t-icon name="download" /></template>
            导出
          </t-button>
          <t-button theme="primary" @click="loadData">
            <template #icon><t-icon name="refresh" /></template>
            刷新
          </t-button>
        </t-space>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <t-select
            v-model="queryParams.type"
            placeholder="物料类型"
            clearable
            style="width: 140px;"
            @change="loadData"
          >
            <t-option value="material" label="原材料" />
            <t-option value="product" label="成品" />
          </t-select>

          <t-select
            v-model="queryParams.warehouseId"
            placeholder="仓库"
            clearable
            style="width: 150px;"
            @change="loadData"
          >
            <t-option value="wh-1" label="中心仓库" />
            <t-option value="wh-2" label="门店A" />
            <t-option value="wh-3" label="门店B" />
          </t-select>

          <t-select
            v-model="queryParams.warningLevel"
            placeholder="预警状态"
            clearable
            style="width: 140px;"
            @change="loadData"
          >
            <t-option value="normal" label="正常" />
            <t-option value="low" label="偏低" />
            <t-option value="critical" label="紧急" />
            <t-option value="overflow" label="超储" />
          </t-select>

          <t-input
            v-model="queryParams.keyword"
            placeholder="搜索物料名称或编码"
            clearable
            style="width: 260px;"
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
          <!-- 物料信息列 -->
          <template #itemInfo="{ row }">
            <div class="item-info">
              <t-tag v-if="row.type === 'material'" theme="primary" variant="light" size="small">
                原料
              </t-tag>
              <t-tag v-else theme="success" variant="light" size="small">
                成品
              </t-tag>
              <div class="item-name">{{ row.itemName }}</div>
              <div class="item-code">{{ row.itemCode }}</div>
              <div v-if="row.specification" class="item-spec">{{ row.specification }}</div>
            </div>
          </template>

          <!-- 库存数量列 -->
          <template #stockQuantity="{ row }">
            <div class="stock-quantity">
              <div class="quantity-main">
                <span class="value">{{ row.quantity }}</span>
                <span class="unit">{{ row.unit }}</span>
              </div>
              <div class="quantity-detail">
                <span class="detail-item">可用: {{ row.availableQuantity }}</span>
                <span v-if="row.lockedQuantity > 0" class="detail-item locked">
                  锁定: {{ row.lockedQuantity }}
                </span>
              </div>
            </div>
          </template>

          <!-- 库存设置列 -->
          <template #stockSetting="{ row }">
            <div class="stock-setting">
              <div v-if="row.minStock !== undefined" class="setting-item">
                <span class="label">最低：</span>
                <span class="value">{{ row.minStock }}</span>
              </div>
              <div v-if="row.maxStock !== undefined" class="setting-item">
                <span class="label">最高：</span>
                <span class="value">{{ row.maxStock }}</span>
              </div>
              <div v-if="row.safetyStock !== undefined" class="setting-item">
                <span class="label">安全：</span>
                <span class="value">{{ row.safetyStock }}</span>
              </div>
            </div>
          </template>

          <!-- 预警状态列 -->
          <template #warningLevel="{ row }">
            <t-tag
              v-if="row.warningLevel === 'normal'"
              theme="success"
              variant="light"
            >
              正常
            </t-tag>
            <t-tag
              v-else-if="row.warningLevel === 'low'"
              theme="warning"
              variant="light"
            >
              <t-icon name="error-circle" />
              偏低
            </t-tag>
            <t-tag
              v-else-if="row.warningLevel === 'critical'"
              theme="danger"
              variant="light"
            >
              <t-icon name="error-circle" />
              紧急
            </t-tag>
            <t-tag
              v-else-if="row.warningLevel === 'overflow'"
              theme="primary"
              variant="light"
            >
              <t-icon name="arrow-up" />
              超储
            </t-tag>
          </template>

          <!-- 成本列 -->
          <template #cost="{ row }">
            <div v-if="row.totalCost" class="cost-info">
              <div class="cost-item">
                <span class="label">单价：</span>
                <span class="value">¥{{ row.unitCost?.toFixed(2) }}</span>
              </div>
              <div class="cost-item">
                <span class="label">总值：</span>
                <span class="value total">¥{{ row.totalCost.toFixed(2) }}</span>
              </div>
            </div>
            <span v-else style="color: #999;">-</span>
          </template>

          <!-- 更新时间列 -->
          <template #updateTime="{ row }">
            {{ row.updateTime }}
          </template>
        </t-table>
      </div>
    </div>

    <!-- 库存预警对话框 -->
    <t-dialog
      v-model:visible="warningDialogVisible"
      header="库存预警"
      width="800px"
      :footer="false"
    >
      <t-table
        :data="warnings"
        :columns="warningColumns"
        row-key="id"
        size="small"
        :max-height="500"
      >
        <template #warningLevel="{ row }">
          <t-tag
            v-if="row.warningLevel === 'low'"
            theme="warning"
            variant="light"
          >
            偏低
          </t-tag>
          <t-tag
            v-else-if="row.warningLevel === 'critical'"
            theme="danger"
            variant="light"
          >
            紧急
          </t-tag>
          <t-tag
            v-else-if="row.warningLevel === 'overflow'"
            theme="primary"
            variant="light"
          >
            超储
          </t-tag>
        </template>
      </t-table>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import type { RealtimeStock, RealtimeStockQuery, StockStatistics, StockWarning } from '@/types/stock';
import { getRealtimeStock, getStockStatistics, getStockWarnings, exportStockData } from '@/api/stock';

// 查询参数
const queryParams = reactive<RealtimeStockQuery>({
  type: undefined,
  warehouseId: undefined,
  warningLevel: undefined,
  keyword: '',
  page: 1,
  pageSize: 10
});

// 统计数据
const statistics = ref<StockStatistics>({
  totalItems: 0,
  totalQuantity: 0,
  totalValue: 0,
  normalCount: 0,
  lowStockCount: 0,
  criticalCount: 0,
  overflowCount: 0,
  warehouseStats: []
});

// 预警数据
const warnings = ref<StockWarning[]>([]);

// 表格数据
const tableData = ref<RealtimeStock[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 预警对话框
const warningDialogVisible = ref(false);

// 表格列配置
const columns = [
  { colKey: 'itemInfo', title: '物料信息', width: 200, cell: 'itemInfo' },
  { colKey: 'categoryName', title: '分类', width: 150 },
  { colKey: 'warehouseName', title: '仓库', width: 120 },
  { colKey: 'stockQuantity', title: '库存数量', width: 150, cell: 'stockQuantity' },
  { colKey: 'stockSetting', title: '库存设置', width: 150, cell: 'stockSetting' },
  { colKey: 'warningLevel', title: '预警状态', width: 100, cell: 'warningLevel' },
  { colKey: 'cost', title: '成本', width: 140, cell: 'cost' },
  { colKey: 'updateTime', title: '更新时间', width: 160, cell: 'updateTime' }
];

// 预警表格列
const warningColumns = [
  { colKey: 'itemName', title: '物料名称', width: 150 },
  { colKey: 'itemCode', title: '物料编码', width: 120 },
  { colKey: 'warehouseName', title: '仓库', width: 100 },
  { colKey: 'currentStock', title: '当前库存', width: 100 },
  { colKey: 'warningLevel', title: '预警等级', width: 100, cell: 'warningLevel' },
  { colKey: 'warningReason', title: '预警原因', minWidth: 200 }
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
    
    const { list, total } = await getRealtimeStock(params);
    tableData.value = list;
    pagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 加载统计数据
const loadStatistics = async () => {
  try {
    statistics.value = await getStockStatistics();
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

// 加载预警数据
const loadWarnings = async () => {
  try {
    warnings.value = await getStockWarnings();
  } catch (error) {
    console.error('加载预警数据失败:', error);
  }
};

// 处理页码变化
const handlePageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  loadData();
};

// 显示预警对话框
const handleShowWarnings = () => {
  warningDialogVisible.value = true;
};

// 导出数据
const handleExport = async () => {
  try {
    await exportStockData(queryParams);
    MessagePlugin.success('导出成功');
  } catch (error) {
    MessagePlugin.error('导出失败');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadStatistics();
  loadWarnings();
  loadData();
});
</script>

<style scoped lang="less">
.realtime-stock-page {
  height: 100%;
  padding: 24px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;

  .statistics-section {
    margin-bottom: 16px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }

      .stat-content {
        flex: 1;

        .stat-label {
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }
      }

      &.warning .stat-value {
        color: #ed7b2f;
      }

      &.overflow .stat-value {
        color: #0052d9;
      }
    }
  }

  .main-content {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;

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
      margin-bottom: 16px;

      .filter-row {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }

    .table-section {
      flex: 1;
      overflow: hidden;
    }
  }
}

// 表格单元格样式
.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .item-name {
    font-weight: 500;
    color: #333;
  }

  .item-code {
    font-size: 12px;
    color: #999;
  }

  .item-spec {
    font-size: 12px;
    color: #666;
  }
}

.stock-quantity {
  .quantity-main {
    margin-bottom: 4px;

    .value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-right: 4px;
    }

    .unit {
      font-size: 12px;
      color: #999;
    }
  }

  .quantity-detail {
    display: flex;
    gap: 8px;
    font-size: 12px;

    .detail-item {
      color: #666;

      &.locked {
        color: #ed7b2f;
      }
    }
  }
}

.stock-setting {
  font-size: 13px;

  .setting-item {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #666;
    }

    .value {
      color: #333;
      margin-left: 4px;
    }
  }
}

.cost-info {
  .cost-item {
    margin-bottom: 4px;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #666;
    }

    .value {
      color: #333;
      margin-left: 4px;

      &.total {
        color: #e34d59;
        font-weight: 500;
      }
    }
  }
}
</style>
