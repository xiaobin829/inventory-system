/**
 * 库存管理相关类型定义
 */

// 库存类型
export enum StockType {
  MATERIAL = 'material',  // 原材料
  PRODUCT = 'product'     // 成品
}

// 库存预警等级
export enum WarningLevel {
  NORMAL = 'normal',      // 正常
  LOW = 'low',            // 偏低
  CRITICAL = 'critical',  // 紧急
  OVERFLOW = 'overflow'   // 超储
}

// 实时库存信息
export interface RealtimeStock {
  id: string;
  type: StockType;              // 库存类型
  
  // 物料信息
  itemId: string;               // 物料ID（原材料或成品）
  itemName: string;             // 物料名称
  itemCode: string;             // 物料编码
  categoryName: string;         // 分类名称
  specification?: string;       // 规格
  unit: string;                 // 单位
  
  // 仓库信息
  warehouseId: string;          // 仓库ID
  warehouseName: string;        // 仓库名称
  
  // 库存数量
  quantity: number;             // 当前库存
  availableQuantity: number;    // 可用库存
  lockedQuantity: number;       // 锁定库存
  
  // 库存设置
  minStock?: number;            // 最低库存
  maxStock?: number;            // 最高库存
  safetyStock?: number;         // 安全库存
  
  // 预警状态
  warningLevel: WarningLevel;   // 预警等级
  
  // 成本信息
  unitCost?: number;            // 单位成本
  totalCost?: number;           // 总成本
  
  // 时间信息
  lastInTime?: string;          // 最后入库时间
  lastOutTime?: string;         // 最后出库时间
  updateTime: string;           // 更新时间
}

// 实时库存查询参数
export interface RealtimeStockQuery {
  type?: StockType;
  warehouseId?: string;
  categoryId?: string;
  keyword?: string;
  warningLevel?: WarningLevel;
  page: number;
  pageSize: number;
}

// 库存统计信息
export interface StockStatistics {
  totalItems: number;           // 总物料数
  totalQuantity: number;        // 总库存数量
  totalValue: number;           // 总库存价值
  
  normalCount: number;          // 正常库存数量
  lowStockCount: number;        // 低库存数量
  criticalCount: number;        // 紧急库存数量
  overflowCount: number;        // 超储库存数量
  
  warehouseStats: {             // 分仓库统计
    warehouseId: string;
    warehouseName: string;
    itemCount: number;
    totalValue: number;
  }[];
}

// 库存预警项
export interface StockWarning {
  id: string;
  type: StockType;
  itemId: string;
  itemName: string;
  itemCode: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  minStock?: number;
  maxStock?: number;
  warningLevel: WarningLevel;
  warningReason: string;
  createTime: string;
}
