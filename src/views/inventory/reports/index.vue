<template>
  <div class="reports-page">
    <!-- 统计卡片区域 -->
    <div class="statistics-section">
      <t-row :gutter="16">
        <t-col :span="3">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <t-icon name="folder-open" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">期初库存总额</div>
              <div class="stat-value">¥{{ formatNumber(summary.openingValue) }}</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
              <t-icon name="arrow-down" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">本期入库总额</div>
              <div class="stat-value inbound">¥{{ formatNumber(summary.inboundValue) }}</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
              <t-icon name="arrow-up" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">本期出库总额</div>
              <div class="stat-value outbound">¥{{ formatNumber(summary.outboundValue) }}</div>
            </div>
          </div>
        </t-col>
        <t-col :span="3">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #0052d9 0%, #00a6ed 100%);">
              <t-icon name="folder" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-label">期末库存总额</div>
              <div class="stat-value ending">¥{{ formatNumber(summary.endingValue) }}</div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 页面标题和操作按钮 -->
      <div class="page-header">
        <h2 class="page-title">进销存报表</h2>
        <t-space>
          <t-button theme="default" variant="outline" @click="handleExportExcel">
            <template #icon><t-icon name="file-excel" /></template>
            导出 Excel
          </t-button>
          <t-button theme="default" variant="outline" @click="handleExportCSV">
            <template #icon><t-icon name="file" /></template>
            导出 CSV
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
          <t-date-range-picker
            v-model="queryParams.dateRange"
            placeholder="选择日期范围"
            style="width: 280px;"
            :presets="datePresets"
            allow-input
            clearable
            @change="loadData"
          />

          <t-select
            v-model="queryParams.warehouseId"
            placeholder="全部仓库"
            clearable
            style="width: 160px;"
            @change="loadData"
          >
            <t-option value="" label="全部仓库" />
            <t-option v-for="w in warehouseOptions" :key="w.value" :value="w.value" :label="w.label" />
          </t-select>

          <t-select
            v-model="queryParams.itemType"
            placeholder="全部类型"
            clearable
            style="width: 140px;"
            @change="loadData"
          >
            <t-option value="" label="全部类型" />
            <t-option value="material" label="原材料" />
            <t-option value="product" label="成品" />
          </t-select>

          <t-select
            v-model="queryParams.categoryId"
            placeholder="全部分类"
            clearable
            style="width: 160px;"
            @change="loadData"
          >
            <t-option value="" label="全部分类" />
            <t-option v-for="c in categoryOptions" :key="c.value" :value="c.value" :label="c.label" />
          </t-select>

          <t-input
            v-model="queryParams.keyword"
            placeholder="搜索物料/成品名称"
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
          bordered
          stripe
          @page-change="handlePageChange"
        >
          <!-- 物料/成品信息 -->
          <template #itemInfo="{ row }">
            <div class="item-info">
              <t-tag v-if="row.itemType === 'material'" theme="primary" variant="light" size="small">
                原料
              </t-tag>
              <t-tag v-else theme="success" variant="light" size="small">
                成品
              </t-tag>
              <div class="item-name">{{ row.itemName }}</div>
              <div class="item-code">{{ row.itemCode }}</div>
            </div>
          </template>

          <!-- 期初数量 -->
          <template #openingQty="{ row }">
            <span class="qty-value">{{ row.openingQty }}</span>
            <span class="qty-unit">{{ row.unit }}</span>
          </template>

          <!-- 期初金额 -->
          <template #openingAmount="{ row }">
            <span class="amount-value">¥{{ formatNumber(row.openingAmount) }}</span>
          </template>

          <!-- 入库数量 -->
          <template #inboundQty="{ row }">
            <span class="qty-value inbound">+{{ row.inboundQty }}</span>
            <span class="qty-unit">{{ row.unit }}</span>
          </template>

          <!-- 入库金额 -->
          <template #inboundAmount="{ row }">
            <span class="amount-value inbound">+¥{{ formatNumber(row.inboundAmount) }}</span>
          </template>

          <!-- 出库数量 -->
          <template #outboundQty="{ row }">
            <span class="qty-value outbound">-{{ row.outboundQty }}</span>
            <span class="qty-unit">{{ row.unit }}</span>
          </template>

          <!-- 出库金额 -->
          <template #outboundAmount="{ row }">
            <span class="amount-value outbound">-¥{{ formatNumber(row.outboundAmount) }}</span>
          </template>

          <!-- 期末数量 -->
          <template #endingQty="{ row }">
            <span class="qty-value ending">{{ row.endingQty }}</span>
            <span class="qty-unit">{{ row.unit }}</span>
          </template>

          <!-- 期末金额 -->
          <template #endingAmount="{ row }">
            <span class="amount-value ending">¥{{ formatNumber(row.endingAmount) }}</span>
          </template>
        </t-table>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <t-row :gutter="16">
          <t-col :span="6">
            <div class="chart-card">
              <div class="chart-header">
                <h4>库存趋势</h4>
              </div>
              <div class="chart-content" ref="trendChartRef"></div>
            </div>
          </t-col>
          <t-col :span="6">
            <div class="chart-card">
              <div class="chart-header">
                <h4>进出库对比</h4>
              </div>
              <div class="chart-content" ref="compareChartRef"></div>
            </div>
          </t-col>
        </t-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import * as echarts from 'echarts';

// 获取当月的日期范围
const getDefaultDateRange = (): [string, string] => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  return [formatDate(start), formatDate(end)];
};

// 日期快捷选项
const datePresets = {
  '本月': getDefaultDateRange(),
  '上月': (() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    return [formatDate(start), formatDate(end)] as [string, string];
  })(),
  '本季度': (() => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), quarter * 3, 1);
    const end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    return [formatDate(start), formatDate(end)] as [string, string];
  })(),
  '本年': (() => {
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    return [formatDate(new Date(now.getFullYear(), 0, 1)), formatDate(new Date(now.getFullYear(), 11, 31))] as [string, string];
  })()
};

// 查询参数
const queryParams = reactive({
  dateRange: getDefaultDateRange() as [string, string],
  warehouseId: '',
  itemType: '',
  categoryId: '',
  keyword: '',
  page: 1,
  pageSize: 10
});

// 仓库选项
const warehouseOptions = [
  { value: 'wh-1', label: '中心仓库' },
  { value: 'wh-2', label: '门店A仓库' },
  { value: 'wh-3', label: '门店B仓库' }
];

// 分类选项
const categoryOptions = [
  { value: 'cat-1', label: '饮品原料' },
  { value: 'cat-2', label: '食品原料' },
  { value: 'cat-3', label: '包装材料' },
  { value: 'cat-4', label: '成品饮料' },
  { value: 'cat-5', label: '成品食品' }
];

// 汇总数据
const summary = reactive({
  openingValue: 0,
  inboundValue: 0,
  outboundValue: 0,
  endingValue: 0
});

// 报表数据类型
interface ReportItem {
  id: string;
  itemCode: string;
  itemName: string;
  itemType: 'material' | 'product';
  category: string;
  unit: string;
  openingQty: number;
  openingAmount: number;
  inboundQty: number;
  inboundAmount: number;
  outboundQty: number;
  outboundAmount: number;
  endingQty: number;
  endingAmount: number;
}

// 表格数据
const tableData = ref<ReportItem[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 表格列配置
const columns = [
  { colKey: 'itemInfo', title: '物料/成品', width: 180, fixed: 'left', cell: 'itemInfo' },
  { colKey: 'openingQty', title: '期初数量', width: 100, align: 'right', cell: 'openingQty' },
  { colKey: 'openingAmount', title: '期初金额', width: 120, align: 'right', cell: 'openingAmount' },
  { colKey: 'inboundQty', title: '入库数量', width: 100, align: 'right', cell: 'inboundQty' },
  { colKey: 'inboundAmount', title: '入库金额', width: 120, align: 'right', cell: 'inboundAmount' },
  { colKey: 'outboundQty', title: '出库数量', width: 100, align: 'right', cell: 'outboundQty' },
  { colKey: 'outboundAmount', title: '出库金额', width: 120, align: 'right', cell: 'outboundAmount' },
  { colKey: 'endingQty', title: '期末数量', width: 100, align: 'right', cell: 'endingQty' },
  { colKey: 'endingAmount', title: '期末金额', width: 120, align: 'right', cell: 'endingAmount' }
];

// 图表实例
const trendChartRef = ref<HTMLElement>();
const compareChartRef = ref<HTMLElement>();
let trendChart: echarts.ECharts | null = null;
let compareChart: echarts.ECharts | null = null;

// 格式化数字
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// 生成模拟数据
const generateMockData = () => {
  const items: ReportItem[] = [];
  const mockItems = [
    { code: 'YL-001', name: '鲜牛奶', type: 'material' as const, unit: 'L', basePrice: 8.5 },
    { code: 'YL-002', name: '红茶茶叶', type: 'material' as const, unit: 'kg', basePrice: 120 },
    { code: 'YL-003', name: '珍珠', type: 'material' as const, unit: 'kg', basePrice: 35 },
    { code: 'YL-004', name: '椰果', type: 'material' as const, unit: 'kg', basePrice: 28 },
    { code: 'YL-005', name: '芒果', type: 'material' as const, unit: 'kg', basePrice: 18 },
    { code: 'YL-006', name: '糖浆', type: 'material' as const, unit: 'L', basePrice: 15 },
    { code: 'BZ-001', name: '纸杯500ml', type: 'material' as const, unit: '个', basePrice: 0.35 },
    { code: 'BZ-002', name: '塑料盖', type: 'material' as const, unit: '个', basePrice: 0.15 },
    { code: 'BZ-003', name: '吸管', type: 'material' as const, unit: '根', basePrice: 0.08 },
    { code: 'CP-001', name: '珍珠奶茶', type: 'product' as const, unit: '杯', basePrice: 12 },
    { code: 'CP-002', name: '芒果冰沙', type: 'product' as const, unit: '杯', basePrice: 15 },
    { code: 'CP-003', name: '拿铁咖啡', type: 'product' as const, unit: '杯', basePrice: 18 },
    { code: 'CP-004', name: '柠檬茶', type: 'product' as const, unit: '杯', basePrice: 10 },
    { code: 'CP-005', name: '草莓奶昔', type: 'product' as const, unit: '杯', basePrice: 16 }
  ];

  mockItems.forEach((item, index) => {
    const openingQty = Math.floor(Math.random() * 500) + 100;
    const inboundQty = Math.floor(Math.random() * 300) + 50;
    const outboundQty = Math.floor(Math.random() * (openingQty + inboundQty - 50));
    const endingQty = openingQty + inboundQty - outboundQty;

    items.push({
      id: `item-${index}`,
      itemCode: item.code,
      itemName: item.name,
      itemType: item.type,
      category: item.type === 'material' ? '原材料' : '成品',
      unit: item.unit,
      openingQty,
      openingAmount: openingQty * item.basePrice,
      inboundQty,
      inboundAmount: inboundQty * item.basePrice,
      outboundQty,
      outboundAmount: outboundQty * item.basePrice,
      endingQty,
      endingAmount: endingQty * item.basePrice
    });
  });

  return items;
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    let data = generateMockData();

    // 筛选数据
    if (queryParams.itemType) {
      data = data.filter(item => item.itemType === queryParams.itemType);
    }
    if (queryParams.keyword) {
      const keyword = queryParams.keyword.toLowerCase();
      data = data.filter(item =>
        item.itemName.toLowerCase().includes(keyword) ||
        item.itemCode.toLowerCase().includes(keyword)
      );
    }

    // 计算汇总
    summary.openingValue = data.reduce((sum, item) => sum + item.openingAmount, 0);
    summary.inboundValue = data.reduce((sum, item) => sum + item.inboundAmount, 0);
    summary.outboundValue = data.reduce((sum, item) => sum + item.outboundAmount, 0);
    summary.endingValue = data.reduce((sum, item) => sum + item.endingAmount, 0);

    // 分页
    pagination.total = data.length;
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    tableData.value = data.slice(start, end);

    // 更新图表
    nextTick(() => {
      updateCharts(data);
    });
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 更新图表
const updateCharts = (data: ReportItem[]) => {
  // 库存趋势图
  if (trendChartRef.value) {
    if (!trendChart) {
      trendChart = echarts.init(trendChartRef.value);
    }

    // 生成日期数据
    const dates: string[] = [];
    const inventoryValues: number[] = [];
    const startDate = new Date(queryParams.dateRange[0]);
    const endDate = new Date(queryParams.dateRange[1]);
    let currentValue = summary.openingValue;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
      // 模拟每天的波动
      const change = (Math.random() - 0.4) * 5000;
      currentValue = Math.max(currentValue + change, summary.openingValue * 0.7);
      inventoryValues.push(Math.round(currentValue));
    }

    trendChart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>库存金额: ¥${data.value.toLocaleString()}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          interval: Math.floor(dates.length / 7)
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`
        }
      },
      series: [{
        type: 'line',
        data: inventoryValues,
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
          ])
        },
        lineStyle: {
          color: '#667eea',
          width: 2
        }
      }]
    });
  }

  // 进出库对比图
  if (compareChartRef.value) {
    if (!compareChart) {
      compareChart = echarts.init(compareChartRef.value);
    }

    // 按类型汇总
    const materialData = data.filter(d => d.itemType === 'material');
    const productData = data.filter(d => d.itemType === 'product');

    compareChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let result = `${params[0].name}<br/>`;
          params.forEach((item: any) => {
            result += `${item.marker} ${item.seriesName}: ¥${item.value.toLocaleString()}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['入库金额', '出库金额'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['原材料', '成品']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`
        }
      },
      series: [
        {
          name: '入库金额',
          type: 'bar',
          data: [
            materialData.reduce((sum, d) => sum + d.inboundAmount, 0),
            productData.reduce((sum, d) => sum + d.inboundAmount, 0)
          ],
          itemStyle: { color: '#38ef7d' },
          barWidth: '35%'
        },
        {
          name: '出库金额',
          type: 'bar',
          data: [
            materialData.reduce((sum, d) => sum + d.outboundAmount, 0),
            productData.reduce((sum, d) => sum + d.outboundAmount, 0)
          ],
          itemStyle: { color: '#fa709a' },
          barWidth: '35%'
        }
      ]
    });
  }
};

// 处理页码变化
const handlePageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  loadData();
};

// 导出Excel
const handleExportExcel = () => {
  MessagePlugin.success('Excel导出功能开发中...');
};

// 导出CSV
const handleExportCSV = () => {
  // 生成CSV内容
  const headers = ['物料编码', '物料名称', '类型', '单位', '期初数量', '期初金额', '入库数量', '入库金额', '出库数量', '出库金额', '期末数量', '期末金额'];
  const data = generateMockData();

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.itemCode,
      row.itemName,
      row.itemType === 'material' ? '原材料' : '成品',
      row.unit,
      row.openingQty,
      row.openingAmount.toFixed(2),
      row.inboundQty,
      row.inboundAmount.toFixed(2),
      row.outboundQty,
      row.outboundAmount.toFixed(2),
      row.endingQty,
      row.endingAmount.toFixed(2)
    ].join(','))
  ].join('\n');

  // 下载文件
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `进销存报表_${queryParams.dateRange[0]}_${queryParams.dateRange[1]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);

  MessagePlugin.success('CSV导出成功');
};

// 窗口大小变化时重绘图表
const handleResize = () => {
  trendChart?.resize();
  compareChart?.resize();
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
  window.addEventListener('resize', handleResize);
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  trendChart?.dispose();
  compareChart?.dispose();
});
</script>

<style scoped lang="less">
.reports-page {
  height: 100%;
  padding: 24px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .statistics-section {
    margin-bottom: 16px;
    flex-shrink: 0;

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
        flex-shrink: 0;
      }

      .stat-content {
        flex: 1;
        min-width: 0;

        .stat-label {
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 22px;
          font-weight: 600;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &.inbound {
            color: #00a870;
          }

          &.outbound {
            color: #e34d59;
          }

          &.ending {
            color: #0052d9;
          }
        }
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
    min-height: 0;

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-shrink: 0;

      .page-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
    }

    .filter-section {
      margin-bottom: 16px;
      flex-shrink: 0;

      .filter-row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }
    }

    .table-section {
      flex-shrink: 0;
      margin-bottom: 24px;
    }

    .charts-section {
      flex-shrink: 0;
      margin-top: auto;

      .chart-card {
        background: #fafafa;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #eee;

        .chart-header {
          margin-bottom: 12px;

          h4 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }
        }

        .chart-content {
          height: 240px;
        }
      }
    }
  }
}

// 表格单元格样式
.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .item-name {
    font-weight: 500;
    color: #333;
  }

  .item-code {
    font-size: 12px;
    color: #999;
  }
}

.qty-value {
  font-weight: 500;
  color: #333;

  &.inbound {
    color: #00a870;
  }

  &.outbound {
    color: #e34d59;
  }

  &.ending {
    color: #0052d9;
    font-weight: 600;
  }
}

.qty-unit {
  font-size: 12px;
  color: #999;
  margin-left: 4px;
}

.amount-value {
  font-weight: 500;
  color: #333;

  &.inbound {
    color: #00a870;
  }

  &.outbound {
    color: #e34d59;
  }

  &.ending {
    color: #0052d9;
    font-weight: 600;
  }
}
</style>
