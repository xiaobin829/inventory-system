/**
 * 成品管理 Mock API
 */

import type { Product, ProductCategory, ProductQuery, ProductFormData, BOMItem } from '@/types/product';
import { MeasureUnit } from '@/types/product';

// Mock 分类数据
const mockCategories: ProductCategory[] = [
  {
    id: 'cat-1',
    name: '全部成品',
    code: 'ALL',
    count: 45,
    children: [
      {
        id: 'cat-1-1',
        name: '茶饮类',
        code: 'TEA',
        parentId: 'cat-1',
        count: 20,
        children: [
          { id: 'cat-1-1-1', name: '奶茶系列', code: 'TEA_MILK', parentId: 'cat-1-1', count: 8 },
          { id: 'cat-1-1-2', name: '水果茶系列', code: 'TEA_FRUIT', parentId: 'cat-1-1', count: 7 },
          { id: 'cat-1-1-3', name: '纯茶系列', code: 'TEA_PURE', parentId: 'cat-1-1', count: 5 }
        ]
      },
      {
        id: 'cat-1-2',
        name: '小吃类',
        code: 'SNACK',
        parentId: 'cat-1',
        count: 15,
        children: [
          { id: 'cat-1-2-1', name: '点心', code: 'SNACK_DIM', parentId: 'cat-1-2', count: 8 },
          { id: 'cat-1-2-2', name: '炸品', code: 'SNACK_FRIED', parentId: 'cat-1-2', count: 7 }
        ]
      },
      {
        id: 'cat-1-3',
        name: '甜品类',
        code: 'DESSERT',
        parentId: 'cat-1',
        count: 10,
        children: [
          { id: 'cat-1-3-1', name: '冰淇淋', code: 'DESSERT_ICE', parentId: 'cat-1-3', count: 5 },
          { id: 'cat-1-3-2', name: '蛋糕', code: 'DESSERT_CAKE', parentId: 'cat-1-3', count: 5 }
        ]
      }
    ]
  }
];

// Mock 成品数据
let mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: '珍珠奶茶',
    code: 'PROD-001',
    categoryId: 'cat-1-1-1',
    categoryName: '奶茶系列',
    categoryPath: '茶饮类/奶茶系列',
    specification: '500ml',
    unit: MeasureUnit.PIECE,
    costPrice: 8.50,
    salePrice: 15.00,
    marketPrice: 18.00,
    minStock: 50,
    maxStock: 200,
    safetyStock: 80,
    costCardId: 'cc-001',
    costCardName: '珍珠奶茶成本卡',
    bomItems: [
      { id: 'bom-1', materialId: 'mat-1', materialName: '珍珠', materialCode: 'MAT-001', quantity: 50, unit: MeasureUnit.G, cost: 1.50 },
      { id: 'bom-2', materialId: 'mat-2', materialName: '牛奶', materialCode: 'MAT-002', quantity: 200, unit: MeasureUnit.ML, cost: 3.00 },
      { id: 'bom-3', materialId: 'mat-3', materialName: '红茶', materialCode: 'MAT-003', quantity: 20, unit: MeasureUnit.G, cost: 2.00 },
      { id: 'bom-4', materialId: 'mat-4', materialName: '糖浆', materialCode: 'MAT-004', quantity: 30, unit: MeasureUnit.ML, cost: 1.00 }
    ],
    productionProcess: '1. 煮珍珠 2. 泡红茶 3. 混合牛奶和糖浆 4. 组合成品',
    shelfLife: 1,
    storageCondition: '冷藏保存',
    barcode: '6901234567890',
    remark: '招牌产品',
    enabled: true,
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-31 14:00:00'
  },
  {
    id: 'prod-2',
    name: '芒果冰沙',
    code: 'PROD-002',
    categoryId: 'cat-1-1-2',
    categoryName: '水果茶系列',
    categoryPath: '茶饮类/水果茶系列',
    specification: '500ml',
    unit: MeasureUnit.PIECE,
    costPrice: 10.00,
    salePrice: 18.00,
    marketPrice: 22.00,
    minStock: 30,
    maxStock: 150,
    safetyStock: 50,
    costCardId: 'cc-002',
    costCardName: '芒果冰沙成本卡',
    bomItems: [
      { id: 'bom-5', materialId: 'mat-5', materialName: '芒果', materialCode: 'MAT-005', quantity: 150, unit: MeasureUnit.G, cost: 6.00 },
      { id: 'bom-6', materialId: 'mat-6', materialName: '冰块', materialCode: 'MAT-006', quantity: 200, unit: MeasureUnit.G, cost: 1.00 },
      { id: 'bom-7', materialId: 'mat-7', materialName: '糖', materialCode: 'MAT-007', quantity: 20, unit: MeasureUnit.G, cost: 0.50 }
    ],
    productionProcess: '1. 芒果去皮切块 2. 加入冰块和糖 3. 搅拌至冰沙状',
    shelfLife: 1,
    storageCondition: '冷冻保存',
    enabled: true,
    createTime: '2024-01-18 11:00:00',
    updateTime: '2024-01-30 16:00:00'
  },
  {
    id: 'prod-3',
    name: '红豆吐司',
    code: 'PROD-003',
    categoryId: 'cat-1-2-1',
    categoryName: '点心',
    categoryPath: '小吃类/点心',
    specification: '100g',
    unit: MeasureUnit.PIECE,
    costPrice: 3.50,
    salePrice: 8.00,
    marketPrice: 10.00,
    minStock: 40,
    maxStock: 180,
    safetyStock: 70,
    bomItems: [
      { id: 'bom-8', materialId: 'mat-8', materialName: '吐司面包', materialCode: 'MAT-008', quantity: 80, unit: MeasureUnit.G, cost: 2.00 },
      { id: 'bom-9', materialId: 'mat-9', materialName: '红豆沙', materialCode: 'MAT-009', quantity: 50, unit: MeasureUnit.G, cost: 1.50 }
    ],
    shelfLife: 3,
    storageCondition: '常温避光保存',
    enabled: true,
    createTime: '2024-01-20 09:00:00',
    updateTime: '2024-01-29 12:00:00'
  }
];

// 获取分类树
export const getProductCategories = (): Promise<ProductCategory[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
};

// 获取成品列表
export const getProducts = (params: ProductQuery): Promise<{ list: Product[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockProducts];

      // 按分类筛选
      if (params.categoryId && params.categoryId !== 'cat-1') {
        filteredData = filteredData.filter(item => {
          // 支持父分类筛选
          return item.categoryId === params.categoryId || 
                 item.categoryPath?.includes(getCategoryName(params.categoryId));
        });
      }

      // 按关键字筛选
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(keyword) ||
          item.code.toLowerCase().includes(keyword)
        );
      }

      // 按状态筛选
      if (params.status !== undefined) {
        filteredData = filteredData.filter(item => item.enabled === params.status);
      }

      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({ list, total });
    }, 500);
  });
};

// 辅助函数：获取分类名称
const getCategoryName = (categoryId: string): string => {
  const findCategory = (categories: ProductCategory[]): ProductCategory | undefined => {
    for (const cat of categories) {
      if (cat.id === categoryId) return cat;
      if (cat.children) {
        const found = findCategory(cat.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  const category = findCategory(mockCategories);
  return category?.name || '';
};

// 创建成品
export const createProduct = (data: ProductFormData): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查编码是否重复
      const exists = mockProducts.some(item => item.code === data.code);
      if (exists) {
        reject(new Error('成品编码已存在'));
        return;
      }

      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...data,
        categoryName: getCategoryName(data.categoryId),
        categoryPath: getCategoryPath(data.categoryId),
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      mockProducts.unshift(newProduct);
      resolve(newProduct);
    }, 500);
  });
};

// 辅助函数：获取分类路径
const getCategoryPath = (categoryId: string): string => {
  const path: string[] = [];
  
  const findPath = (categories: ProductCategory[], targetId: string, currentPath: string[]): boolean => {
    for (const cat of categories) {
      const newPath = [...currentPath, cat.name];
      if (cat.id === targetId) {
        path.push(...newPath);
        return true;
      }
      if (cat.children && findPath(cat.children, targetId, newPath)) {
        return true;
      }
    }
    return false;
  };
  
  findPath(mockCategories, categoryId, []);
  return path.slice(1).join('/'); // 移除"全部成品"
};

// 更新成品
export const updateProduct = (id: string, data: ProductFormData): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProducts.findIndex(item => item.id === id);
      if (index === -1) {
        reject(new Error('成品不存在'));
        return;
      }

      // 检查编码是否与其他成品重复
      const exists = mockProducts.some(item => item.id !== id && item.code === data.code);
      if (exists) {
        reject(new Error('成品编码已存在'));
        return;
      }

      const updatedProduct: Product = {
        ...mockProducts[index],
        ...data,
        categoryName: getCategoryName(data.categoryId),
        categoryPath: getCategoryPath(data.categoryId),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      mockProducts[index] = updatedProduct;
      resolve(updatedProduct);
    }, 500);
  });
};

// 删除成品
export const deleteProduct = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockProducts = mockProducts.filter(item => item.id !== id);
      resolve();
    }, 300);
  });
};

// 批量删除成品
export const batchDeleteProducts = (ids: string[]): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockProducts = mockProducts.filter(item => !ids.includes(item.id));
      resolve();
    }, 500);
  });
};

// 切换成品启用状态
export const toggleProductStatus = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find(item => item.id === id);
      if (!product) {
        reject(new Error('成品不存在'));
        return;
      }
      
      product.enabled = !product.enabled;
      product.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      resolve();
    }, 300);
  });
};

// 获取成品详情（含BOM）
export const getProductDetail = (id: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find(item => item.id === id);
      if (!product) {
        reject(new Error('成品不存在'));
        return;
      }
      resolve(product);
    }, 300);
  });
};

// 更新BOM配方
export const updateProductBOM = (id: string, bomItems: BOMItem[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find(item => item.id === id);
      if (!product) {
        reject(new Error('成品不存在'));
        return;
      }
      
      product.bomItems = bomItems;
      product.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      resolve();
    }, 500);
  });
};
