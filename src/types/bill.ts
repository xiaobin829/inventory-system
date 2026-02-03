/**
 * 入库/出库管理相关类型定义
 */

// 单据类型
export enum BillType {
  IN = 'in',      // 入库
  OUT = 'out'     // 出库
}

// 单据状态
export enum BillStatus {
  DRAFT = 'draft',         // 草稿
  SUBMITTED = 'submitted', // 已提交
  APPROVED = 'approved',   // 已审核
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled'  // 已取消
}

// 入库类型
export enum InboundType {
  PURCHASE = 'purchase',    // 采购入库
  PRODUCTION = 'production', // 生产入库
  RETURN = 'return',        // 退货入库
  TRANSFER = 'transfer',    // 调拨入库
  OTHER = 'other'           // 其他入库
}

// 出库类型
export enum OutboundType {
  SALE = 'sale',           // 销售出库
  PRODUCTION = 'production', // 生产领料
  TRANSFER = 'transfer',   // 调拨出库
  LOSS = 'loss',           // 损耗出库
  OTHER = 'other'          // 其他出库
}

// 单据明细项
export interface BillItem {
  id: string;
  itemId: string;           // 物料ID
  itemName: string;         // 物料名称
  itemCode: string;         // 物料编码
  itemType: 'material' | 'product';  // 物料类型
  specification?: string;   // 规格
  unit: string;             // 单位
  quantity: number;         // 数量
  unitPrice?: number;       // 单价
  totalAmount?: number;     // 总金额
  remark?: string;          // 备注
}

// 入库单
export interface InboundBill {
  id: string;
  billNo: string;               // 单据编号
  type: InboundType;            // 入库类型
  status: BillStatus;           // 单据状态
  
  // 仓库信息
  warehouseId: string;          // 仓库ID
  warehouseName: string;        // 仓库名称
  
  // 供应商信息（采购入库）
  supplierId?: string;          // 供应商ID
  supplierName?: string;        // 供应商名称
  
  // 单据明细
  items: BillItem[];            // 明细项列表
  
  // 金额信息
  totalQuantity: number;        // 总数量
  totalAmount: number;          // 总金额
  
  // 操作信息
  operator?: string;            // 操作人
  approver?: string;            // 审核人
  
  // 时间信息
  inboundDate: string;          // 入库日期
  createTime: string;           // 创建时间
  updateTime: string;           // 更新时间
  approveTime?: string;         // 审核时间
  completeTime?: string;        // 完成时间
  
  // 其他
  remark?: string;              // 备注
}

// 出库单
export interface OutboundBill {
  id: string;
  billNo: string;               // 单据编号
  type: OutboundType;           // 出库类型
  status: BillStatus;           // 单据状态
  
  // 仓库信息
  warehouseId: string;          // 仓库ID
  warehouseName: string;        // 仓库名称
  
  // 客户信息（销售出库）
  customerId?: string;          // 客户ID
  customerName?: string;        // 客户名称
  
  // 单据明细
  items: BillItem[];            // 明细项列表
  
  // 数量信息
  totalQuantity: number;        // 总数量
  totalAmount: number;          // 总金额
  
  // 操作信息
  operator?: string;            // 操作人
  approver?: string;            // 审核人
  
  // 时间信息
  outboundDate: string;         // 出库日期
  createTime: string;           // 创建时间
  updateTime: string;           // 更新时间
  approveTime?: string;         // 审核时间
  completeTime?: string;        // 完成时间
  
  // 其他
  remark?: string;              // 备注
}

// 入库单查询参数
export interface InboundBillQuery {
  type?: InboundType;
  status?: BillStatus;
  warehouseId?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 出库单查询参数
export interface OutboundBillQuery {
  type?: OutboundType;
  status?: BillStatus;
  warehouseId?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 入库单表单数据
export interface InboundBillFormData {
  id?: string;
  type: InboundType;
  warehouseId: string;
  supplierId?: string;
  items: BillItem[];
  inboundDate: string;
  remark?: string;
}

// 出库单表单数据
export interface OutboundBillFormData {
  id?: string;
  type: OutboundType;
  warehouseId: string;
  customerId?: string;
  items: BillItem[];
  outboundDate: string;
  remark?: string;
}

// 损耗类型
export enum LossType {
  EXPIRY = 'expiry',       // 过期损耗
  DAMAGE = 'damage',       // 损坏
  SHORTAGE = 'shortage',   // 盘亏
  OTHER = 'other'          // 其他损耗
}

// 损耗单明细
export interface LossDetail {
  materialId: string;
  materialName: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

// 损耗单
export interface LossOrder {
  id: string;
  billNo: string;
  date: string;
  warehouseId: string;
  warehouseName: string;
  lossType: LossType;
  reason?: string;
  items: LossDetail[];
  totalQuantity: number;
  totalAmount: number;
  operatorId: string;
  operatorName: string;
  status: BillStatus;
  createTime: string;
}

// 损耗单查询参数
export interface LossOrderQuery {
  lossType?: LossType;
  status?: BillStatus;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 调拨单明细
export interface TransferDetail {
  materialId: string;
  materialName: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

// 调拨单
export interface TransferOrder {
  id: string;
  billNo: string;
  date: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  reason?: string;
  items: TransferDetail[];
  totalQuantity: number;
  totalAmount: number;
  operatorId: string;
  operatorName: string;
  status: BillStatus;
  createTime: string;
}

// 调拨单查询参数
export interface TransferOrderQuery {
  status?: BillStatus;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 盘点类型
export enum CheckType {
  FULL = 'full',       // 全盘
  PARTIAL = 'partial', // 抽盘
  SPOT = 'spot'        // 临时盘点
}

// 盘点明细
export interface CheckDetail {
  materialId: string;
  materialName: string;
  specification?: string;
  unit: string;
  bookQuantity: number;    // 账面数量
  actualQuantity: number;  // 实际数量
  diffQuantity: number;    // 差异数量
  unitCost: number;
  diffAmount: number;      // 差异金额
}

// 盘点单
export interface CheckOrder {
  id: string;
  billNo: string;
  date: string;
  warehouseId: string;
  warehouseName: string;
  checkType: CheckType;
  items: CheckDetail[];
  totalQuantity: number;
  totalDiffAmount: number;
  operatorId: string;
  operatorName: string;
  status: BillStatus;
  createTime: string;
}

// 盘点单查询参数
export interface CheckOrderQuery {
  checkType?: CheckType;
  status?: BillStatus;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 订货单状态
export enum PurchaseOrderStatus {
  DRAFT = 'draft',         // 草稿
  SUBMITTED = 'submitted', // 已提交
  APPROVED = 'approved',   // 已审核
  COMPLETED = 'completed', // 已完成
  CANCELLED = 'cancelled'  // 已取消
}

// 订货单明细
export interface PurchaseOrderDetail {
  materialId: string;
  materialName: string;
  specification?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// 订货单
export interface PurchaseOrder {
  id: string;
  billNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderDetail[];
  totalAmount: number;
  deliveryDate: string;
  remark?: string;
  operatorId: string;
  operatorName: string;
  status: PurchaseOrderStatus;
  createTime: string;
}

// 订货单查询参数
export interface PurchaseOrderQuery {
  supplierId?: string;
  status?: PurchaseOrderStatus;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}
