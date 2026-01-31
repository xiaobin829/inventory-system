/**
 * 仓库相关类型定义
 */

// 仓库类型
export type WarehouseType = 'distribution' | 'store'

// 期初状态
export type OpeningStatus = 'confirmed' | 'unconfirmed'

// 仓库信息
export interface Warehouse {
  id: number
  code: string // 仓库编码
  name: string // 仓库名称
  type: WarehouseType // 类型：配送中心/门店
  contact: string // 联系人
  phone: string // 联系方式
  address: string // 地址
  status: boolean // 状态：启用/禁用
  openingStatus: OpeningStatus // 期初状态
  createdAt?: string
  updatedAt?: string
}

// 仓库列表查询参数
export interface WarehouseQuery {
  type?: WarehouseType
  keyword?: string
  status?: boolean
  page?: number
  pageSize?: number
}

// 仓库表单数据
export interface WarehouseForm {
  id?: number
  code: string
  name: string
  type: WarehouseType
  contact: string
  phone: string
  address: string
  status: boolean
}

// 仓库表单数据（用于新建/编辑）
export interface WarehouseFormData {
  name: string
  code: string
  type?: WarehouseType
  contact: string
  phone: string
  address: string
  status: boolean
}
