<template>
  <div class="product-page">
    <div class="page-container">
      <!-- 左侧分类树 -->
      <div class="left-sidebar">
        <CategoryTree @change="handleCategoryChange" />
      </div>

      <!-- 右侧内容区 -->
      <div class="right-content">
        <!-- 页面标题和操作按钮 -->
        <div class="page-header">
          <h2 class="page-title">成品管理</h2>
          <t-space>
            <t-button theme="default" variant="outline" @click="handleImport">
              <template #icon><t-icon name="upload" /></template>
              导入Excel
            </t-button>
            <t-button theme="primary" @click="handleCreate">
              <template #icon><t-icon name="add" /></template>
              新建成品
            </t-button>
          </t-space>
        </div>

        <!-- 筛选区域 -->
        <div class="filter-section">
          <div class="filter-row">
            <t-input
              v-model="queryParams.keyword"
              placeholder="搜索成品名称或编码"
              clearable
              style="width: 280px;"
              @enter="loadData"
              @clear="loadData"
            >
              <template #suffix-icon>
                <t-icon name="search" @click="loadData" style="cursor: pointer;" />
              </template>
            </t-input>

            <t-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              style="width: 120px;"
              @change="loadData"
            >
              <t-option :value="true" label="启用" />
              <t-option :value="false" label="禁用" />
            </t-select>
          </div>
        </div>

        <!-- 批量操作栏 -->
        <div v-if="selectedRowKeys.length > 0" class="batch-action-bar">
          <span class="selected-info">已选 {{ selectedRowKeys.length }} 项</span>
          <t-space>
            <t-button theme="danger" variant="outline" @click="handleBatchDelete">
              批量删除
            </t-button>
            <t-button variant="outline" @click="clearSelection">
              取消选择
            </t-button>
          </t-space>
        </div>

        <!-- 数据表格 -->
        <div class="table-section">
          <t-table
            :data="tableData"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            :selected-row-keys="selectedRowKeys"
            row-key="id"
            @page-change="handlePageChange"
            @select-change="handleSelectionChange"
          >
            <!-- 成品列 -->
            <template #product="{ row }">
              <div class="product-cell">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-code">{{ row.code }}</div>
                <div v-if="row.specification" class="product-spec">{{ row.specification }}</div>
              </div>
            </template>

            <!-- 价格列 -->
            <template #price="{ row }">
              <div class="price-cell">
                <div v-if="row.costPrice" class="price-item">
                  <span class="price-label">成本：</span>
                  <span class="price-value">¥{{ row.costPrice }}</span>
                </div>
                <div v-if="row.salePrice" class="price-item">
                  <span class="price-label">销售：</span>
                  <span class="price-value">¥{{ row.salePrice }}</span>
                </div>
              </div>
            </template>

            <!-- 库存设置列 -->
            <template #stock="{ row }">
              <div class="stock-cell">
                <div v-if="row.minStock !== undefined">
                  <span class="stock-label">最低：</span>
                  <span class="stock-value">{{ row.minStock }}</span>
                </div>
                <div v-if="row.maxStock !== undefined">
                  <span class="stock-label">最高：</span>
                  <span class="stock-value">{{ row.maxStock }}</span>
                </div>
              </div>
            </template>

            <!-- BOM配方列 -->
            <template #bom="{ row }">
              <t-tag v-if="row.bomItems && row.bomItems.length > 0" theme="primary" variant="outline">
                {{ row.bomItems.length }}项配方
              </t-tag>
              <span v-else style="color: #999;">未配置</span>
            </template>

            <!-- 成本卡列 -->
            <template #costCard="{ row }">
              <div v-if="row.costCardName" class="cost-card-cell">
                <t-icon name="file-excel" style="margin-right: 4px;" />
                {{ row.costCardName }}
              </div>
              <span v-else style="color: #999;">未关联</span>
            </template>

            <!-- 状态列 -->
            <template #status="{ row }">
              <t-switch
                :value="row.enabled"
                @change="handleToggleStatus(row.id)"
              />
            </template>

            <!-- 操作列 -->
            <template #operation="{ row }">
              <t-space :size="0">
                <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
                <t-divider layout="vertical" />
                <t-link theme="primary" @click="handleViewBOM(row)">配方</t-link>
                <t-divider layout="vertical" />
                <t-link theme="danger" @click="handleDelete(row.id)">删除</t-link>
              </t-space>
            </template>
          </t-table>
        </div>
      </div>
    </div>

    <!-- 表单对话框 -->
    <ProductFormDialog
      v-model:visible="formDialogVisible"
      :data="currentProduct"
      :is-edit="isEdit"
      @confirm="handleFormConfirm"
    />

    <!-- BOM配方查看对话框 -->
    <t-dialog
      v-model:visible="bomDialogVisible"
      :header="`${currentProduct?.name} - BOM配方`"
      width="800px"
      :footer="false"
    >
      <div class="bom-view">
        <div class="bom-summary">
          <div class="summary-item">
            <span class="label">配方项数：</span>
            <span class="value">{{ currentProduct?.bomItems?.length || 0 }} 项</span>
          </div>
          <div class="summary-item">
            <span class="label">总成本：</span>
            <span class="value cost">¥{{ calculateTotalCost(currentProduct?.bomItems) }}</span>
          </div>
        </div>

        <t-table
          :data="currentProduct?.bomItems || []"
          :columns="bomViewColumns"
          row-key="id"
          size="small"
          :max-height="400"
        >
          <template #cost="{ row }">
            ¥{{ row.cost?.toFixed(2) || '0.00' }}
          </template>
        </t-table>

        <div v-if="currentProduct?.productionProcess" class="production-process">
          <h4>生产工艺：</h4>
          <p>{{ currentProduct.productionProcess }}</p>
        </div>
      </div>
    </t-dialog>

    <!-- 导入对话框（占位） -->
    <t-dialog
      v-model:visible="importDialogVisible"
      header="导入成品"
      width="600px"
    >
      <p style="text-align: center; color: #999; padding: 40px 0;">导入功能开发中...</p>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import type { Product, ProductQuery, ProductFormData, BOMItem } from '@/types/product';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  batchDeleteProducts,
  toggleProductStatus 
} from '@/api/product';
import CategoryTree from './components/CategoryTree.vue';
import ProductFormDialog from './components/ProductFormDialog.vue';

// 查询参数
const queryParams = reactive<ProductQuery>({
  categoryId: undefined,
  keyword: '',
  status: undefined,
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<Product[]>([]);
const loading = ref(false);
const selectedRowKeys = ref<string[]>([]);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 表格列配置
const columns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { 
    colKey: 'product', 
    title: '成品信息', 
    width: 200,
    cell: 'product'
  },
  { colKey: 'categoryPath', title: '分类', width: 150 },
  { colKey: 'unit', title: '单位', width: 80 },
  { 
    colKey: 'price', 
    title: '价格', 
    width: 150,
    cell: 'price'
  },
  { 
    colKey: 'stock', 
    title: '库存设置', 
    width: 120,
    cell: 'stock'
  },
  { 
    colKey: 'bom', 
    title: 'BOM配方', 
    width: 120,
    cell: 'bom'
  },
  { 
    colKey: 'costCard', 
    title: '成本卡', 
    width: 150,
    cell: 'costCard'
  },
  { 
    colKey: 'status', 
    title: '状态', 
    width: 80,
    cell: 'status'
  },
  { 
    colKey: 'operation', 
    title: '操作', 
    width: 180,
    fixed: 'right',
    cell: 'operation'
  }
];

// 对话框状态
const formDialogVisible = ref(false);
const bomDialogVisible = ref(false);
const importDialogVisible = ref(false);
const isEdit = ref(false);
const currentProduct = ref<ProductFormData | Product | undefined>();

// BOM 查看表格列
const bomViewColumns = [
  { colKey: 'materialName', title: '原材料名称', width: 150 },
  { colKey: 'materialCode', title: '原材料编码', width: 120 },
  { colKey: 'quantity', title: '用量', width: 100 },
  { colKey: 'unit', title: '单位', width: 80 },
  { colKey: 'cost', title: '成本', width: 100, cell: 'cost' },
  { colKey: 'remark', title: '备注', minWidth: 150 }
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
    
    const { list, total } = await getProducts(params);
    tableData.value = list;
    pagination.total = total;
  } catch (error) {
    console.error('加载数据失败:', error);
    MessagePlugin.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 处理分类变化
const handleCategoryChange = (categoryId: string) => {
  queryParams.categoryId = categoryId;
  pagination.current = 1;
  loadData();
};

// 处理页码变化
const handlePageChange = (pageInfo: PageInfo) => {
  pagination.current = pageInfo.current;
  pagination.pageSize = pageInfo.pageSize;
  loadData();
};

// 处理选择变化
const handleSelectionChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys;
};

// 清除选择
const clearSelection = () => {
  selectedRowKeys.value = [];
};

// 处理新建
const handleCreate = () => {
  isEdit.value = false;
  currentProduct.value = undefined;
  formDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: Product) => {
  isEdit.value = true;
  currentProduct.value = { ...row };
  formDialogVisible.value = true;
};

// 处理表单确认
const handleFormConfirm = async (data: ProductFormData) => {
  try {
    if (isEdit.value && data.id) {
      await updateProduct(data.id, data);
      MessagePlugin.success('更新成功');
    } else {
      await createProduct(data);
      MessagePlugin.success('创建成功');
    }
    
    formDialogVisible.value = false;
    loadData();
  } catch (error: any) {
    MessagePlugin.error(error.message || '操作失败');
  }
};

// 处理删除
const handleDelete = (id: string) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '确认删除',
    body: '确定要删除该成品吗？删除后不可恢复。',
    onConfirm: async () => {
      try {
        await deleteProduct(id);
        MessagePlugin.success('删除成功');
        loadData();
        confirmDialog.hide();
      } catch (error) {
        MessagePlugin.error('删除失败');
      }
    }
  });
};

// 处理批量删除
const handleBatchDelete = () => {
  const confirmDialog = DialogPlugin.confirm({
    header: '确认批量删除',
    body: `确定要删除选中的 ${selectedRowKeys.value.length} 个成品吗？删除后不可恢复。`,
    onConfirm: async () => {
      try {
        await batchDeleteProducts(selectedRowKeys.value);
        MessagePlugin.success('批量删除成功');
        selectedRowKeys.value = [];
        loadData();
        confirmDialog.hide();
      } catch (error) {
        MessagePlugin.error('批量删除失败');
      }
    }
  });
};

// 处理状态切换
const handleToggleStatus = async (id: string) => {
  try {
    await toggleProductStatus(id);
    MessagePlugin.success('状态已更新');
    loadData();
  } catch (error) {
    MessagePlugin.error('状态更新失败');
  }
};

// 处理查看BOM
const handleViewBOM = (row: Product) => {
  currentProduct.value = row;
  bomDialogVisible.value = true;
};

// 计算BOM总成本
const calculateTotalCost = (bomItems?: BOMItem[]) => {
  if (!bomItems) return '0.00';
  const total = bomItems.reduce((sum, item) => sum + (item.cost || 0), 0);
  return total.toFixed(2);
};

// 处理导入
const handleImport = () => {
  importDialogVisible.value = true;
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="less">
.product-page {
  height: 100%;
  padding: 24px;
  background: #f5f5f5;

  .page-container {
    display: flex;
    height: 100%;
    gap: 16px;

    .left-sidebar {
      width: 260px;
      flex-shrink: 0;
    }

    .right-content {
      flex: 1;
      background: #fff;
      border-radius: 4px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
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

      .table-section {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}

// 表格单元格样式
.product-cell {
  .product-name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .product-code {
    font-size: 12px;
    color: #999;
    margin-bottom: 2px;
  }

  .product-spec {
    font-size: 12px;
    color: #666;
  }
}

.price-cell {
  .price-item {
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }

    .price-label {
      font-size: 12px;
      color: #666;
    }

    .price-value {
      font-weight: 500;
      color: #e34d59;
      margin-left: 4px;
    }
  }
}

.stock-cell {
  font-size: 13px;

  div {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .stock-label {
    color: #666;
  }

  .stock-value {
    color: #333;
    margin-left: 4px;
  }
}

.cost-card-cell {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #0052d9;
}

// BOM查看对话框样式
.bom-view {
  .bom-summary {
    display: flex;
    gap: 32px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 16px;

    .summary-item {
      .label {
        color: #666;
        margin-right: 8px;
      }

      .value {
        font-weight: 600;
        color: #333;

        &.cost {
          color: #e34d59;
          font-size: 16px;
        }
      }
    }
  }

  .production-process {
    margin-top: 16px;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 4px;

    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0;
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>
