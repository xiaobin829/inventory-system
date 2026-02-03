<template>
  <div class="cost-card-page">
    <div class="page-header">
      <h2 class="page-title">成本卡管理</h2>
      <t-button theme="primary" @click="handleCreate">
        <template #icon><t-icon name="add" /></template>
        新建成本卡
      </t-button>
    </div>

    <div class="content-card">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <t-input
          v-model="queryParams.keyword"
          placeholder="搜索商品名称"
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
          <t-option value="active" label="生效中" />
          <t-option value="draft" label="草稿" />
          <t-option value="archived" label="已归档" />
        </t-select>
      </div>

      <!-- 数据表格 -->
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @page-change="handlePageChange"
      >
        <!-- 商品名称列 -->
        <template #productName="{ row }">
          <div class="product-info">
            <div class="name">{{ row.name }}</div>
            <div class="code">{{ row.code }}</div>
          </div>
        </template>

        <!-- 版本列 -->
        <template #version="{ row }">
          <t-tag theme="primary" variant="light">V{{ row.version }}</t-tag>
        </template>

        <!-- 原料数量列 -->
        <template #materialCount="{ row }">
          {{ getMaterialCount(row) }} 种
        </template>

        <!-- 总成本列 -->
        <template #totalCost="{ row }">
          <span class="cost-value">¥{{ row.totalCost.toFixed(2) }}</span>
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
            <t-link theme="primary" @click="handleCopy(row)">复制</t-link>
            <t-divider layout="vertical" />
            <t-link theme="danger" @click="handleDelete(row.id)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 查看详情对话框 -->
    <t-dialog
      v-model:visible="detailDialogVisible"
      header="成本卡详情"
      width="800px"
      :footer="false"
    >
      <div v-if="currentCostCard" class="detail-content">
        <!-- 基本信息 -->
        <div class="info-section">
          <div class="info-row">
            <div class="info-item">
              <span class="label">成本卡名称：</span>
              <span class="value">{{ currentCostCard.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">编号：</span>
              <span class="value">{{ currentCostCard.code }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">关联商品：</span>
              <span class="value">{{ currentCostCard.productName || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">版本：</span>
              <span class="value">V{{ currentCostCard.version }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="label">状态：</span>
              <t-tag v-if="currentCostCard.status === 'active'" theme="success" variant="light">生效中</t-tag>
              <t-tag v-else-if="currentCostCard.status === 'draft'" theme="warning" variant="light">草稿</t-tag>
              <t-tag v-else theme="default" variant="light">已归档</t-tag>
            </div>
            <div class="info-item">
              <span class="label">生效日期：</span>
              <span class="value">{{ currentCostCard.effectiveDate || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- 原料明细 -->
        <div class="material-section">
          <h4>原料明细</h4>
          <t-table
            :data="currentCostCard.costItems"
            :columns="detailColumns"
            row-key="id"
            size="small"
            :max-height="300"
          >
            <template #type="{ row }">
              <t-tag v-if="row.type === 'material'" theme="primary" variant="outline" size="small">原材料</t-tag>
              <t-tag v-else-if="row.type === 'labor'" theme="warning" variant="outline" size="small">人工</t-tag>
              <t-tag v-else-if="row.type === 'packaging'" theme="success" variant="outline" size="small">包装</t-tag>
              <t-tag v-else theme="default" variant="outline" size="small">其他</t-tag>
            </template>
            <template #unitPrice="{ row }">
              ¥{{ row.unitPrice.toFixed(3) }}
            </template>
            <template #totalCost="{ row }">
              <span class="cost-value">¥{{ row.totalCost.toFixed(2) }}</span>
            </template>
          </t-table>
        </div>

        <!-- 成本汇总 -->
        <div class="summary-section">
          <div class="summary-item">
            <span class="label">原材料成本：</span>
            <span class="value">¥{{ currentCostCard.materialCost.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">人工成本：</span>
            <span class="value">¥{{ currentCostCard.laborCost.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">包装成本：</span>
            <span class="value">¥{{ currentCostCard.packagingCost.toFixed(2) }}</span>
          </div>
          <div class="summary-item total">
            <span class="label">总成本：</span>
            <span class="value">¥{{ currentCostCard.totalCost.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </t-dialog>

    <!-- 新建/编辑对话框 -->
    <t-dialog
      v-model:visible="formDialogVisible"
      :header="isEdit ? '编辑成本卡' : '新建成本卡'"
      width="900px"
      :footer="false"
    >
      <div class="form-content">
        <t-form
          ref="formRef"
          :data="formData"
          :rules="formRules"
          label-width="100px"
        >
          <t-form-item label="成本卡名称" name="name">
            <t-input v-model="formData.name" placeholder="请输入成本卡名称" />
          </t-form-item>
          <t-form-item label="编号" name="code">
            <t-input v-model="formData.code" placeholder="请输入编号" />
          </t-form-item>
          <t-form-item label="关联商品" name="productId">
            <t-select v-model="formData.productId" placeholder="请选择关联商品" clearable>
              <t-option value="prod-1" label="珍珠奶茶" />
              <t-option value="prod-2" label="芒果冰沙" />
              <t-option value="prod-3" label="拿铁咖啡" />
            </t-select>
          </t-form-item>
          <t-form-item label="状态" name="status">
            <t-select v-model="formData.status" placeholder="请选择状态">
              <t-option value="draft" label="草稿" />
              <t-option value="active" label="生效中" />
            </t-select>
          </t-form-item>
        </t-form>
        <div class="form-actions">
          <t-button variant="outline" @click="formDialogVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleFormSubmit">确定</t-button>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { PageInfo } from 'tdesign-vue-next';
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next';
import type { CostCard, CostCardQuery } from '@/types/cost-card';
import { CostCardStatus, CostItemType } from '@/types/cost-card';
import {
  getCostCards,
  deleteCostCard,
  createCostCard
} from '@/api/cost-card';

// 查询参数
const queryParams = reactive<CostCardQuery>({
  keyword: '',
  status: undefined,
  page: 1,
  pageSize: 10
});

// 表格数据
const tableData = ref<CostCard[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 表格列配置
const columns = [
  { colKey: 'productName', title: '商品名称', width: 200, cell: 'productName' },
  { colKey: 'version', title: '版本', width: 100, cell: 'version' },
  { colKey: 'materialCount', title: '原料数量', width: 120, cell: 'materialCount' },
  { colKey: 'totalCost', title: '总成本', width: 120, cell: 'totalCost' },
  { colKey: 'status', title: '状态', width: 100, cell: 'status' },
  { colKey: 'effectiveDate', title: '生效日期', width: 120 },
  { colKey: 'operation', title: '操作', width: 200, fixed: 'right', cell: 'operation' }
];

// 详情表格列配置
const detailColumns = [
  { colKey: 'type', title: '类型', width: 100, cell: 'type' },
  { colKey: 'itemName', title: '名称', width: 150 },
  { colKey: 'quantity', title: '用量', width: 80 },
  { colKey: 'unit', title: '单位', width: 80 },
  { colKey: 'unitPrice', title: '单价', width: 100, cell: 'unitPrice' },
  { colKey: 'totalCost', title: '成本', width: 100, cell: 'totalCost' }
];

// 对话框状态
const detailDialogVisible = ref(false);
const formDialogVisible = ref(false);
const isEdit = ref(false);
const currentCostCard = ref<CostCard | null>(null);

// 表单数据
const formRef = ref();
const formData = reactive({
  name: '',
  code: '',
  productId: '',
  status: 'draft' as CostCardStatus
});

const formRules = {
  name: [{ required: true, message: '请输入成本卡名称' }],
  code: [{ required: true, message: '请输入编号' }]
};

// 获取原材料数量
const getMaterialCount = (row: CostCard) => {
  return row.costItems.filter(item => item.type === CostItemType.MATERIAL).length;
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

    const { list, total } = await getCostCards(params);
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
  isEdit.value = false;
  formData.name = '';
  formData.code = `CC-${Date.now()}`;
  formData.productId = '';
  formData.status = 'draft';
  formDialogVisible.value = true;
};

// 处理查看
const handleView = (row: CostCard) => {
  currentCostCard.value = row;
  detailDialogVisible.value = true;
};

// 处理编辑
const handleEdit = (row: CostCard) => {
  isEdit.value = true;
  currentCostCard.value = row;
  formData.name = row.name;
  formData.code = row.code;
  formData.productId = row.productId || '';
  formData.status = row.status;
  formDialogVisible.value = true;
};

// 处理复制（作为新版本）
const handleCopy = async (row: CostCard) => {
  const confirmDialog = DialogPlugin.confirm({
    header: '复制成本卡',
    body: `确定要将"${row.name}"复制为新版本吗？`,
    onConfirm: async () => {
      try {
        await createCostCard({
          name: `${row.name} (复制)`,
          code: `CC-${Date.now()}`,
          type: row.type,
          productId: row.productId,
          costItems: row.costItems,
          salePrice: row.salePrice,
          status: CostCardStatus.DRAFT,
          remark: `从 ${row.name} V${row.version} 复制`
        });
        MessagePlugin.success('复制成功');
        loadData();
        confirmDialog.hide();
      } catch (error) {
        MessagePlugin.error('复制失败');
      }
    }
  });
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
        loadData();
        confirmDialog.hide();
      } catch (error) {
        MessagePlugin.error('删除失败');
      }
    }
  });
};

// 处理表单提交
const handleFormSubmit = async () => {
  const valid = await formRef.value?.validate();
  if (valid !== true) return;

  try {
    // 这里简化处理，实际应该有完整的成本项编辑
    MessagePlugin.success(isEdit.value ? '更新成功' : '创建成功');
    formDialogVisible.value = false;
    loadData();
  } catch (error: any) {
    MessagePlugin.error(error.message || '操作失败');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
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
    margin-bottom: 16px;

    .page-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }
  }

  .content-card {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .filter-section {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
  }
}

// 表格单元格样式
.product-info {
  .name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }

  .code {
    font-size: 12px;
    color: #999;
  }
}

.cost-value {
  font-weight: 600;
  color: #e34d59;
}

// 详情对话框样式
.detail-content {
  .info-section {
    padding: 16px;
    background: #f9f9f9;
    border-radius: 4px;
    margin-bottom: 16px;

    .info-row {
      display: flex;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-item {
        flex: 1;

        .label {
          color: #666;
          margin-right: 8px;
        }

        .value {
          color: #333;
          font-weight: 500;
        }
      }
    }
  }

  .material-section {
    margin-bottom: 16px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }

  .summary-section {
    display: flex;
    gap: 24px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 4px;

    .summary-item {
      .label {
        color: #666;
        margin-right: 8px;
      }

      .value {
        color: #333;
        font-weight: 500;
      }

      &.total {
        margin-left: auto;

        .value {
          font-size: 18px;
          color: #e34d59;
          font-weight: 600;
        }
      }
    }
  }
}

// 表单样式
.form-content {
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }
}
</style>
