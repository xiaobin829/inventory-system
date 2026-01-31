/**
 * 成本卡管理 Mock API
 */

import type { CostCard, CostCardQuery, CostCardFormData, CostItem, CostAnalysis } from '@/types/cost-card';
import { CostCardType, CostCardStatus, CostItemType } from '@/types/cost-card';
import { MeasureUnit } from '@/types/product';

// Mock 成本卡数据
let mockCostCards: CostCard[] = [
  {
    id: 'cc-001',
    code: 'CC-2024-001',
    name: '珍珠奶茶成本卡',
    type: CostCardType.PRODUCT,
    productId: 'prod-1',
    productName: '珍珠奶茶',
    productCode: 'PROD-001',
    costItems: [
      {
        id: 'ci-1',
        type: CostItemType.MATERIAL,
        itemId: 'mat-1',
        itemName: '珍珠',
        itemCode: 'MAT-001',
        quantity: 50,
        unit: MeasureUnit.G,
        unitPrice: 0.03,
        totalCost: 1.50
      },
      {
        id: 'ci-2',
        type: CostItemType.MATERIAL,
        itemId: 'mat-2',
        itemName: '牛奶',
        itemCode: 'MAT-002',
        quantity: 200,
        unit: MeasureUnit.ML,
        unitPrice: 0.015,
        totalCost: 3.00
      },
      {
        id: 'ci-3',
        type: CostItemType.MATERIAL,
        itemId: 'mat-3',
        itemName: '红茶',
        itemCode: 'MAT-003',
        quantity: 20,
        unit: MeasureUnit.G,
        unitPrice: 0.10,
        totalCost: 2.00
      },
      {
        id: 'ci-4',
        type: CostItemType.MATERIAL,
        itemId: 'mat-4',
        itemName: '糖浆',
        itemCode: 'MAT-004',
        quantity: 30,
        unit: MeasureUnit.ML,
        unitPrice: 0.033,
        totalCost: 1.00
      },
      {
        id: 'ci-5',
        type: CostItemType.LABOR,
        itemName: '制作人工',
        quantity: 1,
        unit: '份',
        unitPrice: 1.50,
        totalCost: 1.50
      },
      {
        id: 'ci-6',
        type: CostItemType.PACKAGING,
        itemName: '杯子+吸管',
        quantity: 1,
        unit: '套',
        unitPrice: 0.50,
        totalCost: 0.50
      }
    ],
    materialCost: 7.50,
    laborCost: 1.50,
    overheadCost: 0,
    packagingCost: 0.50,
    totalCost: 9.50,
    salePrice: 15.00,
    profitMargin: 36.67,
    status: CostCardStatus.ACTIVE,
    version: 1,
    effectiveDate: '2024-01-15',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-31 14:00:00',
    createdBy: '管理员',
    updatedBy: '管理员'
  },
  {
    id: 'cc-002',
    code: 'CC-2024-002',
    name: '芒果冰沙成本卡',
    type: CostCardType.PRODUCT,
    productId: 'prod-2',
    productName: '芒果冰沙',
    productCode: 'PROD-002',
    costItems: [
      {
        id: 'ci-7',
        type: CostItemType.MATERIAL,
        itemId: 'mat-5',
        itemName: '芒果',
        itemCode: 'MAT-005',
        quantity: 150,
        unit: MeasureUnit.G,
        unitPrice: 0.04,
        totalCost: 6.00
      },
      {
        id: 'ci-8',
        type: CostItemType.MATERIAL,
        itemId: 'mat-6',
        itemName: '冰块',
        itemCode: 'MAT-006',
        quantity: 200,
        unit: MeasureUnit.G,
        unitPrice: 0.005,
        totalCost: 1.00
      },
      {
        id: 'ci-9',
        type: CostItemType.MATERIAL,
        itemId: 'mat-7',
        itemName: '糖',
        itemCode: 'MAT-007',
        quantity: 20,
        unit: MeasureUnit.G,
        unitPrice: 0.025,
        totalCost: 0.50
      },
      {
        id: 'ci-10',
        type: CostItemType.LABOR,
        itemName: '制作人工',
        quantity: 1,
        unit: '份',
        unitPrice: 2.00,
        totalCost: 2.00
      },
      {
        id: 'ci-11',
        type: CostItemType.PACKAGING,
        itemName: '杯子+盖子',
        quantity: 1,
        unit: '套',
        unitPrice: 0.60,
        totalCost: 0.60
      }
    ],
    materialCost: 7.50,
    laborCost: 2.00,
    overheadCost: 0,
    packagingCost: 0.60,
    totalCost: 10.10,
    salePrice: 18.00,
    profitMargin: 43.89,
    status: CostCardStatus.ACTIVE,
    version: 1,
    effectiveDate: '2024-01-18',
    createTime: '2024-01-18 11:00:00',
    updateTime: '2024-01-30 16:00:00',
    createdBy: '管理员',
    updatedBy: '管理员'
  },
  {
    id: 'cc-003',
    code: 'CC-2024-003',
    name: '珍珠加料卡',
    type: CostCardType.ADDON,
    costItems: [
      {
        id: 'ci-12',
        type: CostItemType.MATERIAL,
        itemId: 'mat-1',
        itemName: '珍珠',
        itemCode: 'MAT-001',
        quantity: 30,
        unit: MeasureUnit.G,
        unitPrice: 0.03,
        totalCost: 0.90
      }
    ],
    materialCost: 0.90,
    laborCost: 0,
    overheadCost: 0,
    packagingCost: 0,
    totalCost: 0.90,
    salePrice: 2.00,
    profitMargin: 55.00,
    status: CostCardStatus.ACTIVE,
    version: 1,
    createTime: '2024-01-20 09:00:00',
    updateTime: '2024-01-29 12:00:00'
  }
];

// 获取成本卡列表
export const getCostCards = (params: CostCardQuery): Promise<{ list: CostCard[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockCostCards];

      // 按类型筛选
      if (params.type) {
        filteredData = filteredData.filter(item => item.type === params.type);
      }

      // 按状态筛选
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      // 按关键字筛选
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(keyword) ||
          item.code.toLowerCase().includes(keyword) ||
          item.productName?.toLowerCase().includes(keyword)
        );
      }

      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({ list, total });
    }, 500);
  });
};

// 创建成本卡
export const createCostCard = (data: CostCardFormData): Promise<CostCard> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 检查编号是否重复
      const exists = mockCostCards.some(item => item.code === data.code);
      if (exists) {
        reject(new Error('成本卡编号已存在'));
        return;
      }

      // 计算成本
      const analysis = calculateCostAnalysis(data.costItems, data.salePrice);

      const newCostCard: CostCard = {
        id: `cc-${Date.now()}`,
        ...data,
        ...analysis,
        version: 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createdBy: '管理员',
        updatedBy: '管理员'
      };

      mockCostCards.unshift(newCostCard);
      resolve(newCostCard);
    }, 500);
  });
};

// 更新成本卡
export const updateCostCard = (id: string, data: CostCardFormData): Promise<CostCard> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCostCards.findIndex(item => item.id === id);
      if (index === -1) {
        reject(new Error('成本卡不存在'));
        return;
      }

      // 检查编号是否与其他成本卡重复
      const exists = mockCostCards.some(item => item.id !== id && item.code === data.code);
      if (exists) {
        reject(new Error('成本卡编号已存在'));
        return;
      }

      // 计算成本
      const analysis = calculateCostAnalysis(data.costItems, data.salePrice);

      const updatedCostCard: CostCard = {
        ...mockCostCards[index],
        ...data,
        ...analysis,
        version: mockCostCards[index].version + 1,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedBy: '管理员'
      };

      mockCostCards[index] = updatedCostCard;
      resolve(updatedCostCard);
    }, 500);
  });
};

// 删除成本卡
export const deleteCostCard = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCostCards = mockCostCards.filter(item => item.id !== id);
      resolve();
    }, 300);
  });
};

// 批量删除成本卡
export const batchDeleteCostCards = (ids: string[]): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCostCards = mockCostCards.filter(item => !ids.includes(item.id));
      resolve();
    }, 500);
  });
};

// 更改成本卡状态
export const updateCostCardStatus = (id: string, status: CostCardStatus): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const costCard = mockCostCards.find(item => item.id === id);
      if (!costCard) {
        reject(new Error('成本卡不存在'));
        return;
      }
      
      costCard.status = status;
      costCard.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      resolve();
    }, 300);
  });
};

// 获取成本卡详情
export const getCostCardDetail = (id: string): Promise<CostCard> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const costCard = mockCostCards.find(item => item.id === id);
      if (!costCard) {
        reject(new Error('成本卡不存在'));
        return;
      }
      resolve(costCard);
    }, 300);
  });
};

// 成本分析
export const analyzeCost = (costItems: CostItem[], salePrice?: number): Promise<CostAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysis = calculateCostAnalysis(costItems, salePrice);
      resolve(analysis);
    }, 200);
  });
};

// 计算成本分析（内部方法）
const calculateCostAnalysis = (costItems: CostItem[], salePrice?: number): CostAnalysis => {
  const materialCost = costItems
    .filter(item => item.type === CostItemType.MATERIAL)
    .reduce((sum, item) => sum + item.totalCost, 0);
    
  const laborCost = costItems
    .filter(item => item.type === CostItemType.LABOR)
    .reduce((sum, item) => sum + item.totalCost, 0);
    
  const overheadCost = costItems
    .filter(item => item.type === CostItemType.OVERHEAD)
    .reduce((sum, item) => sum + item.totalCost, 0);
    
  const packagingCost = costItems
    .filter(item => item.type === CostItemType.PACKAGING)
    .reduce((sum, item) => sum + item.totalCost, 0);
    
  const totalCost = materialCost + laborCost + overheadCost + packagingCost;
  
  const profit = salePrice ? salePrice - totalCost : undefined;
  const profitMargin = salePrice && totalCost > 0 ? ((salePrice - totalCost) / salePrice) * 100 : undefined;
  
  return {
    totalCost,
    materialCost,
    materialPercent: totalCost > 0 ? (materialCost / totalCost) * 100 : 0,
    laborCost,
    laborPercent: totalCost > 0 ? (laborCost / totalCost) * 100 : 0,
    overheadCost,
    overheadPercent: totalCost > 0 ? (overheadCost / totalCost) * 100 : 0,
    packagingCost,
    packagingPercent: totalCost > 0 ? (packagingCost / totalCost) * 100 : 0,
    salePrice,
    profit,
    profitMargin
  };
};
