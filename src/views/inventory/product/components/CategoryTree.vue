<template>
  <div class="category-tree-container">
    <div class="tree-header">
      <h3>成品分类</h3>
    </div>
    <t-tree
      :data="treeData"
      :keys="treeKeys"
      hover
      activable
      expand-all
      @active="handleActive"
    >
      <template #label="{ node }">
        <div class="tree-node-label">
          <span class="node-name">{{ node.data.label }}</span>
          <span v-if="node.data.count !== undefined" class="node-count">
            {{ node.data.count }}
          </span>
        </div>
      </template>
    </t-tree>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ProductCategory } from '@/types/product';
import { getProductCategories } from '@/api/product';

// 树节点接口
interface TreeNode {
  value: string;
  label: string;
  count?: number;
  children?: TreeNode[];
}

// Emit 事件
const emit = defineEmits<{
  change: [categoryId: string];
}>();

// 树数据
const treeData = ref<TreeNode[]>([]);

// 树配置
const treeKeys = {
  value: 'value',
  label: 'label',
  children: 'children'
};

// 转换分类数据为树节点数据
const convertToTreeData = (categories: ProductCategory[]): TreeNode[] => {
  return categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    count: cat.count,
    children: cat.children ? convertToTreeData(cat.children) : undefined
  }));
};

// 加载分类树
const loadCategories = async () => {
  try {
    const categories = await getProductCategories();
    treeData.value = convertToTreeData(categories);
  } catch (error) {
    console.error('加载分类失败:', error);
  }
};

// 处理节点激活
const handleActive = (activeNodes: TreeNode[]) => {
  if (activeNodes && activeNodes.length > 0) {
    const activeNode = activeNodes[0];
    emit('change', activeNode.value);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadCategories();
});
</script>

<style scoped lang="less">
.category-tree-container {
  height: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  .tree-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e7e7e7;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }

  .tree-node-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 8px;

    .node-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-count {
      font-size: 12px;
      color: #999;
      margin-left: 8px;
      flex-shrink: 0;
    }
  }
}

// 覆盖 TDesign 树组件样式
:deep(.t-tree) {
  .t-tree-node {
    &:hover {
      background-color: #f5f5f5;
    }
  }

  .t-tree-node--active {
    background-color: #e7f4ff;
    
    .tree-node-label {
      .node-name {
        color: #0052d9;
        font-weight: 500;
      }
    }
  }
}
</style>
