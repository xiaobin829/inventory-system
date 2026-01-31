import type { Material, MaterialCategory, MaterialQuery, MaterialFormData } from '@/types/material'

// 模拟分类数据
export let mockCategories: MaterialCategory[] = [
  {
    id: 1,
    name: '食材类',
    code: 'FOOD',
    parentId: null,
    sort: 1,
    children: [
      { id: 11, name: '肉类', code: 'MEAT', parentId: 1, sort: 1 },
      { id: 12, name: '蔬菜类', code: 'VEG', parentId: 1, sort: 2 },
      { id: 13, name: '水产类', code: 'SEAFOOD', parentId: 1, sort: 3 }
    ]
  },
  {
    id: 2,
    name: '调料类',
    code: 'SEASONING',
    parentId: null,
    sort: 2,
    children: [
      { id: 21, name: '酱油类', code: 'SOY', parentId: 2, sort: 1 },
      { id: 22, name: '盐类', code: 'SALT', parentId: 2, sort: 2 },
      { id: 23, name: '油类', code: 'OIL', parentId: 2, sort: 3 }
    ]
  },
  {
    id: 3,
    name: '包材类',
    code: 'PACKAGE',
    parentId: null,
    sort: 3,
    children: [
      { id: 31, name: '一次性餐具', code: 'TABLEWARE', parentId: 3, sort: 1 },
      { id: 32, name: '打包盒', code: 'BOX', parentId: 3, sort: 2 }
    ]
  }
]

// 模拟原材料数据
let mockMaterials: Material[] = [
  {
    id: 1,
    code: 'WL000001',
    name: '五花肉',
    categoryId: 11,
    categoryName: '肉类',
    spec: '500g/袋',
    unit: 'kg',
    purchasePrice: 28.5,
    salePrice: 35.0,
    minStock: 10,
    maxStock: 100,
    status: true,
    remark: '优质五花肉',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    code: 'WL000002',
    name: '土豆',
    categoryId: 12,
    categoryName: '蔬菜类',
    spec: '5kg/箱',
    unit: 'kg',
    purchasePrice: 3.5,
    salePrice: 5.0,
    minStock: 20,
    maxStock: 200,
    status: true,
    createdAt: '2024-01-16 11:20:00',
    updatedAt: '2024-01-16 11:20:00'
  },
  {
    id: 3,
    code: 'WL000003',
    name: '生抽',
    categoryId: 21,
    categoryName: '酱油类',
    spec: '1.8L/瓶',
    unit: 'L',
    purchasePrice: 15.0,
    salePrice: 20.0,
    minStock: 5,
    maxStock: 50,
    status: true,
    createdAt: '2024-01-17 14:15:00',
    updatedAt: '2024-01-17 14:15:00'
  },
  {
    id: 4,
    code: 'WL000004',
    name: '一次性筷子',
    categoryId: 31,
    categoryName: '一次性餐具',
    spec: '100双/包',
    unit: '包',
    purchasePrice: 8.0,
    salePrice: 12.0,
    minStock: 10,
    maxStock: 100,
    status: true,
    createdAt: '2024-01-18 09:30:00',
    updatedAt: '2024-01-18 09:30:00'
  }
]

let nextId = 5

// 模拟网络延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取分类树
 */
export const getCategoryTree = async () => {
  await delay(300)
  return {
    code: 0,
    message: 'success',
    data: mockCategories
  }
}

/**
 * 获取原材料列表
 */
export const getMaterialList = async (params: MaterialQuery) => {
  await delay()

  let filteredData = [...mockMaterials]

  // 根据分类筛选
  if (params.categoryId) {
    filteredData = filteredData.filter(item => item.categoryId === params.categoryId)
  }

  // 根据关键字搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
    )
  }

  // 根据状态筛选
  if (params.status !== undefined) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }

  // 计算分页
  const page = params.page || 1
  const pageSize = params.pageSize || 20
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
 * 创建原材料
 */
export const createMaterial = async (data: MaterialFormData) => {
  await delay(800)

  // 检查编码是否重复
  const exists = mockMaterials.some(item => item.code === data.code)
  if (exists) {
    return {
      code: 1,
      message: '物料编码已存在',
      data: null
    }
  }

  // 获取分类名称
  let categoryName = ''
  for (const category of mockCategories) {
    if (category.children) {
      const child = category.children.find(c => c.id === data.categoryId)
      if (child) {
        categoryName = child.name
        break
      }
    }
  }

  const newMaterial: Material = {
    id: nextId++,
    name: data.name,
    code: data.code,
    categoryId: data.categoryId!,
    categoryName,
    spec: data.spec,
    unit: data.unit,
    purchasePrice: data.purchasePrice,
    salePrice: data.salePrice,
    minStock: data.minStock,
    maxStock: data.maxStock,
    status: data.status,
    remark: data.remark,
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN')
  }

  mockMaterials.push(newMaterial)

  return {
    code: 0,
    message: 'success',
    data: newMaterial
  }
}

/**
 * 更新原材料
 */
export const updateMaterial = async (id: number, data: MaterialFormData) => {
  await delay(800)

  const index = mockMaterials.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 1,
      message: '物料不存在',
      data: null
    }
  }

  // 检查编码是否重复（排除自己）
  const exists = mockMaterials.some(item => item.id !== id && item.code === data.code)
  if (exists) {
    return {
      code: 1,
      message: '物料编码已存在',
      data: null
    }
  }

  // 获取分类名称
  let categoryName = ''
  for (const category of mockCategories) {
    if (category.children) {
      const child = category.children.find(c => c.id === data.categoryId)
      if (child) {
        categoryName = child.name
        break
      }
    }
  }

  const updatedMaterial: Material = {
    ...mockMaterials[index],
    name: data.name,
    code: data.code,
    categoryId: data.categoryId!,
    categoryName,
    spec: data.spec,
    unit: data.unit,
    purchasePrice: data.purchasePrice,
    salePrice: data.salePrice,
    minStock: data.minStock,
    maxStock: data.maxStock,
    status: data.status,
    remark: data.remark,
    updatedAt: new Date().toLocaleString('zh-CN')
  }

  mockMaterials[index] = updatedMaterial

  return {
    code: 0,
    message: 'success',
    data: updatedMaterial
  }
}

/**
 * 删除原材料
 */
export const deleteMaterial = async (id: number) => {
  await delay(800)

  const index = mockMaterials.findIndex(item => item.id === id)
  if (index === -1) {
    return {
      code: 1,
      message: '物料不存在',
      data: null
    }
  }

  mockMaterials.splice(index, 1)

  return {
    code: 0,
    message: 'success',
    data: null
  }
}

/**
 * 批量删除原材料
 */
export const batchDeleteMaterials = async (ids: number[]) => {
  await delay(800)

  mockMaterials = mockMaterials.filter(item => !ids.includes(item.id))

  return {
    code: 0,
    message: 'success',
    data: null
  }
}

/**
 * 切换原材料状态
 */
export const toggleMaterialStatus = async (id: number, status: boolean) => {
  await delay(500)

  const material = mockMaterials.find(item => item.id === id)
  if (!material) {
    return {
      code: 1,
      message: '物料不存在',
      data: null
    }
  }

  material.status = status
  material.updatedAt = new Date().toLocaleString('zh-CN')

  return {
    code: 0,
    message: 'success',
    data: material
  }
}
