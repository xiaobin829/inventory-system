/**
 * 仓库期初 Mock API
 */

import type { InitialInventory, InitialInventoryQuery, InitialInventoryFormData, BatchImportResult } from '@/types/initial';

// Mock 期初库存数据
let mockInitialInventory: InitialInventory[] = [
  {
    id: 'init-001',
    warehouseId: '1',
    warehouseName: '黔灶',
    materialId: '1',
    materialName: '五花肉',
    specification: '500g/袋',
    unit: 'kg',
    quantity: 50,
    unitCost: 28.5,
    totalCost: 1425,
    batchNo: 'B2024010001',
    expiryDate: '2024-03-15',
    operatorId: 'user-1',
    operatorName: '张三',
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: 'init-002',
    warehouseId: '1',
    warehouseName: '黔灶',
    materialId: '2',
    materialName: '土豆',
    specification: '5kg/箱',
    unit: 'kg',
    quantity: 100,
    unitCost: 3.5,
    totalCost: 350,
    batchNo: 'B2024010002',
    expiryDate: '2024-02-28',
    operatorId: 'user-1',
    operatorName: '张三',
    createTime: '2024-01-01 09:10:00'
  },
  {
    id: 'init-003',
    warehouseId: '1',
    warehouseName: '黔灶',
    materialId: '3',
    materialName: '生抽',
    specification: '1.8L/瓶',
    unit: 'L',
    quantity: 20,
    unitCost: 15.0,
    totalCost: 300,
    batchNo: 'B2024010003',
    expiryDate: '2025-06-30',
    operatorId: 'user-1',
    operatorName: '张三',
    createTime: '2024-01-01 09:15:00'
  },
  {
    id: 'init-004',
    warehouseId: '2',
    warehouseName: '配送中心仓库A',
    materialId: '1',
    materialName: '五花肉',
    specification: '500g/袋',
    unit: 'kg',
    quantity: 80,
    unitCost: 28.5,
    totalCost: 2280,
    batchNo: 'B2024010004',
    expiryDate: '2024-03-20',
    operatorId: 'user-2',
    operatorName: '李四',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 'init-005',
    warehouseId: '2',
    warehouseName: '配送中心仓库A',
    materialId: '2',
    materialName: '土豆',
    specification: '5kg/箱',
    unit: 'kg',
    quantity: 200,
    unitCost: 3.5,
    totalCost: 700,
    batchNo: 'B2024010005',
    expiryDate: '2024-03-01',
    operatorId: 'user-2',
    operatorName: '李四',
    createTime: '2024-01-01 10:10:00'
  },
  {
    id: 'init-006',
    warehouseId: '2',
    warehouseName: '配送中心仓库A',
    materialId: '4',
    materialName: '一次性筷子',
    specification: '100双/包',
    unit: '包',
    quantity: 50,
    unitCost: 8.0,
    totalCost: 400,
    operatorId: 'user-2',
    operatorName: '李四',
    createTime: '2024-01-01 10:20:00'
  },
  {
    id: 'init-007',
    warehouseId: '3',
    warehouseName: '观山湖门店',
    materialId: '1',
    materialName: '五花肉',
    specification: '500g/袋',
    unit: 'kg',
    quantity: 15,
    unitCost: 28.5,
    totalCost: 427.5,
    batchNo: 'B2024010006',
    expiryDate: '2024-03-10',
    operatorId: 'user-3',
    operatorName: '王五',
    createTime: '2024-01-02 08:00:00'
  },
  {
    id: 'init-008',
    warehouseId: '3',
    warehouseName: '观山湖门店',
    materialId: '2',
    materialName: '土豆',
    specification: '5kg/箱',
    unit: 'kg',
    quantity: 30,
    unitCost: 3.5,
    totalCost: 105,
    batchNo: 'B2024010007',
    expiryDate: '2024-02-20',
    operatorId: 'user-3',
    operatorName: '王五',
    createTime: '2024-01-02 08:10:00'
  },
  {
    id: 'init-009',
    warehouseId: '3',
    warehouseName: '观山湖门店',
    materialId: '3',
    materialName: '生抽',
    specification: '1.8L/瓶',
    unit: 'L',
    quantity: 5,
    unitCost: 15.0,
    totalCost: 75,
    batchNo: 'B2024010008',
    expiryDate: '2025-05-15',
    operatorId: 'user-3',
    operatorName: '王五',
    createTime: '2024-01-02 08:20:00'
  },
  {
    id: 'init-010',
    warehouseId: '1',
    warehouseName: '黔灶',
    materialId: '4',
    materialName: '一次性筷子',
    specification: '100双/包',
    unit: '包',
    quantity: 30,
    unitCost: 8.0,
    totalCost: 240,
    operatorId: 'user-1',
    operatorName: '张三',
    createTime: '2024-01-02 09:00:00'
  },
  {
    id: 'init-011',
    warehouseId: '2',
    warehouseName: '配送中心仓库A',
    materialId: '3',
    materialName: '生抽',
    specification: '1.8L/瓶',
    unit: 'L',
    quantity: 40,
    unitCost: 15.0,
    totalCost: 600,
    batchNo: 'B2024010009',
    expiryDate: '2025-08-20',
    operatorId: 'user-2',
    operatorName: '李四',
    createTime: '2024-01-02 10:00:00'
  },
  {
    id: 'init-012',
    warehouseId: '3',
    warehouseName: '观山湖门店',
    materialId: '4',
    materialName: '一次性筷子',
    specification: '100双/包',
    unit: '包',
    quantity: 10,
    unitCost: 8.0,
    totalCost: 80,
    operatorId: 'user-3',
    operatorName: '王五',
    createTime: '2024-01-02 11:00:00'
  }
];

let nextId = 13;

// 模拟网络延迟
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取期初库存列表
 */
export const getInitialInventory = async (params: InitialInventoryQuery): Promise<{ list: InitialInventory[]; total: number }> => {
  await delay();

  let filteredData = [...mockInitialInventory];

  // 根据仓库筛选
  if (params.warehouseId) {
    filteredData = filteredData.filter(item => item.warehouseId === params.warehouseId);
  }

  // 根据物料筛选
  if (params.materialId) {
    filteredData = filteredData.filter(item => item.materialId === params.materialId);
  }

  // 根据关键字搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredData = filteredData.filter(item =>
      item.materialName.toLowerCase().includes(keyword) ||
      (item.batchNo && item.batchNo.toLowerCase().includes(keyword))
    );
  }

  const total = filteredData.length;
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const list = filteredData.slice(start, end);

  return { list, total };
};

/**
 * 创建期初库存
 */
export const createInitialInventory = async (data: InitialInventoryFormData): Promise<InitialInventory> => {
  await delay(800);

  // 模拟获取仓库和物料名称
  const warehouseNames: Record<string, string> = {
    '1': '黔灶',
    '2': '配送中心仓库A',
    '3': '观山湖门店',
    '4': '花溪门店'
  };

  const materialInfo: Record<string, { name: string; spec: string; unit: string }> = {
    '1': { name: '五花肉', spec: '500g/袋', unit: 'kg' },
    '2': { name: '土豆', spec: '5kg/箱', unit: 'kg' },
    '3': { name: '生抽', spec: '1.8L/瓶', unit: 'L' },
    '4': { name: '一次性筷子', spec: '100双/包', unit: '包' }
  };

  const material = materialInfo[data.materialId] || { name: '未知物料', spec: '', unit: '' };

  const newItem: InitialInventory = {
    id: `init-${String(nextId++).padStart(3, '0')}`,
    warehouseId: data.warehouseId,
    warehouseName: warehouseNames[data.warehouseId] || '未知仓库',
    materialId: data.materialId,
    materialName: material.name,
    specification: material.spec,
    unit: material.unit,
    quantity: data.quantity,
    unitCost: data.unitCost,
    totalCost: data.quantity * data.unitCost,
    batchNo: data.batchNo,
    expiryDate: data.expiryDate,
    remark: data.remark,
    operatorId: 'user-1',
    operatorName: '当前用户',
    createTime: new Date().toLocaleString('zh-CN')
  };

  mockInitialInventory.push(newItem);

  return newItem;
};

/**
 * 更新期初库存
 */
export const updateInitialInventory = async (id: string, data: InitialInventoryFormData): Promise<InitialInventory> => {
  await delay(800);

  const index = mockInitialInventory.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error('期初库存记录不存在');
  }

  // 模拟获取仓库和物料名称
  const warehouseNames: Record<string, string> = {
    '1': '黔灶',
    '2': '配送中心仓库A',
    '3': '观山湖门店',
    '4': '花溪门店'
  };

  const materialInfo: Record<string, { name: string; spec: string; unit: string }> = {
    '1': { name: '五花肉', spec: '500g/袋', unit: 'kg' },
    '2': { name: '土豆', spec: '5kg/箱', unit: 'kg' },
    '3': { name: '生抽', spec: '1.8L/瓶', unit: 'L' },
    '4': { name: '一次性筷子', spec: '100双/包', unit: '包' }
  };

  const material = materialInfo[data.materialId] || { name: '未知物料', spec: '', unit: '' };

  const updatedItem: InitialInventory = {
    ...mockInitialInventory[index],
    warehouseId: data.warehouseId,
    warehouseName: warehouseNames[data.warehouseId] || '未知仓库',
    materialId: data.materialId,
    materialName: material.name,
    specification: material.spec,
    unit: material.unit,
    quantity: data.quantity,
    unitCost: data.unitCost,
    totalCost: data.quantity * data.unitCost,
    batchNo: data.batchNo,
    expiryDate: data.expiryDate,
    remark: data.remark
  };

  mockInitialInventory[index] = updatedItem;

  return updatedItem;
};

/**
 * 删除期初库存
 */
export const deleteInitialInventory = async (id: string): Promise<void> => {
  await delay(300);

  const index = mockInitialInventory.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error('期初库存记录不存在');
  }

  mockInitialInventory.splice(index, 1);
};

/**
 * 批量导入期初库存
 */
export const batchImportInitialInventory = async (data: InitialInventoryFormData[]): Promise<BatchImportResult> => {
  await delay(1000);

  const warehouseNames: Record<string, string> = {
    '1': '黔灶',
    '2': '配送中心仓库A',
    '3': '观山湖门店',
    '4': '花溪门店'
  };

  const materialInfo: Record<string, { name: string; spec: string; unit: string }> = {
    '1': { name: '五花肉', spec: '500g/袋', unit: 'kg' },
    '2': { name: '土豆', spec: '5kg/箱', unit: 'kg' },
    '3': { name: '生抽', spec: '1.8L/瓶', unit: 'L' },
    '4': { name: '一次性筷子', spec: '100双/包', unit: '包' }
  };

  const result: BatchImportResult = {
    success: 0,
    failed: 0,
    errors: []
  };

  data.forEach((item, index) => {
    // 验证数据
    if (!item.warehouseId || !warehouseNames[item.warehouseId]) {
      result.failed++;
      result.errors.push({ row: index + 1, message: '无效的仓库ID' });
      return;
    }

    if (!item.materialId || !materialInfo[item.materialId]) {
      result.failed++;
      result.errors.push({ row: index + 1, message: '无效的物料ID' });
      return;
    }

    if (!item.quantity || item.quantity <= 0) {
      result.failed++;
      result.errors.push({ row: index + 1, message: '数量必须大于0' });
      return;
    }

    if (!item.unitCost || item.unitCost < 0) {
      result.failed++;
      result.errors.push({ row: index + 1, message: '单价必须大于等于0' });
      return;
    }

    // 添加数据
    const material = materialInfo[item.materialId];
    const newItem: InitialInventory = {
      id: `init-${String(nextId++).padStart(3, '0')}`,
      warehouseId: item.warehouseId,
      warehouseName: warehouseNames[item.warehouseId],
      materialId: item.materialId,
      materialName: material.name,
      specification: material.spec,
      unit: material.unit,
      quantity: item.quantity,
      unitCost: item.unitCost,
      totalCost: item.quantity * item.unitCost,
      batchNo: item.batchNo,
      expiryDate: item.expiryDate,
      remark: item.remark,
      operatorId: 'user-1',
      operatorName: '当前用户',
      createTime: new Date().toLocaleString('zh-CN')
    };

    mockInitialInventory.push(newItem);
    result.success++;
  });

  return result;
};

/**
 * 获取启用的仓库列表（用于下拉选择）
 */
export const getEnabledWarehouses = async (): Promise<Array<{ id: string; name: string }>> => {
  await delay(200);

  return [
    { id: '1', name: '黔灶' },
    { id: '2', name: '配送中心仓库A' },
    { id: '3', name: '观山湖门店' },
    { id: '4', name: '花溪门店' }
  ];
};

/**
 * 获取启用的物料列表（用于下拉选择）
 */
export const getEnabledMaterials = async (): Promise<Array<{ id: string; name: string; spec: string; unit: string; price: number }>> => {
  await delay(200);

  return [
    { id: '1', name: '五花肉', spec: '500g/袋', unit: 'kg', price: 28.5 },
    { id: '2', name: '土豆', spec: '5kg/箱', unit: 'kg', price: 3.5 },
    { id: '3', name: '生抽', spec: '1.8L/瓶', unit: 'L', price: 15.0 },
    { id: '4', name: '一次性筷子', spec: '100双/包', unit: '包', price: 8.0 }
  ];
};
