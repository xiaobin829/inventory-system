/**
 * 入库单 Mock API
 */

import type { InboundBill, InboundBillQuery } from '@/types/bill';
import { InboundType, BillStatus } from '@/types/bill';

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
