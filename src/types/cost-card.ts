/**
 * 成本卡管理相关类型定义
 */

import { MeasureUnit } from './product';

// 成本卡类型
export enum CostCardType {
  PRODUCT = 'product',  // 商品成本卡
  ADDON = 'addon'       // 加料成本卡
}

// 成本卡状态
export enum CostCardStatus {
  DRAFT = 'draft',       // 草稿
  ACTIVE = 'active',     // 生效中
  ARCHIVED = 'archived'  // 已归档
}

// 成本项类型
export enum CostItemType {
  MATERIAL = 'material',     // 原材料
  LABOR = 'labor',           // 人工成本
  OVERHEAD = 'overhead',     // 间接费用
  PACKAGING = 'packaging'    // 包装成本
}

// 成本项
export interface CostItem {
  id: string;
  type: CostItemType;         // 成本类型
  itemId?: string;            // 关联物料ID（原材料等）
  itemName: string;           // 项目名称
  itemCode?: string;          // 项目编码
  quantity: number;           // 用量/数量
  unit: MeasureUnit | string; // 单位
  unitPrice: number;          // 单价
  totalCost: number;          // 总成本
  remark?: string;            // 备注
}

// 成本卡
export interface CostCard {
  id: string;
  code: string;               // 成本卡编号
  name: string;               // 成本卡名称
  type: CostCardType;         // 类型
  
  // 关联信息
  productId?: string;         // 关联成品ID
  productName?: string;       // 关联成品名称
  productCode?: string;       // 关联成品编码
  
  // 成本明细
  costItems: CostItem[];      // 成本项列表
  
  // 成本汇总
  materialCost: number;       // 原材料成本
  laborCost: number;          // 人工成本
  overheadCost: number;       // 间接费用
  packagingCost: number;      // 包装成本
  totalCost: number;          // 总成本
  
  // 价格信息
  salePrice?: number;         // 销售价
  profitMargin?: number;      // 利润率 (%)
  
  // 状态信息
  status: CostCardStatus;     // 状态
  version: number;            // 版本号
  
  // 其他
  remark?: string;            // 备注
  
  // 时间信息
  effectiveDate?: string;     // 生效日期
  createTime: string;
  updateTime: string;
  createdBy?: string;         // 创建人
  updatedBy?: string;         // 更新人
}

// 成本卡查询参数
export interface CostCardQuery {
  type?: CostCardType;
  status?: CostCardStatus;
  keyword?: string;
  page: number;
  pageSize: number;
}

// 成本卡表单数据
export interface CostCardFormData {
  id?: string;
  code: string;
  name: string;
  type: CostCardType;
  
  productId?: string;
  
  costItems: CostItem[];
  
  salePrice?: number;
  
  status: CostCardStatus;
  remark?: string;
  effectiveDate?: string;
}

// 成本分析结果
export interface CostAnalysis {
  totalCost: number;
  materialCost: number;
  materialPercent: number;
  laborCost: number;
  laborPercent: number;
  overheadCost: number;
  overheadPercent: number;
  packagingCost: number;
  packagingPercent: number;
  
  salePrice?: number;
  profit?: number;
  profitMargin?: number;
}
