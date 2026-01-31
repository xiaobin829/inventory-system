/**
 * 实时库存 Mock API
 */

import type { RealtimeStock, RealtimeStockQuery, StockStatistics, StockWarning } from '@/types/stock';
import { StockType, WarningLevel } from '@/types/stock';

// Mock 实时库存数据
const mockRealtimeStock: RealtimeStock[] = [
  {
    id: 'stock-1',
    type: StockType.MATERIAL,
    itemId: 'mat-1',
    itemName: '珍珠',
    itemCode: 'MAT-001',
    categoryName: '原料/配料',
    specification: '500g/袋',
    unit: 'g',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    quantity: 5000,
    availableQuantity: 4500,
    lockedQuantity: 500,
    minStock: 3000,
    maxStock: 10000,
    safetyStock: 4000,
    warningLevel: WarningLevel.NORMAL,
    unitCost: 0.03,
    totalCost: 150,
    lastInTime: '2024-01-30 14:20:00',
    lastOutTime: '2024-01-31 09:15:00',
    updateTime: '2024-01-31 09:15:00'
  },
  {
    id: 'stock-2',
    type: StockType.MATERIAL,
    itemId: 'mat-2',
    itemName: '牛奶',
    itemCode: 'MAT-002',
    categoryName: '原料/乳制品',
    specification: '1L/盒',
    unit: 'ml',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    quantity: 15000,
    availableQuantity: 15000,
    lockedQuantity: 0,
    minStock: 10000,
    maxStock: 30000,
    safetyStock: 12000,
    warningLevel: WarningLevel.NORMAL,
    unitCost: 0.015,
    totalCost: 225,
    lastInTime: '2024-01-29 10:00:00',
    lastOutTime: '2024-01-31 08:30:00',
    updateTime: '2024-01-31 08:30:00'
  },
  {
    id: 'stock-3',
    type: StockType.MATERIAL,
    itemId: 'mat-3',
    itemName: '红茶',
    itemCode: 'MAT-003',
    categoryName: '原料/茶叶',
    specification: '100g/包',
    unit: 'g',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    quantity: 800,
    availableQuantity: 800,
    lockedQuantity: 0,
    minStock: 1000,
    maxStock: 5000,
    safetyStock: 1500,
    warningLevel: WarningLevel.LOW,
    unitCost: 0.10,
    totalCost: 80,
    lastInTime: '2024-01-25 15:00:00',
    lastOutTime: '2024-01-31 10:00:00',
    updateTime: '2024-01-31 10:00:00'
  },
  {
    id: 'stock-4',
    type: StockType.MATERIAL,
    itemId: 'mat-4',
    itemName: '糖浆',
    itemCode: 'MAT-004',
    categoryName: '原料/糖类',
    specification: '500ml/瓶',
    unit: 'ml',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    quantity: 300,
    availableQuantity: 300,
    lockedQuantity: 0,
    minStock: 2000,
    maxStock: 8000,
    safetyStock: 3000,
    warningLevel: WarningLevel.CRITICAL,
    unitCost: 0.033,
    totalCost: 9.9,
    lastInTime: '2024-01-20 16:00:00',
    lastOutTime: '2024-01-31 11:00:00',
    updateTime: '2024-01-31 11:00:00'
  },
  {
    id: 'stock-5',
    type: StockType.MATERIAL,
    itemId: 'mat-5',
    itemName: '芒果',
    itemCode: 'MAT-005',
    categoryName: '原料/水果',
    specification: '500g/盒',
    unit: 'g',
    warehouseId: 'wh-2',
    warehouseName: '门店A',
    quantity: 3000,
    availableQuantity: 3000,
    lockedQuantity: 0,
    minStock: 2000,
    maxStock: 8000,
    safetyStock: 3000,
    warningLevel: WarningLevel.NORMAL,
    unitCost: 0.04,
    totalCost: 120,
    lastInTime: '2024-01-30 09:00:00',
    lastOutTime: '2024-01-31 07:30:00',
    updateTime: '2024-01-31 07:30:00'
  },
  {
    id: 'stock-6',
    type: StockType.PRODUCT,
    itemId: 'prod-1',
    itemName: '珍珠奶茶',
    itemCode: 'PROD-001',
    categoryName: '茶饮类/奶茶系列',
    specification: '500ml',
    unit: '个',
    warehouseId: 'wh-2',
    warehouseName: '门店A',
    quantity: 120,
    availableQuantity: 100,
    lockedQuantity: 20,
    minStock: 50,
    maxStock: 200,
    safetyStock: 80,
    warningLevel: WarningLevel.NORMAL,
    unitCost: 8.50,
    totalCost: 1020,
    lastInTime: '2024-01-31 08:00:00',
    lastOutTime: '2024-01-31 11:30:00',
    updateTime: '2024-01-31 11:30:00'
  },
  {
    id: 'stock-7',
    type: StockType.PRODUCT,
    itemId: 'prod-2',
    itemName: '芒果冰沙',
    itemCode: 'PROD-002',
    categoryName: '茶饮类/水果茶系列',
    specification: '500ml',
    unit: '个',
    warehouseId: 'wh-2',
    warehouseName: '门店A',
    quantity: 45,
    availableQuantity: 45,
    lockedQuantity: 0,
    minStock: 30,
    maxStock: 150,
    safetyStock: 50,
    warningLevel: WarningLevel.LOW,
    unitCost: 10.00,
    totalCost: 450,
    lastInTime: '2024-01-31 07:00:00',
    lastOutTime: '2024-01-31 12:00:00',
    updateTime: '2024-01-31 12:00:00'
  },
  {
    id: 'stock-8',
    type: StockType.MATERIAL,
    itemId: 'mat-6',
    itemName: '冰块',
    itemCode: 'MAT-006',
    categoryName: '原料/其他',
    unit: 'g',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    quantity: 50000,
    availableQuantity: 45000,
    lockedQuantity: 5000,
    minStock: 20000,
    maxStock: 40000,
    safetyStock: 25000,
    warningLevel: WarningLevel.OVERFLOW,
    unitCost: 0.005,
    totalCost: 250,
    lastInTime: '2024-01-31 06:00:00',
    lastOutTime: '2024-01-31 10:30:00',
    updateTime: '2024-01-31 10:30:00'
  }
];

// 获取实时库存列表
export const getRealtimeStock = (params: RealtimeStockQuery): Promise<{ list: RealtimeStock[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockRealtimeStock];

      // 按类型筛选
      if (params.type) {
        filteredData = filteredData.filter(item => item.type === params.type);
      }

      // 按仓库筛选
      if (params.warehouseId) {
        filteredData = filteredData.filter(item => item.warehouseId === params.warehouseId);
      }

      // 按分类筛选（模拟）
      if (params.categoryId) {
        filteredData = filteredData.filter(item => item.categoryName.includes(params.categoryId));
      }

      // 按关键字筛选
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.itemName.toLowerCase().includes(keyword) ||
          item.itemCode.toLowerCase().includes(keyword)
        );
      }

      // 按预警等级筛选
      if (params.warningLevel) {
        filteredData = filteredData.filter(item => item.warningLevel === params.warningLevel);
      }

      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({ list, total });
    }, 500);
  });
};

// 获取库存统计信息
export const getStockStatistics = (): Promise<StockStatistics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalItems = mockRealtimeStock.length;
      const totalQuantity = mockRealtimeStock.reduce((sum, item) => sum + item.quantity, 0);
      const totalValue = mockRealtimeStock.reduce((sum, item) => sum + (item.totalCost || 0), 0);
      
      const normalCount = mockRealtimeStock.filter(item => item.warningLevel === WarningLevel.NORMAL).length;
      const lowStockCount = mockRealtimeStock.filter(item => item.warningLevel === WarningLevel.LOW).length;
      const criticalCount = mockRealtimeStock.filter(item => item.warningLevel === WarningLevel.CRITICAL).length;
      const overflowCount = mockRealtimeStock.filter(item => item.warningLevel === WarningLevel.OVERFLOW).length;
      
      // 按仓库统计
      const warehouseMap = new Map<string, { name: string; count: number; value: number }>();
      
      mockRealtimeStock.forEach(item => {
        if (!warehouseMap.has(item.warehouseId)) {
          warehouseMap.set(item.warehouseId, {
            name: item.warehouseName,
            count: 0,
            value: 0
          });
        }
        
        const stat = warehouseMap.get(item.warehouseId)!;
        stat.count++;
        stat.value += item.totalCost || 0;
      });
      
      const warehouseStats = Array.from(warehouseMap.entries()).map(([id, stat]) => ({
        warehouseId: id,
        warehouseName: stat.name,
        itemCount: stat.count,
        totalValue: stat.value
      }));
      
      resolve({
        totalItems,
        totalQuantity,
        totalValue,
        normalCount,
        lowStockCount,
        criticalCount,
        overflowCount,
        warehouseStats
      });
    }, 300);
  });
};

// 获取库存预警列表
export const getStockWarnings = (): Promise<StockWarning[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const warnings: StockWarning[] = mockRealtimeStock
        .filter(item => item.warningLevel !== WarningLevel.NORMAL)
        .map(item => {
          let warningReason = '';
          
          if (item.warningLevel === WarningLevel.CRITICAL) {
            warningReason = `库存严重不足，当前库存 ${item.quantity}，低于最低库存 ${item.minStock}`;
          } else if (item.warningLevel === WarningLevel.LOW) {
            warningReason = `库存偏低，当前库存 ${item.quantity}，接近最低库存 ${item.minStock}`;
          } else if (item.warningLevel === WarningLevel.OVERFLOW) {
            warningReason = `库存超储，当前库存 ${item.quantity}，超过最高库存 ${item.maxStock}`;
          }
          
          return {
            id: item.id,
            type: item.type,
            itemId: item.itemId,
            itemName: item.itemName,
            itemCode: item.itemCode,
            warehouseId: item.warehouseId,
            warehouseName: item.warehouseName,
            currentStock: item.quantity,
            minStock: item.minStock,
            maxStock: item.maxStock,
            warningLevel: item.warningLevel,
            warningReason,
            createTime: item.updateTime
          };
        });
      
      resolve(warnings);
    }, 400);
  });
};

// 导出库存数据
export const exportStockData = (params: RealtimeStockQuery): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('导出库存数据:', params);
      resolve();
    }, 1000);
  });
};
