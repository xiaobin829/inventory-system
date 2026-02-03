/**
 * 生产加工 Mock API
 */

import type { ProductionOrder, ProductionOrderQuery, CompleteProductionData } from '@/types/production';
import { ProductionStatus } from '@/types/production';

// Mock 生产加工单数据
let mockProductionOrders: ProductionOrder[] = [
  {
    id: 'prod-order-001',
    orderNo: 'SC-2024-0001',
    date: '2024-01-28',
    productId: 'prod-1',
    productName: '珍珠奶茶',
    planQuantity: 100,
    actualQuantity: 98,
    materials: [
      { materialId: 'mat-1', materialName: '珍珠', planQuantity: 5000, actualQuantity: 4900, unit: 'g' },
      { materialId: 'mat-2', materialName: '牛奶', planQuantity: 20000, actualQuantity: 19600, unit: 'ml' },
      { materialId: 'mat-3', materialName: '红茶', planQuantity: 2000, actualQuantity: 1960, unit: 'g' },
      { materialId: 'mat-4', materialName: '糖浆', planQuantity: 3000, actualQuantity: 2940, unit: 'ml' }
    ],
    status: ProductionStatus.COMPLETED,
    operatorId: 'user-1',
    operatorName: '张三',
    remark: '春节备货生产',
    startTime: '2024-01-28 08:00:00',
    endTime: '2024-01-28 12:00:00',
    createTime: '2024-01-27 16:00:00'
  },
  {
    id: 'prod-order-002',
    orderNo: 'SC-2024-0002',
    date: '2024-01-30',
    productId: 'prod-2',
    productName: '芒果冰沙',
    planQuantity: 50,
    actualQuantity: 50,
    materials: [
      { materialId: 'mat-5', materialName: '芒果', planQuantity: 7500, actualQuantity: 7500, unit: 'g' },
      { materialId: 'mat-6', materialName: '冰块', planQuantity: 10000, actualQuantity: 10000, unit: 'g' },
      { materialId: 'mat-7', materialName: '糖', planQuantity: 1000, actualQuantity: 1000, unit: 'g' }
    ],
    status: ProductionStatus.COMPLETED,
    operatorId: 'user-2',
    operatorName: '李四',
    startTime: '2024-01-30 09:00:00',
    endTime: '2024-01-30 11:30:00',
    createTime: '2024-01-29 18:00:00'
  },
  {
    id: 'prod-order-003',
    orderNo: 'SC-2024-0003',
    date: '2024-02-01',
    productId: 'prod-1',
    productName: '珍珠奶茶',
    planQuantity: 80,
    actualQuantity: 0,
    materials: [
      { materialId: 'mat-1', materialName: '珍珠', planQuantity: 4000, actualQuantity: 0, unit: 'g' },
      { materialId: 'mat-2', materialName: '牛奶', planQuantity: 16000, actualQuantity: 0, unit: 'ml' },
      { materialId: 'mat-3', materialName: '红茶', planQuantity: 1600, actualQuantity: 0, unit: 'g' },
      { materialId: 'mat-4', materialName: '糖浆', planQuantity: 2400, actualQuantity: 0, unit: 'ml' }
    ],
    status: ProductionStatus.PROCESSING,
    operatorId: 'user-1',
    operatorName: '张三',
    remark: '日常补货',
    startTime: '2024-02-01 08:30:00',
    createTime: '2024-01-31 17:00:00'
  },
  {
    id: 'prod-order-004',
    orderNo: 'SC-2024-0004',
    date: '2024-02-02',
    productId: 'prod-3',
    productName: '红豆吐司',
    planQuantity: 60,
    actualQuantity: 0,
    materials: [
      { materialId: 'mat-8', materialName: '吐司面包', planQuantity: 4800, actualQuantity: 0, unit: 'g' },
      { materialId: 'mat-9', materialName: '红豆沙', planQuantity: 3000, actualQuantity: 0, unit: 'g' }
    ],
    status: ProductionStatus.DRAFT,
    operatorId: 'user-3',
    operatorName: '王五',
    createTime: '2024-02-01 15:00:00'
  },
  {
    id: 'prod-order-005',
    orderNo: 'SC-2024-0005',
    date: '2024-02-03',
    productId: 'prod-2',
    productName: '芒果冰沙',
    planQuantity: 40,
    actualQuantity: 0,
    materials: [
      { materialId: 'mat-5', materialName: '芒果', planQuantity: 6000, actualQuantity: 0, unit: 'g' },
      { materialId: 'mat-6', materialName: '冰块', planQuantity: 8000, actualQuantity: 0, unit: 'g' },
      { materialId: 'mat-7', materialName: '糖', planQuantity: 800, actualQuantity: 0, unit: 'g' }
    ],
    status: ProductionStatus.DRAFT,
    operatorId: 'user-2',
    operatorName: '李四',
    remark: '周末活动备货',
    createTime: '2024-02-02 10:00:00'
  }
];

// 获取生产加工单列表
export const getProductionOrders = (params: ProductionOrderQuery): Promise<{ list: ProductionOrder[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockProductionOrders];

      if (params.productId) {
        filteredData = filteredData.filter(item => item.productId === params.productId);
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.orderNo.toLowerCase().includes(keyword) ||
          item.productName.toLowerCase().includes(keyword)
        );
      }

      if (params.startDate) {
        filteredData = filteredData.filter(item => item.date >= params.startDate!);
      }

      if (params.endDate) {
        filteredData = filteredData.filter(item => item.date <= params.endDate!);
      }

      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({ list, total });
    }, 500);
  });
};

// 删除生产加工单
export const deleteProductionOrder = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockProductionOrders.find(item => item.id === id);
      if (!order) {
        reject(new Error('生产单不存在'));
        return;
      }
      if (order.status !== ProductionStatus.DRAFT) {
        reject(new Error('只能删除草稿状态的生产单'));
        return;
      }
      mockProductionOrders = mockProductionOrders.filter(item => item.id !== id);
      resolve();
    }, 300);
  });
};

// 开始生产
export const startProduction = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockProductionOrders.find(item => item.id === id);
      if (!order) {
        reject(new Error('生产单不存在'));
        return;
      }
      if (order.status !== ProductionStatus.DRAFT) {
        reject(new Error('只能开始草稿状态的生产单'));
        return;
      }
      order.status = ProductionStatus.PROCESSING;
      order.startTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      resolve();
    }, 300);
  });
};

// 完成生产
export const completeProduction = (id: string, data: CompleteProductionData): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockProductionOrders.find(item => item.id === id);
      if (!order) {
        reject(new Error('生产单不存在'));
        return;
      }
      if (order.status !== ProductionStatus.PROCESSING) {
        reject(new Error('只能完成生产中状态的生产单'));
        return;
      }
      order.status = ProductionStatus.COMPLETED;
      order.actualQuantity = data.actualQuantity;
      order.endTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // 更新物料实际消耗
      data.materials.forEach(mat => {
        const material = order.materials.find(m => m.materialId === mat.materialId);
        if (material) {
          material.actualQuantity = mat.actualQuantity;
        }
      });

      resolve();
    }, 300);
  });
};

// 创建生产加工单
export const createProductionOrder = (data: Partial<ProductionOrder>): Promise<ProductionOrder> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newOrder: ProductionOrder = {
        id: `prod-order-${Date.now()}`,
        orderNo: `SC-2024-${String(mockProductionOrders.length + 1).padStart(4, '0')}`,
        date: data.date || new Date().toISOString().split('T')[0],
        productId: data.productId || '',
        productName: data.productName || '',
        planQuantity: data.planQuantity || 0,
        actualQuantity: 0,
        materials: data.materials || [],
        status: ProductionStatus.DRAFT,
        operatorId: 'user-1',
        operatorName: '当前用户',
        remark: data.remark,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      mockProductionOrders.unshift(newOrder);
      resolve(newOrder);
    }, 500);
  });
};

// 更新生产加工单
export const updateProductionOrder = (id: string, data: Partial<ProductionOrder>): Promise<ProductionOrder> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockProductionOrders.findIndex(item => item.id === id);
      if (index === -1) {
        reject(new Error('生产单不存在'));
        return;
      }
      const order = mockProductionOrders[index];
      if (order.status !== ProductionStatus.DRAFT) {
        reject(new Error('只能编辑草稿状态的生产单'));
        return;
      }
      const updatedOrder = {
        ...order,
        ...data,
        id: order.id,
        orderNo: order.orderNo,
        status: order.status,
        createTime: order.createTime
      };
      mockProductionOrders[index] = updatedOrder;
      resolve(updatedOrder);
    }, 500);
  });
};
