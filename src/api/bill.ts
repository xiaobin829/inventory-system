/**
 * 入库单/出库单/损耗单/调拨单 Mock API
 */

import type { InboundBill, InboundBillQuery, OutboundBill, OutboundBillQuery, LossOrder, LossOrderQuery, TransferOrder, TransferOrderQuery, CheckOrder, CheckOrderQuery, PurchaseOrder, PurchaseOrderQuery } from '@/types/bill';
import { InboundType, OutboundType, BillStatus, LossType, CheckType, PurchaseOrderStatus } from '@/types/bill';

// 客户接口
export interface Customer {
  id: string;
  name: string;
  type: 'customer' | 'department';
}

// Mock 客户/部门数据
const mockCustomers: Customer[] = [
  { id: 'cust-001', name: '星巴克门店', type: 'customer' },
  { id: 'cust-002', name: '喜茶门店', type: 'customer' },
  { id: 'cust-003', name: '奈雪的茶', type: 'customer' },
  { id: 'cust-004', name: '瑞幸咖啡', type: 'customer' },
  { id: 'cust-005', name: '蜜雪冰城', type: 'customer' },
  { id: 'dept-001', name: '生产部门', type: 'department' },
  { id: 'dept-002', name: '研发部门', type: 'department' },
  { id: 'dept-003', name: '行政部门', type: 'department' },
];

// 获取客户列表
export const getCustomerList = (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockCustomers]);
    }, 200);
  });
};

export { CheckType };

// Mock 入库单数据
let mockInboundBills: InboundBill[] = [
  {
    id: 'in-001',
    billNo: 'RK-2024-0001',
    type: InboundType.PURCHASE,
    status: BillStatus.COMPLETED,
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    supplierId: 'sup-1',
    supplierName: '茶叶供应商A',
    items: [
      {
        id: 'item-1',
        itemId: 'mat-3',
        itemName: '红茶',
        itemCode: 'MAT-003',
        itemType: 'material',
        specification: '100g/包',
        unit: 'g',
        quantity: 1000,
        unitPrice: 0.10,
        totalAmount: 100
      }
    ],
    totalQuantity: 1000,
    totalAmount: 100,
    operator: '张三',
    approver: '李四',
    inboundDate: '2024-01-30',
    createTime: '2024-01-30 10:00:00',
    updateTime: '2024-01-30 15:00:00',
    approveTime: '2024-01-30 14:00:00',
    completeTime: '2024-01-30 15:00:00'
  },
  {
    id: 'in-002',
    billNo: 'RK-2024-0002',
    type: InboundType.PRODUCTION,
    status: BillStatus.APPROVED,
    warehouseId: 'wh-2',
    warehouseName: '成品仓库',
    items: [
      {
        id: 'item-2',
        itemId: 'prod-1',
        itemName: '招牌奶茶',
        itemCode: 'PROD-001',
        itemType: 'product',
        specification: '500ml',
        unit: '杯',
        quantity: 50,
        unitPrice: 15.00,
        totalAmount: 750
      },
      {
        id: 'item-3',
        itemId: 'prod-2',
        itemName: '珍珠奶茶',
        itemCode: 'PROD-002',
        itemType: 'product',
        specification: '500ml',
        unit: '杯',
        quantity: 30,
        unitPrice: 18.00,
        totalAmount: 540
      }
    ],
    totalQuantity: 80,
    totalAmount: 1290,
    operator: '王五',
    approver: '李四',
    inboundDate: '2024-01-31',
    createTime: '2024-01-31 09:00:00',
    updateTime: '2024-01-31 11:00:00',
    approveTime: '2024-01-31 11:00:00'
  },
  {
    id: 'in-003',
    billNo: 'RK-2024-0003',
    type: InboundType.RETURN,
    status: BillStatus.SUBMITTED,
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    supplierId: 'cust-1',
    supplierName: '客户退货-星巴克门店',
    items: [
      {
        id: 'item-4',
        itemId: 'mat-5',
        itemName: '椰果',
        itemCode: 'MAT-005',
        itemType: 'material',
        specification: '500g/袋',
        unit: '袋',
        quantity: 10,
        unitPrice: 12.00,
        totalAmount: 120
      }
    ],
    totalQuantity: 10,
    totalAmount: 120,
    operator: '赵六',
    inboundDate: '2024-02-01',
    createTime: '2024-02-01 14:00:00',
    updateTime: '2024-02-01 14:30:00'
  },
  {
    id: 'in-004',
    billNo: 'RK-2024-0004',
    type: InboundType.PURCHASE,
    status: BillStatus.DRAFT,
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    supplierId: 'sup-2',
    supplierName: '包装材料供应商B',
    items: [
      {
        id: 'item-5',
        itemId: 'mat-8',
        itemName: '塑料杯',
        itemCode: 'MAT-008',
        itemType: 'material',
        specification: '500ml',
        unit: '个',
        quantity: 500,
        unitPrice: 0.50,
        totalAmount: 250
      },
      {
        id: 'item-6',
        itemId: 'mat-9',
        itemName: '杯盖',
        itemCode: 'MAT-009',
        itemType: 'material',
        specification: '通用',
        unit: '个',
        quantity: 500,
        unitPrice: 0.20,
        totalAmount: 100
      }
    ],
    totalQuantity: 1000,
    totalAmount: 350,
    operator: '张三',
    inboundDate: '2024-02-02',
    createTime: '2024-02-02 10:00:00',
    updateTime: '2024-02-02 10:00:00'
  }
];

// 获取入库单列表
export const getInboundBills = (params: InboundBillQuery): Promise<{ list: InboundBill[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockInboundBills];

      if (params.type) {
        filteredData = filteredData.filter(item => item.type === params.type);
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.billNo.toLowerCase().includes(keyword)
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

// Mock 出库单数据
let mockOutboundBills: OutboundBill[] = [
  {
    id: 'out-001',
    billNo: 'CK-2024-0001',
    type: OutboundType.SALE,
    status: BillStatus.COMPLETED,
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    customerId: 'cust-001',
    customerName: '星巴克门店',
    items: [
      {
        id: 'item-1',
        itemId: 'prod-1',
        itemName: '招牌奶茶',
        itemCode: 'PROD-001',
        itemType: 'product',
        specification: '500ml',
        unit: '杯',
        quantity: 100,
        unitPrice: 18.00,
        totalAmount: 1800
      }
    ],
    totalQuantity: 100,
    totalAmount: 1800,
    operator: '张三',
    approver: '李四',
    outboundDate: '2024-01-30',
    createTime: '2024-01-30 10:00:00',
    updateTime: '2024-01-30 15:00:00',
    approveTime: '2024-01-30 14:00:00',
    completeTime: '2024-01-30 15:00:00'
  },
  {
    id: 'out-002',
    billNo: 'CK-2024-0002',
    type: OutboundType.PRODUCTION,
    status: BillStatus.APPROVED,
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    customerId: 'dept-001',
    customerName: '生产部门',
    items: [
      {
        id: 'item-2',
        itemId: 'mat-3',
        itemName: '红茶',
        itemCode: 'MAT-003',
        itemType: 'material',
        specification: '100g/包',
        unit: 'g',
        quantity: 500,
        unitPrice: 0.10,
        totalAmount: 50
      },
      {
        id: 'item-3',
        itemId: 'mat-1',
        itemName: '珍珠',
        itemCode: 'MAT-001',
        itemType: 'material',
        specification: '1kg/袋',
        unit: 'kg',
        quantity: 5,
        unitPrice: 25.00,
        totalAmount: 125
      }
    ],
    totalQuantity: 505,
    totalAmount: 175,
    operator: '王五',
    approver: '李四',
    outboundDate: '2024-01-31',
    createTime: '2024-01-31 09:00:00',
    updateTime: '2024-01-31 11:00:00',
    approveTime: '2024-01-31 11:00:00'
  },
  {
    id: 'out-003',
    billNo: 'CK-2024-0003',
    type: OutboundType.LOSS,
    status: BillStatus.SUBMITTED,
    warehouseId: 'wh-2',
    warehouseName: '成品仓库',
    items: [
      {
        id: 'item-4',
        itemId: 'mat-5',
        itemName: '椰果',
        itemCode: 'MAT-005',
        itemType: 'material',
        specification: '500g/袋',
        unit: '袋',
        quantity: 10,
        unitPrice: 12.00,
        totalAmount: 120
      }
    ],
    totalQuantity: 10,
    totalAmount: 120,
    operator: '赵六',
    outboundDate: '2024-02-01',
    createTime: '2024-02-01 14:00:00',
    updateTime: '2024-02-01 14:30:00',
    remark: '过期报损'
  },
  {
    id: 'out-004',
    billNo: 'CK-2024-0004',
    type: OutboundType.TRANSFER,
    status: BillStatus.DRAFT,
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    items: [
      {
        id: 'item-5',
        itemId: 'mat-8',
        itemName: '塑料杯',
        itemCode: 'MAT-008',
        itemType: 'material',
        specification: '500ml',
        unit: '个',
        quantity: 300,
        unitPrice: 0.50,
        totalAmount: 150
      },
      {
        id: 'item-6',
        itemId: 'mat-9',
        itemName: '杯盖',
        itemCode: 'MAT-009',
        itemType: 'material',
        specification: '通用',
        unit: '个',
        quantity: 300,
        unitPrice: 0.20,
        totalAmount: 60
      }
    ],
    totalQuantity: 600,
    totalAmount: 210,
    operator: '张三',
    outboundDate: '2024-02-02',
    createTime: '2024-02-02 10:00:00',
    updateTime: '2024-02-02 10:00:00',
    remark: '调拨至分店仓库'
  },
  {
    id: 'out-005',
    billNo: 'CK-2024-0005',
    type: OutboundType.SALE,
    status: BillStatus.COMPLETED,
    warehouseId: 'wh-2',
    warehouseName: '成品仓库',
    customerId: 'cust-002',
    customerName: '喜茶门店',
    items: [
      {
        id: 'item-7',
        itemId: 'prod-2',
        itemName: '珍珠奶茶',
        itemCode: 'PROD-002',
        itemType: 'product',
        specification: '500ml',
        unit: '杯',
        quantity: 50,
        unitPrice: 20.00,
        totalAmount: 1000
      },
      {
        id: 'item-8',
        itemId: 'prod-3',
        itemName: '芒果冰沙',
        itemCode: 'PROD-003',
        itemType: 'product',
        specification: '500ml',
        unit: '杯',
        quantity: 30,
        unitPrice: 22.00,
        totalAmount: 660
      }
    ],
    totalQuantity: 80,
    totalAmount: 1660,
    operator: '李四',
    approver: '张三',
    outboundDate: '2024-02-03',
    createTime: '2024-02-03 09:00:00',
    updateTime: '2024-02-03 16:00:00',
    approveTime: '2024-02-03 15:00:00',
    completeTime: '2024-02-03 16:00:00'
  }
];

// 获取出库单列表
export const getOutboundBills = (params: OutboundBillQuery): Promise<{ list: OutboundBill[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockOutboundBills];

      if (params.type) {
        filteredData = filteredData.filter(item => item.type === params.type);
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.billNo.toLowerCase().includes(keyword)
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

// Mock 损耗单数据
const mockLossOrders: LossOrder[] = [
  {
    id: 'loss-001',
    billNo: 'SH-2024-0001',
    date: '2024-01-28',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    lossType: LossType.EXPIRY,
    reason: '红茶原料过期',
    items: [
      { materialId: 'mat-3', materialName: '红茶', specification: '100g/包', unit: 'g', quantity: 500, unitCost: 0.10, totalCost: 50 }
    ],
    totalQuantity: 500,
    totalAmount: 50,
    operatorId: 'user-1',
    operatorName: '张三',
    status: BillStatus.COMPLETED,
    createTime: '2024-01-28 09:00:00'
  },
  {
    id: 'loss-002',
    billNo: 'SH-2024-0002',
    date: '2024-01-30',
    warehouseId: 'wh-2',
    warehouseName: '成品仓库',
    lossType: LossType.DAMAGE,
    reason: '运输过程中包装破损',
    items: [
      { materialId: 'mat-8', materialName: '塑料杯', specification: '500ml', unit: '个', quantity: 50, unitCost: 0.50, totalCost: 25 },
      { materialId: 'mat-9', materialName: '杯盖', specification: '通用', unit: '个', quantity: 30, unitCost: 0.20, totalCost: 6 }
    ],
    totalQuantity: 80,
    totalAmount: 31,
    operatorId: 'user-2',
    operatorName: '李四',
    status: BillStatus.APPROVED,
    createTime: '2024-01-30 14:00:00'
  },
  {
    id: 'loss-003',
    billNo: 'SH-2024-0003',
    date: '2024-02-01',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    lossType: LossType.SHORTAGE,
    reason: '月末盘点发现数量不足',
    items: [
      { materialId: 'mat-5', materialName: '椰果', specification: '500g/袋', unit: '袋', quantity: 5, unitCost: 12.00, totalCost: 60 }
    ],
    totalQuantity: 5,
    totalAmount: 60,
    operatorId: 'user-3',
    operatorName: '王五',
    status: BillStatus.SUBMITTED,
    createTime: '2024-02-01 16:00:00'
  },
  {
    id: 'loss-004',
    billNo: 'SH-2024-0004',
    date: '2024-02-02',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    lossType: LossType.OTHER,
    reason: '样品试用消耗',
    items: [
      { materialId: 'mat-1', materialName: '珍珠', specification: '1kg/袋', unit: 'kg', quantity: 2, unitCost: 25.00, totalCost: 50 }
    ],
    totalQuantity: 2,
    totalAmount: 50,
    operatorId: 'user-1',
    operatorName: '张三',
    status: BillStatus.DRAFT,
    createTime: '2024-02-02 10:00:00'
  }
];

// 获取损耗单列表
export const getLossOrders = (params: LossOrderQuery): Promise<{ list: LossOrder[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockLossOrders];

      if (params.lossType) {
        filteredData = filteredData.filter(item => item.lossType === params.lossType);
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.billNo.toLowerCase().includes(keyword)
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

// 删除损耗单
export const deleteLossOrder = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockLossOrders.findIndex(item => item.id === id);
      if (index > -1) {
        mockLossOrders.splice(index, 1);
      }
      resolve();
    }, 300);
  });
};

// Mock 调拨单数据
const mockTransferOrders: TransferOrder[] = [
  {
    id: 'trans-001',
    billNo: 'DB-2024-0001',
    date: '2024-01-25',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: '中心仓库',
    toWarehouseId: 'wh-2',
    toWarehouseName: '成品仓库',
    reason: '门店补货需求',
    items: [
      { materialId: 'mat-8', materialName: '塑料杯', specification: '500ml', unit: '个', quantity: 200, unitCost: 0.50, totalCost: 100 },
      { materialId: 'mat-9', materialName: '杯盖', specification: '通用', unit: '个', quantity: 200, unitCost: 0.20, totalCost: 40 }
    ],
    totalQuantity: 400,
    totalAmount: 140,
    operatorId: 'user-1',
    operatorName: '张三',
    status: BillStatus.COMPLETED,
    createTime: '2024-01-25 10:00:00'
  },
  {
    id: 'trans-002',
    billNo: 'DB-2024-0002',
    date: '2024-01-28',
    fromWarehouseId: 'wh-1',
    fromWarehouseName: '中心仓库',
    toWarehouseId: 'wh-3',
    toWarehouseName: '分店仓库A',
    reason: '原料周转调拨',
    items: [
      { materialId: 'mat-3', materialName: '红茶', specification: '100g/包', unit: 'g', quantity: 500, unitCost: 0.10, totalCost: 50 },
      { materialId: 'mat-1', materialName: '珍珠', specification: '1kg/袋', unit: 'kg', quantity: 5, unitCost: 25.00, totalCost: 125 }
    ],
    totalQuantity: 505,
    totalAmount: 175,
    operatorId: 'user-2',
    operatorName: '李四',
    status: BillStatus.SUBMITTED,
    createTime: '2024-01-28 14:30:00'
  },
  {
    id: 'trans-003',
    billNo: 'DB-2024-0003',
    date: '2024-02-01',
    fromWarehouseId: 'wh-2',
    fromWarehouseName: '成品仓库',
    toWarehouseId: 'wh-1',
    toWarehouseName: '中心仓库',
    reason: '库存平衡调整',
    items: [
      { materialId: 'mat-5', materialName: '椰果', specification: '500g/袋', unit: '袋', quantity: 20, unitCost: 12.00, totalCost: 240 }
    ],
    totalQuantity: 20,
    totalAmount: 240,
    operatorId: 'user-3',
    operatorName: '王五',
    status: BillStatus.DRAFT,
    createTime: '2024-02-01 09:00:00'
  }
];

// 获取调拨单列表
export const getTransferOrders = (params: TransferOrderQuery): Promise<{ list: TransferOrder[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockTransferOrders];

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.billNo.toLowerCase().includes(keyword)
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

// 删除调拨单
export const deleteTransferOrder = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockTransferOrders.findIndex(item => item.id === id);
      if (index > -1) {
        mockTransferOrders.splice(index, 1);
      }
      resolve();
    }, 300);
  });
};

// Mock 盘点单数据
const mockCheckOrders: CheckOrder[] = [
  {
    id: 'check-001',
    billNo: 'PD-2024-0001',
    date: '2024-01-31',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    checkType: CheckType.FULL,
    items: [
      { materialId: 'mat-1', materialName: '珍珠', specification: '1kg/袋', unit: 'kg', bookQuantity: 100, actualQuantity: 98, diffQuantity: -2, unitCost: 25.00, diffAmount: -50 },
      { materialId: 'mat-3', materialName: '红茶', specification: '100g/包', unit: 'g', bookQuantity: 5000, actualQuantity: 5000, diffQuantity: 0, unitCost: 0.10, diffAmount: 0 },
      { materialId: 'mat-5', materialName: '椰果', specification: '500g/袋', unit: '袋', bookQuantity: 50, actualQuantity: 48, diffQuantity: -2, unitCost: 12.00, diffAmount: -24 }
    ],
    totalQuantity: 5150,
    totalDiffAmount: -74,
    operatorId: 'user-1',
    operatorName: '张三',
    status: BillStatus.COMPLETED,
    createTime: '2024-01-31 09:00:00'
  },
  {
    id: 'check-002',
    billNo: 'PD-2024-0002',
    date: '2024-02-01',
    warehouseId: 'wh-2',
    warehouseName: '成品仓库',
    checkType: CheckType.PARTIAL,
    items: [
      { materialId: 'mat-8', materialName: '塑料杯', specification: '500ml', unit: '个', bookQuantity: 1000, actualQuantity: 995, diffQuantity: -5, unitCost: 0.50, diffAmount: -2.5 },
      { materialId: 'mat-9', materialName: '杯盖', specification: '通用', unit: '个', bookQuantity: 1000, actualQuantity: 1000, diffQuantity: 0, unitCost: 0.20, diffAmount: 0 }
    ],
    totalQuantity: 2000,
    totalDiffAmount: -2.5,
    operatorId: 'user-2',
    operatorName: '李四',
    status: BillStatus.APPROVED,
    createTime: '2024-02-01 14:00:00'
  },
  {
    id: 'check-003',
    billNo: 'PD-2024-0003',
    date: '2024-02-02',
    warehouseId: 'wh-1',
    warehouseName: '中心仓库',
    checkType: CheckType.SPOT,
    items: [
      { materialId: 'mat-1', materialName: '珍珠', specification: '1kg/袋', unit: 'kg', bookQuantity: 98, actualQuantity: 100, diffQuantity: 2, unitCost: 25.00, diffAmount: 50 }
    ],
    totalQuantity: 98,
    totalDiffAmount: 50,
    operatorId: 'user-3',
    operatorName: '王五',
    status: BillStatus.SUBMITTED,
    createTime: '2024-02-02 10:00:00'
  },
  {
    id: 'check-004',
    billNo: 'PD-2024-0004',
    date: '2024-02-03',
    warehouseId: 'wh-3',
    warehouseName: '分店仓库A',
    checkType: CheckType.FULL,
    items: [
      { materialId: 'mat-3', materialName: '红茶', specification: '100g/包', unit: 'g', bookQuantity: 2000, actualQuantity: 1950, diffQuantity: -50, unitCost: 0.10, diffAmount: -5 },
      { materialId: 'mat-1', materialName: '珍珠', specification: '1kg/袋', unit: 'kg', bookQuantity: 20, actualQuantity: 20, diffQuantity: 0, unitCost: 25.00, diffAmount: 0 }
    ],
    totalQuantity: 2020,
    totalDiffAmount: -5,
    operatorId: 'user-1',
    operatorName: '张三',
    status: BillStatus.DRAFT,
    createTime: '2024-02-03 09:00:00'
  }
];

// 获取盘点单列表
export const getCheckOrders = (params: CheckOrderQuery): Promise<{ list: CheckOrder[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockCheckOrders];

      if (params.checkType) {
        filteredData = filteredData.filter(item => item.checkType === params.checkType);
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.billNo.toLowerCase().includes(keyword)
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

// 删除盘点单
export const deleteCheckOrder = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCheckOrders.findIndex(item => item.id === id);
      if (index > -1) {
        mockCheckOrders.splice(index, 1);
      }
      resolve();
    }, 300);
  });
};

// Mock 订货单数据
let mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    billNo: 'DH-2024-0001',
    date: '2024-01-20',
    supplierId: 'sup-001',
    supplierName: '优质茶叶供应商',
    items: [
      { materialId: 'mat-3', materialName: '红茶', specification: '100g/包', unit: 'g', quantity: 2000, unitPrice: 0.10, totalPrice: 200 },
      { materialId: 'mat-4', materialName: '绿茶', specification: '100g/包', unit: 'g', quantity: 1500, unitPrice: 0.12, totalPrice: 180 }
    ],
    totalAmount: 380,
    deliveryDate: '2024-01-25',
    remark: '春茶订购',
    operatorId: 'user-1',
    operatorName: '张三',
    status: PurchaseOrderStatus.COMPLETED,
    createTime: '2024-01-20 09:00:00'
  },
  {
    id: 'po-002',
    billNo: 'DH-2024-0002',
    date: '2024-01-25',
    supplierId: 'sup-002',
    supplierName: '鲜奶乳品公司',
    items: [
      { materialId: 'mat-6', materialName: '鲜牛奶', specification: '1L/瓶', unit: '瓶', quantity: 100, unitPrice: 8.50, totalPrice: 850 },
      { materialId: 'mat-7', materialName: '淡奶油', specification: '500ml/盒', unit: '盒', quantity: 50, unitPrice: 25.00, totalPrice: 1250 }
    ],
    totalAmount: 2100,
    deliveryDate: '2024-01-27',
    operatorId: 'user-2',
    operatorName: '李四',
    status: PurchaseOrderStatus.APPROVED,
    createTime: '2024-01-25 10:30:00'
  },
  {
    id: 'po-003',
    billNo: 'DH-2024-0003',
    date: '2024-01-28',
    supplierId: 'sup-003',
    supplierName: '包装材料批发商',
    items: [
      { materialId: 'mat-8', materialName: '塑料杯', specification: '500ml', unit: '个', quantity: 1000, unitPrice: 0.50, totalPrice: 500 },
      { materialId: 'mat-9', materialName: '杯盖', specification: '通用', unit: '个', quantity: 1000, unitPrice: 0.20, totalPrice: 200 },
      { materialId: 'mat-10', materialName: '吸管', specification: '单独包装', unit: '根', quantity: 1000, unitPrice: 0.05, totalPrice: 50 }
    ],
    totalAmount: 750,
    deliveryDate: '2024-02-01',
    remark: '月度包材订购',
    operatorId: 'user-1',
    operatorName: '张三',
    status: PurchaseOrderStatus.SUBMITTED,
    createTime: '2024-01-28 14:00:00'
  },
  {
    id: 'po-004',
    billNo: 'DH-2024-0004',
    date: '2024-02-01',
    supplierId: 'sup-005',
    supplierName: '糖浆调味品厂',
    items: [
      { materialId: 'mat-11', materialName: '焦糖糖浆', specification: '2.5L/瓶', unit: '瓶', quantity: 20, unitPrice: 45.00, totalPrice: 900 },
      { materialId: 'mat-12', materialName: '香草糖浆', specification: '750ml/瓶', unit: '瓶', quantity: 30, unitPrice: 35.00, totalPrice: 1050 }
    ],
    totalAmount: 1950,
    deliveryDate: '2024-02-05',
    operatorId: 'user-3',
    operatorName: '王五',
    status: PurchaseOrderStatus.DRAFT,
    createTime: '2024-02-01 16:00:00'
  },
  {
    id: 'po-005',
    billNo: 'DH-2024-0005',
    date: '2024-02-02',
    supplierId: 'sup-001',
    supplierName: '优质茶叶供应商',
    items: [
      { materialId: 'mat-1', materialName: '珍珠', specification: '1kg/袋', unit: 'kg', quantity: 50, unitPrice: 25.00, totalPrice: 1250 }
    ],
    totalAmount: 1250,
    deliveryDate: '2024-02-08',
    remark: '珍珠补货',
    operatorId: 'user-2',
    operatorName: '李四',
    status: PurchaseOrderStatus.DRAFT,
    createTime: '2024-02-02 11:00:00'
  }
];

// 获取订货单列表
export const getPurchaseOrders = (params: PurchaseOrderQuery): Promise<{ list: PurchaseOrder[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockPurchaseOrders];

      if (params.supplierId) {
        filteredData = filteredData.filter(item => item.supplierId === params.supplierId);
      }

      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.billNo.toLowerCase().includes(keyword) ||
          item.supplierName.toLowerCase().includes(keyword)
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

// 删除订货单
export const deletePurchaseOrder = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockPurchaseOrders.findIndex(item => item.id === id);
      if (index > -1) {
        mockPurchaseOrders.splice(index, 1);
      }
      resolve();
    }, 300);
  });
};

// 提交订货单
export const submitPurchaseOrder = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockPurchaseOrders.find(item => item.id === id);
      if (order && order.status === PurchaseOrderStatus.DRAFT) {
        order.status = PurchaseOrderStatus.SUBMITTED;
        resolve();
      } else {
        reject(new Error('订货单不存在或状态不正确'));
      }
    }, 300);
  });
};
