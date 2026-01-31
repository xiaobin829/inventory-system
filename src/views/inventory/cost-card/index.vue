<template>
  <div class="cost-card-page">
    <div class="page-header">
      <h2 class="page-title">成本卡管理</h2>
      <t-space>
        <t-button theme="default" variant="outline" @click="handleExport">
          <template #icon><t-icon name="download" /></template>
          导出
        </t-button>
        <t-button theme="primary" @click="handleCreate">
          <template #icon><t-icon name="add" /></template>
          新建成本卡
        </t-button>
      </t-space>
    </div>

    <!-- Tab 切换 -->
    <t-tabs v-model="activeTab" @change="handleTabChange">
      <!-- 商品成本卡 -->
      <t-tab-panel value="product" label="商品成本卡">
        <div class="tab-content">
          <!-- 筛选区域 -->
          <div class="filter-section">
            <div class="filter-row">
              <t-input
                v-model="productQuery.keyword"
                placeholder="搜索成本卡名称、编号或商品"
                clearable
                style="width: 320px;"
                @enter="loadProductData"
                @clear="loadProductData"
              >
                <template #suffix-icon>
                  <t-icon name="search" @click="loadProductData" style="cursor: pointer;" />
                </template>
              </t-input>

              <t-select
                v-model="productQuery.status"
                placeholder="状态"
                clearable
                style="width: 120px;"
                @change="loadProductData"
              >
                <t-option value="active" label="生效中" />
                <t-option value="draft" label="草稿" />
                <t-option value="archived" label="已归档" />
              </t-select>
            </div>
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedProductKeys.length > 0" class="batch-action-bar">
            <span class="selected-info">已选 {{ selectedProductKeys.length }} 项</span>
            <t-space>
              <t-button theme="danger" variant="outline" @click="handleBatchDelete('product')">
                批量删除
              </t-button>
              <t-button variant="outline" @click="clearProductSelection">
                取消选择
              </t-button>
            </t-space>
          </div>

          <!-- 数据表格 -->
          <t-table
            :data="productTableData"
            :columns="productColumns"
            :loading="productLoading"
            :pagination="productPagination"
            :selected-row-keys="selectedProductKeys"
            row-key="id"
            @page-change="handleProductPageChange"
            @select-change="handleProductSelectionChange"
          >
            <!-- 成本卡信息列 -->
            <template #costCardInfo="{ row }">
              <div class="cost-card-info">
                <div class="card-name">{{ row.name }}</div>
                <div class="card-code">{{ row.code }}</div>
              </div>
            </template>

            <!-- 关联商品列 -->
            <template #product="{ row }">
              <div v-if="row.productName" class="product-info">
                <div class="product-name">{{ row.productName }}</div>
                <div class="product-code">{{ row.productCode }}</div>
              </div>
              <span v-else style="color: #999;">-</span>
            </template>

            <!-- 成本明细列 -->
            <template #costDetail="{ row }">
              <div class="cost-detail">
                <div class="cost-row">
                  <span class="label">原材料：</span>
                  <span class="value">¥{{ row.materialCost.toFixed(2) }}</span>
                </div>
                <div class="cost-row">
                  <span class="label">人工：</span>
                  <span class="value">¥{{ row.laborCost.toFixed(2) }}</span>
                </div>
                <div class="cost-row">
                  <span class="label">包装：</span>
                  <span class="value">¥{{ row.packagingCost.toFixed(2) }}</span>
                </div>
              </div>
            </template>

            <!-- 总成本列 -->
            <template #totalCost="{ row }">
              <div class="total-cost">
                ¥{{ row.totalCost.toFixed(2) }}
              </div>
            </template>

            <!-- 利润分析列 -->
            <template #profit="{ row }">
              <div v-if="row.salePrice" class="profit-info">
                <div class="profit-row">
                  <span class="label">售价：</span>
                  <span class="value sale">¥{{ row.salePrice.toFixed(2) }}</span>
                </div>
                <div class="profit-row">
                  <span class="label">利润率：</span>
                  <span class="value" :class="row.profitMargin > 30 ? 'good' : row.profitMargin > 15 ? 'normal' : 'low'">
                    {{ row.profitMargin.toFixed(2) }}%
                  </span>
                </div>
              </div>
              <span v-else style="color: #999;">-</span>
            </template>

            <!-- 状态列 -->
            <template #status="{ row }">
              <t-tag v-if="row.status === 'active'" theme="success" variant="light">生效中</t-tag>
              <t-tag v-else-if="row.status === 'draft'" theme="warning" variant="light">草稿</t-tag>
              <t-tag v-else theme="default" variant="light">已归档</t-tag>
            </template>

            <!-- 操作列 -->
            <template #operation="{ row }">
              <t-space :size="0">
                <t-link theme="primary" @click="handleView(row)">查看</t-link>
                <t-divider layout="vertical" />
                <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
                <t-divider layout="vertical" />
                <t-dropdown>
                  <t-link theme="primary">更多</t-link>
                  <template #dropdown>
                    <t-dropdown-menu>
                      <t-dropdown-item v-if="row.status === 'draft'" @click="handleUpdateStatus(row.id, 'active')">
                        <t-icon name="check-circle" /> 设为生效
                      </t-dropdown-item>
                      <t-dropdown-item v-if="row.status === 'active'" @click="handleUpdateStatus(row.id, 'archived')">
                        <t-icon name="archive" /> 归档
                      </t-dropdown-item>
                      <t-dropdown-item theme="danger" @click="handleDelete(row.id)">
                        <t-icon name="delete" /> 删除
                      </t-dropdown-item>
                    </t-dropdown-menu>
                  </template>
                </t-dropdown>
              </t-space>
            </template>
          </t-table>
        </div>
      </t-tab-panel>

      <!-- 加料成本卡 -->
      <t-tab-panel value="addon" label="加料成本卡">
        <div class="tab-content">
          <!-- 筛选区域 -->
          <div class="filter-section">
            <div class="filter-row">
              <t-input
                v-model="addonQuery.keyword"
                placeholder="搜索加料成本卡名称或编号"
                clearable
                style="width: 320px;"
                @enter="loadAddonData"
                @clear="loadAddonData"
              >
                <template #suffix-icon>
                  <t-icon name="search" @click="loadAddonData" style="cursor: pointer;" />
                </template>
              </t-input>

              <t-select
                v-model="addonQuery.status"
                placeholder="状态"
                clearable
                style="width: 120px;"
                @change="loadAddonData"
              >
                <t-option value="active" label="生效中" />
                <t-option value="draft" label="草稿" />
                <t-option value="archived" label="已归档" />
              </t-select>
            </div>
          </div>

          <!-- 批量操作栏 -->
          <div v-if="selectedAddonKeys.length > 0" class="batch-action-bar">
            <span class="selected-info">已选 {{ selectedAddonKeys.length }} 项</span>
            <t-space>
              <t-button theme="danger" variant="outline" @click="handleBatchDelete('addon')">
                批量删除
              </t-button>
              <t-button variant="outline" @click="clearAddonSelection">
                取消选择
              </t-button>
            </t-space>
          </div>

          <!-- 数据表格 -->
          <t-table
            :data="addonTableData"
            :columns="addonColumns"
            :loading="addonLoading"
            :pagination="addonPagination"
            :selected-row-keys="selectedAddonKeys"
            row-key="id"
            @page-change="handleAddonPageChange"
            @select-change="handleAddonSelectionChange"
          >
            <!-- 复用商品成本卡的模板 -->
            <template #costCardInfo="{ row }">
              <div class="cost-card-info">
                <div class="card-name">{{ row.name }}</div>
                <div class="card-code">{{ row.code }}</div>
              </div>
            </template>

            <template #costDetail="{ row }">
              <div class="cost-detail">
                <div class="cost-row">
                  <span class="label">原材料：</span>
                  <span class="value">¥{{ row.materialCost.toFixed(2) }}</span>
                </div>
              </div>
            </template>

            <template #totalCost="{ row }">
              <div class="total-cost">
                ¥{{ row.totalCost.toFixed(2) }}
              </div>
            </template>

            <template #profit="{ row }">
              <div v-if="row.salePrice" class="profit-info">
                <div class="profit-row">
                  <span class="label">售价：</span>
                  <span class="value sale">¥{{ row.salePrice.toFixed(2) }}</span>
                </div>
                <div class="profit-row">
                  <span class="label">利润率：</span>
                  <span class="value" :class="row.profitMargin > 30 ? 'good' : row.profitMargin > 15 ? 'normal' : 'low'">
                    {{ row.profitMargin.toFixed(2) }}%
                  </span>
                </div>
              </div>
              <span v-else style="color: #999;">-</span>
            </template>

            <template #status="{ row }">
              <t-tag v-if="row.status === 'active'" theme="success" variant="light">生效中</t-tag>
              <t-tag v-else-if="row.status === 'draft'" theme="warning" variant="light">草稿</t-tag>
              <t-tag v-else theme="default" variant="light">已归档</t-tag>
            </template>

            <template #operation="{ row }">
              <t-space :size="0">
                <t-link theme="primary" @click="handleView(row)">查看</t-link>
                <t-divider layout="vertical" />
                <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
                <t-divider layout="vertical" />
                <t-dropdown>
                  <t-link theme="primary">更多</t-link>
                  <template #dropdown>
                    <t-dropdown-menu>
                      <t-dropdown-item v-if="row.status === 'draft'" @click="handleUpdateStatus(row.id, 'active')">
                        <t-icon name="check-circle" /> 设为生效
                      </t-dropdown-item>
                      <t-dropdown-item v-if="row.status === 'active'" @click="handleUpdateStatus(row.id, 'archived')">
                        <t-icon name="archive" /> 归档
                      </t-dropdown-item>
                      <t-dropdown-item theme="danger" @click="handleDelete(row.id)">
                        <t-icon name="delete" /> 删除
                      </t-dropdown-item>
                    </t-dropdown-menu>
                  </template>
                </t-dropdown>
              </t-space>
            </template>
          </t-table>
        </div>
      </t-tab-panel>
    </t-tabs>

    <!-- 查看/编辑对话框（占位）-->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="isEdit ? '编辑成本卡' : isView ? '查看成本卡' : '新建成本卡'"
      width="900px"
      :footer="isView ? false : undefined"
    >
      <p style="text-align: center; color: #999; padding: 40px 0;">
        成本卡表单功能开发中...
      </p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import type { CostCard, CostCardQuery } from '@/types/cost-card';
import { CostCardType, CostCardStatus } from '@/types/cost-card';
import { 
  getCostCards, 
  deleteCostCard, 
  batchDeleteCostCards,
  updateCostCardStatus 
} from '@/api/cost-card';

// Tab 状态
const activeTab = ref<'product' | 'addon'>('product');

// 商品成本卡查询参数
const productQuery = reactive<CostCardQuery>({
  type: CostCardType.PRODUCT,
  keyword: '',
  status: undefined,
  page: 1,
  pageSize: 10
});

// 加料成本卡查询参数
const addonQuery = reactive<CostCardQuery>({
  type: CostCardType.ADDON,
  keyword: '',
  status: undefined,
  page: 1,
  pageSize: 10
});

// 商品成本卡表格数据
const productTableData = ref<CostCard[]>([]);
const productLoading = ref(false);
const selectedProductKeys = ref<string[]>([]);
const productPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 加料成本卡表格数据
const addonTableData = ref<CostCard[]>([]);
const addonLoading = ref(false);
const selectedAddonKeys = ref<string[]>([]);
const addonPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 对话框状态
const formDialogVisible = ref(false);
const isEdit = ref(false);
const isView = ref(false);

// 商品成本卡表格列
const productColumns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { colKey: 'costCardInfo', title: '成本卡信息', width: 180, cell: 'costCardInfo' },
  { colKey: 'product', title: '关联商品', width: 150, cell: 'product' },
  { colKey: 'costDetail', title: '成本明细', width: 150, cell: 'costDetail' },
  { colKey: 'totalCost', title: '总成本', width: 100, cell: 'totalCost' },
  { colKey: 'profit', title: '利润分析', width: 150, cell: 'profit' },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'effectiveDate', title: '生效日期', width: 120 },
  { colKey: 'operation', title: '操作', width: 180, fixed: 'right', cell: 'operation' }
];

// 加料成本卡表格列
const addonColumns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { colKey: 'costCardInfo', title: '成本卡信息', width: 200, cell: 'costCardInfo' },
  { colKey: 'costDetail', title: '成本明细', width: 150, cell: 'costDetail' },
  { colKey: 'totalCost', title: '总成本', width: 100, cell: 'totalCost' },
  { colKey: 'profit', title: '利润分析', width: 150, cell: 'profit' },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'effectiveDate', title: '生效日期', width: 120 },
  { colKey: 'operation', title: '操作', width: 180, fixed: 'right', cell: 'operation' }
];

// 加载商品成本卡数据
const loadProductData = async () => {
  productLoading.value = true;
  try {
    const params = {
      ...productQuery,
      page: productPagination.current,
      pageSize: productPagination.pageSize
    };
    
    const { list, total } = await getCostCards(params);
    productTableData.value = list;
    productPagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    productLoading.value = false;
  }
};

// 加载加料成本卡数据
const loadAddonData = async () => {
  addonLoading.value = true;
  try {
    const params = {
      ...addonQuery,
      page: addonPagination.current,
      pageSize: addonPagination.pageSize
    };
    
    const { list, total } = await getCostCards(params);
    addonTableData.value = list;
    addonPagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    addonLoading.value = false;
  }
};

// 处理 Tab 切换
const handleTabChange = (value: string) => {
  if (value === 'product') {
    loadProductData();
  } else {
    loadAddonData();
  }
};

// 处理商品成本卡页码变化
const handleProductPageChange = (pageInfo: PageInfo) => {
  productPagination.current = pageInfo.current;
  productPagination.pageSize = pageInfo.pageSize;
  loadProductData();
};

// 处理加料成本卡页码变化
const handleAddonPageChange = (pageInfo: PageInfo) => {
  addonPagination.current = pageInfo.current;
  addonPagination.pageSize = pageInfo.pageSize;
  loadAddonData();
};

// 处理选择变化
const handleProductSelectionChange = (selectedKeys: string[]) => {
  selectedProductKeys.value = selectedKeys;
};

const handleAddonSelectionChange = (selectedKeys: string[]) => {
  selectedAddonKeys.value = selectedKeys;
};

// 清除选择
const clearProductSelection = () => {
  selectedProductKeys.value = [];
};

const clearAddonSelection = () => {
  selectedAddonKeys.value = [];
};

// 处理新建
const handleCreate = () => {
  isEdit.value = false;
  isView.value = false;
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: CostCard) => {
  isView.value = true;
  isEdit.value = false;
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: CostCard) => {
  isEdit.value = true;
  isView.value = false;
  formDialogVisible.value = true;
};

// 处理删除
const handleDelete = (id: string) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '确认删除',
    body: '确定要删除该成本卡吗？删除后不可恢复。',
    onConfirm: async () => {
      try {
        await deleteCostCard(id);
        MessagePlugin.success('删除成功');
        
        if (activeTab.value === 'product') {
          loadProductData();
        } else {
          loadAddonData();
        }
        
        confirmDialog.hide();
      } catch (error) {
        MessagePlugin.error('删除失败');
      }
    }
  });
};

// 处理批量删除
const handleBatchDelete = (type: 'product' | 'addon') => {
  const selectedKeys = type === 'product' ? selectedProductKeys.value : selectedAddonKeys.value;
  
  const confirmDialog = DialogPlugin.confirm({
    header: '确认批量删除',
    body: `确定要删除选中的 ${selectedKeys.length} 个成本卡吗？删除后不可恢复。`,
    onConfirm: async () => {
      try {
        await batchDeleteCostCards(selectedKeys);
        MessagePlugin.success('批量删除成功');
        
        if (type === 'product') {
          selectedProductKeys.value = [];
          loadProductData();
        } else {
          selectedAddonKeys.value = [];
          loadAddonData();
        }
        
        confirmDialog.hide();
      } catch (error) {
        MessagePlugin.error('批量删除失败');
      }
    }
  });
};

// 处理状态更新
const handleUpdateStatus = async (id: string, status: CostCardStatus) => {
  try {
    await updateCostCardStatus(id, status);
    MessagePlugin.success('状态已更新');
    
    if (activeTab.value === 'product') {
      loadProductData();
    } else {
      loadAddonData();
    }
  } catch (error) {
    MessagePlugin.error('状态更新失败');
  }
};

// 处理导出
const handleExport = () => {
  MessagePlugin.info('导出功能开发中...');
};

// 组件挂载时加载数据
onMounted(() => {
  loadProductData();
});
</script>

<style scoped lang="less">
.cost-card-page {
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

  :deep(.t-tabs) {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 4px;
    padding: 16px 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .t-tabs__content {
      flex: 1;
      overflow: hidden;
    }
  }

  .tab-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .filter-section {
      margin-bottom: 16px;

      .filter-row {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }

    .batch-action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 16px;
      background: #f0f9ff;
      border: 1px solid #bae7ff;
      border-radius: 4px;

      .selected-info {
        color: #0052d9;
        font-weight: 500;
      }
    }
  }
}

// 表格单元格样式
.cost-card-info {
  .card-name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .card-code {
    font-size: 12px;
    color: #999;
  }
}

.product-info {
  .product-name {
    color: #333;
    margin-bottom: 4px;
  }

  .product-code {
    font-size: 12px;
    color: #999;
  }
}

.cost-detail {
  .cost-row {
    margin-bottom: 4px;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #666;
    }

    .value {
      color: #e34d59;
      margin-left: 4px;
      font-weight: 500;
    }
  }
}

.total-cost {
  font-size: 16px;
  font-weight: 600;
  color: #e34d59;
}

.profit-info {
  .profit-row {
    margin-bottom: 4px;
    font-size: 13px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #666;
    }

    .value {
      margin-left: 4px;
      font-weight: 500;

      &.sale {
        color: #0052d9;
      }

      &.good {
        color: #00a870;
      }

      &.normal {
        color: #ed7b2f;
      }

      &.low {
        color: #e34d59;
      }
    }
  }
}
</style>
