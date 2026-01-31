import type { Warehouse, WarehouseQuery, WarehouseFormData } from '@/types/warehouse'

// 模拟数据存储
let mockWarehouses: Warehouse[] = [
  {
    id: 1,
    code: 'CK000001',
    name: '黔灶',
    type: 'distribution',
    contact: '黔灶',
    phone: '15338513396',
    address: '贵州省贵阳市云岩区中华北路1号',
    status: true,
    openingStatus: 'unconfirmed',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    code: 'CK000002',
    name: '配送中心仓库A',
    type: 'distribution',
    contact: '张三',
    phone: '13800138000',
    address: '贵州省贵阳市南明区花果园大街100号',
    status: true,
    openingStatus: 'confirmed',
    createdAt: '2024-02-01 14:20:00',
    updatedAt: '2024-02-01 14:20:00'
  },
  {
    id: 3,
    code: 'MD000001',
    name: '观山湖门店',
    type: 'store',
    contact: '李四',
    phone: '13900139000',
    address: '贵州省贵阳市观山湖区金阳大道200号',
    status: true,
    openingStatus: 'confirmed',
    createdAt: '2024-02-10 09:15:00',
    updatedAt: '2024-02-10 09:15:00'
  },
  {
    id: 4,
    code: 'MD000002',
    name: '花溪门店',
    type: 'store',
    contact: '王五',
    phone: '13700137000',
    address: '贵州省贵阳市花溪区花溪大道300号',
    status: false,
    openingStatus: 'unconfirmed',
    createdAt: '2024-02-15 16:45:00',
    updatedAt: '2024-02-15 16:45:00'
  }
]

let nextId = 5

// 模拟网络延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取仓库列表
 */
export const getWarehouseList = async (params: WarehouseQuery) => {
  await delay()

  let filteredData = [...mockWarehouses]

  // 根据类型筛选
  if (params.type) {
    filteredData = filteredData.filter(item => item.type === params.type)
  }

  // 根据关键字搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
    )
  }

  // 计算分页
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const total = filteredData.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredData.slice(start, end)

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total,
      page,
      pageSize
    }
  }
}

/**
 * 创建仓库
 */
export const createWarehouse = async (data: WarehouseFormData) => {
  await delay(800)

  // 检查编码是否重复
  const exists = mockWarehouses.some(item => item.code === data.code)
  if (exists) {
    return {
      code: 1,
      message: '仓库编码已存在',
      data: null
    }
  }

  const newWarehouse: Warehouse = {
    id: nextId++,
    name: data.name,
    code: data.code,
    type: data.type!,
    contact: data.contact,
    phone: data.phone,
    address: data.address,
    status: data.status,
    openingStatus: 'unconfirmed',
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN')
  }

  mockWarehouses.push(newWarehouse)

  return {
    code: 0,
    message: 'success',
    data: newWarehouse
  }
}

/**
 * 更新仓库
 */
export const updateWarehouse = async (id: number, data: WarehouseFormData) => {
  await delay(800)

  const index = mockWarehouses.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 1,
      message: '仓库不存在',
      data: null
    }
  }

  // 检查编码是否重复（排除自己）
  const exists = mockWarehouses.some(item => item.id !== id && item.code === data.code)
  if (exists) {
    return {
      code: 1,
      message: '仓库编码已存在',
      data: null
    }
  }

  const updatedWarehouse: Warehouse = {
    ...mockWarehouses[index],
    ...data,
    updatedAt: new Date().toLocaleString('zh-CN')
  }

  mockWarehouses[index] = updatedWarehouse

  return {
    code: 0,
    message: 'success',
    data: updatedWarehouse
  }
}

/**
 * 删除仓库
 */
export const deleteWarehouse = async (id: number) => {
  await delay(800)

  const index = mockWarehouses.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 1,
      message: '仓库不存在',
      data: null
    }
  }

  mockWarehouses.splice(index, 1)

  return {
    code: 0,
    message: 'success',
    data: null
  }
}

/**
 * 切换仓库状态
 */
export const toggleWarehouseStatus = async (id: number, status: boolean) => {
  await delay(500)

  const warehouse = mockWarehouses.find(item => item.id === id)
  if (!warehouse) {
    return {
      code: 1,
      message: '仓库不存在',
      data: null
    }
  }

  warehouse.status = status
  warehouse.updatedAt = new Date().toLocaleString('zh-CN')

  return {
    code: 0,
    message: 'success',
    data: warehouse
  }
}

/**
 * 获取仓库详情
 */
export const getWarehouseDetail = async (id: number) => {
  await delay(300)

  const warehouse = mockWarehouses.find(item => item.id === id)
  if (!warehouse) {
    return {
      code: 1,
      message: '仓库不存在',
      data: null
    }
  }

  return {
    code: 0,
    message: 'success',
    data: warehouse
  }
}
