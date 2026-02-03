/**
 * 供货商管理 Mock API
 */

import type { Supplier, SupplierQuery, SupplierFormData } from '@/types/supplier';

// Mock 供货商数据
let mockSuppliers: Supplier[] = [
  {
    id: 'sup-001',
    code: 'SUP-001',
    name: '优质茶叶供应商',
    contact: '张经理',
    phone: '13800138001',
    email: 'zhang@tea-supplier.com',
    address: '福建省福州市台江区茶叶批发市场A区12号',
    bankName: '中国工商银行福州分行',
    bankAccount: '6222 0200 0000 1234 567',
    taxNo: '91350100MA12345678',
    creditDays: 30,
    status: 'enabled',
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: 'sup-002',
    code: 'SUP-002',
    name: '鲜奶乳品公司',
    contact: '李总',
    phone: '13900139002',
    email: 'li@dairy-company.com',
    address: '上海市闵行区乳品产业园B栋3层',
    bankName: '中国建设银行上海分行',
    bankAccount: '6227 0012 3456 7890 123',
    taxNo: '91310000MA87654321',
    creditDays: 15,
    status: 'enabled',
    createTime: '2024-01-05 10:30:00'
  },
  {
    id: 'sup-003',
    code: 'SUP-003',
    name: '包装材料批发商',
    contact: '王小姐',
    phone: '13700137003',
    email: 'wang@package-supplies.com',
    address: '广东省广州市白云区包装材料城C区8号',
    bankName: '中国农业银行广州分行',
    bankAccount: '6228 4800 1234 5678 901',
    taxNo: '91440100MA11223344',
    creditDays: 45,
    status: 'enabled',
    createTime: '2024-01-10 14:00:00'
  },
  {
    id: 'sup-004',
    code: 'SUP-004',
    name: '进口水果贸易商',
    contact: '陈先生',
    phone: '13600136004',
    email: 'chen@fruit-import.com',
    address: '广东省深圳市盐田区港口大道88号',
    bankName: '招商银行深圳分行',
    bankAccount: '6214 8300 9876 5432 100',
    taxNo: '91440300MA55667788',
    creditDays: 7,
    status: 'disabled',
    createTime: '2024-01-15 11:00:00'
  },
  {
    id: 'sup-005',
    code: 'SUP-005',
    name: '糖浆调味品厂',
    contact: '刘厂长',
    phone: '13500135005',
    email: 'liu@syrup-factory.com',
    address: '江苏省苏州市吴中区食品工业园D区15号',
    bankName: '中国银行苏州分行',
    bankAccount: '6217 0000 1111 2222 333',
    taxNo: '91320500MA99001122',
    creditDays: 30,
    status: 'enabled',
    createTime: '2024-01-20 16:30:00'
  },
  {
    id: 'sup-006',
    code: 'SUP-006',
    name: '珍珠粉圆工厂',
    contact: '赵师傅',
    phone: '13400134006',
    email: 'zhao@pearl-factory.com',
    address: '台湾省台中市食品加工区18号',
    bankName: '台湾银行台中分行',
    bankAccount: '0123 4567 8901 2345',
    taxNo: 'TW12345678',
    creditDays: 60,
    status: 'disabled',
    createTime: '2024-01-25 09:30:00'
  }
];

// 获取供货商列表
export const getSuppliers = (params: SupplierQuery): Promise<{ list: Supplier[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockSuppliers];

      // 状态筛选
      if (params.status) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.code.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.contact.toLowerCase().includes(keyword) ||
          item.phone.includes(keyword)
        );
      }

      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({ list, total });
    }, 500);
  });
};

// 获取单个供货商
export const getSupplier = (id: string): Promise<Supplier | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const supplier = mockSuppliers.find(item => item.id === id);
      resolve(supplier || null);
    }, 300);
  });
};

// 创建供货商
export const createSupplier = (data: SupplierFormData): Promise<Supplier> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSupplier: Supplier = {
        ...data,
        id: `sup-${Date.now()}`,
        createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      };
      mockSuppliers.unshift(newSupplier);
      resolve(newSupplier);
    }, 300);
  });
};

// 更新供货商
export const updateSupplier = (id: string, data: SupplierFormData): Promise<Supplier> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSuppliers.findIndex(item => item.id === id);
      if (index > -1) {
        mockSuppliers[index] = {
          ...mockSuppliers[index],
          ...data
        };
        resolve(mockSuppliers[index]);
      } else {
        reject(new Error('供货商不存在'));
      }
    }, 300);
  });
};

// 删除供货商
export const deleteSupplier = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockSuppliers.findIndex(item => item.id === id);
      if (index > -1) {
        mockSuppliers.splice(index, 1);
      }
      resolve();
    }, 300);
  });
};

// 切换供货商状态
export const toggleSupplierStatus = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const supplier = mockSuppliers.find(item => item.id === id);
      if (supplier) {
        supplier.status = supplier.status === 'enabled' ? 'disabled' : 'enabled';
        resolve();
      } else {
        reject(new Error('供货商不存在'));
      }
    }, 300);
  });
};

// 获取所有启用的供货商（用于下拉选择）
export const getEnabledSuppliers = (): Promise<Supplier[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enabledSuppliers = mockSuppliers.filter(item => item.status === 'enabled');
      resolve(enabledSuppliers);
    }, 200);
  });
};
