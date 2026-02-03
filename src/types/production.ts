/**
 * 生产加工相关类型定义
 */

// 生产单状态
export enum ProductionStatus {
  DRAFT = 'draft',           // 草稿
  PROCESSING = 'processing', // 生产中
  COMPLETED = 'completed',   // 已完成
  CANCELLED = 'cancelled'    // 已取消
}

// 物料消耗明细
export interface ProductionMaterial {
  materialId: string;
  materialName: string;
  planQuantity: number;
  actualQuantity: number;
  unit: string;
}

// 生产加工单
export interface ProductionOrder {
  id: string;
  orderNo: string;              // 单据编号
  date: string;                 // 生产日期
  productId: string;            // 成品ID
  productName: string;          // 成品名称
  planQuantity: number;         // 计划数量
  actualQuantity: number;       // 实际数量
  materials: ProductionMaterial[]; // 物料消耗明细
  status: ProductionStatus;     // 状态
  operatorId: string;           // 操作人ID
  operatorName: string;         // 操作人名称
  remark?: string;              // 备注
  startTime?: string;           // 开始时间
  endTime?: string;             // 结束时间
  createTime: string;           // 创建时间
}

// 生产加工单查询参数
export interface ProductionOrderQuery {
  productId?: string;
  status?: ProductionStatus;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 完成生产的数据
export interface CompleteProductionData {
  actualQuantity: number;
  materials: { materialId: string; actualQuantity: number }[];
}
