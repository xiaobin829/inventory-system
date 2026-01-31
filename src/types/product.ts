/**
 * 成品管理相关类型定义
 */

// 计量单位枚举（与原材料保持一致）
export enum MeasureUnit {
  KG = 'kg',      // 千克
  G = 'g',        // 克
  L = 'l',        // 升
  ML = 'ml',      // 毫升
  BAG = 'bag',    // 袋
  BOX = 'box',    // 箱
  PIECE = 'piece' // 个
}

// 成品分类
export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  children?: ProductCategory[];
  count?: number;
}

// BOM配方项
export interface BOMItem {
  id: string;
  materialId: string;     // 原材料ID
  materialName: string;   // 原材料名称
  materialCode: string;   // 原材料编码
  quantity: number;       // 用量
  unit: MeasureUnit;      // 单位
  cost?: number;          // 成本
  remark?: string;        // 备注
}

// 成品信息
export interface Product {
  id: string;
  name: string;                      // 成品名称
  code: string;                      // 成品编码
  categoryId: string;                // 分类ID
  categoryName: string;              // 分类名称
  categoryPath?: string;             // 分类路径（用于显示）
  
  // 规格信息
  specification?: string;            // 规格型号
  unit: MeasureUnit;                 // 计量单位
  
  // 价格信息
  costPrice?: number;                // 成本价
  salePrice?: number;                // 销售价
  marketPrice?: number;              // 市场价
  
  // 库存设置
  minStock?: number;                 // 最低库存
  maxStock?: number;                 // 最高库存
  safetyStock?: number;              // 安全库存
  
  // 成品特有字段
  costCardId?: string;               // 关联成本卡ID
  costCardName?: string;             // 成本卡名称
  bomItems?: BOMItem[];              // BOM配方列表
  productionProcess?: string;        // 生产工艺说明
  shelfLife?: number;                // 保质期（天）
  storageCondition?: string;         // 储存条件
  
  // 其他信息
  barcode?: string;                  // 条形码
  remark?: string;                   // 备注
  
  // 状态信息
  enabled: boolean;                  // 是否启用
  
  // 时间信息
  createTime: string;
  updateTime: string;
}

// 成品查询参数
export interface ProductQuery {
  categoryId?: string;
  keyword?: string;
  status?: boolean;
  page: number;
  pageSize: number;
}

// 成品表单数据
export interface ProductFormData {
  id?: string;
  name: string;
  code: string;
  categoryId: string;
  
  specification?: string;
  unit: MeasureUnit;
  
  costPrice?: number;
  salePrice?: number;
  marketPrice?: number;
  
  minStock?: number;
  maxStock?: number;
  safetyStock?: number;
  
  costCardId?: string;
  bomItems?: BOMItem[];
  productionProcess?: string;
  shelfLife?: number;
  storageCondition?: string;
  
  barcode?: string;
  remark?: string;
  
  enabled: boolean;
}

// BOM配方表单项
export interface BOMFormItem {
  materialId: string;
  quantity: number;
  unit: MeasureUnit;
  remark?: string;
}

// Excel 导入项
export interface ProductImportItem {
  name: string;
  code: string;
  categoryName: string;
  specification?: string;
  unit: string;
  costPrice?: number;
  salePrice?: number;
  minStock?: number;
  maxStock?: number;
  remark?: string;
}
