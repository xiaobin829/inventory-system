/**
 * 仓库期初相关类型定义
 */

// 期初库存
export interface InitialInventory {
  id: string;
  warehouseId: string;
  warehouseName: string;
  materialId: string;
  materialName: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  batchNo?: string;
  expiryDate?: string;
  remark?: string;
  operatorId: string;
  operatorName: string;
  createTime: string;
}

// 期初库存查询参数
export interface InitialInventoryQuery {
  warehouseId?: string;
  materialId?: string;
  keyword?: string;
  page: number;
  pageSize: number;
}

// 期初库存表单数据
export interface InitialInventoryFormData {
  id?: string;
  warehouseId: string;
  materialId: string;
  quantity: number;
  unitCost: number;
  batchNo?: string;
  expiryDate?: string;
  remark?: string;
}

// 批量导入结果
export interface BatchImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}
