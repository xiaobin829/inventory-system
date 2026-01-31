/**
 * 原材料相关类型定义
 */

// 原材料分类
export interface MaterialCategory {
  id: number
  name: string
  code: string
  parentId: number | null
  children?: MaterialCategory[]
  sort?: number
}

// 计量单位
export type MeasureUnit = 'kg' | 'g' | 'L' | 'ml' | '个' | '包' | '盒' | '袋' | '瓶' | '罐'

// 原材料信息
export interface Material {
  id: number
  code: string // 物料编码
  name: string // 物料名称
  categoryId: number // 分类ID
  categoryName?: string // 分类名称
  spec?: string // 规格
  unit: MeasureUnit // 计量单位
  purchasePrice?: number // 采购价
  salePrice?: number // 销售价
  minStock?: number // 最低库存
  maxStock?: number // 最高库存
  status: boolean // 状态：启用/禁用
  remark?: string // 备注
  createdAt?: string
  updatedAt?: string
}

// 原材料查询参数
export interface MaterialQuery {
  categoryId?: number
  keyword?: string
  status?: boolean
  page?: number
  pageSize?: number
}

// 原材料表单数据
export interface MaterialFormData {
  name: string
  code: string
  categoryId?: number
  spec?: string
  unit: MeasureUnit
  purchasePrice?: number
  salePrice?: number
  minStock?: number
  maxStock?: number
  status: boolean
  remark?: string
}

// 导入Excel数据项
export interface MaterialImportItem {
  name: string
  code: string
  categoryName: string
  spec?: string
  unit: string
  purchasePrice?: number
  salePrice?: number
  minStock?: number
  maxStock?: number
  remark?: string
}
