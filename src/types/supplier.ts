/**
 * 供货商管理相关类型定义
 */

// 供货商状态
export type SupplierStatus = 'enabled' | 'disabled';

// 供货商接口
export interface Supplier {
  id: string;
  code: string;              // 供货商编码
  name: string;              // 供货商名称
  contact: string;           // 联系人
  phone: string;             // 联系电话
  email: string;             // 邮箱
  address: string;           // 地址
  bankName: string;          // 开户银行
  bankAccount: string;       // 银行账号
  taxNo: string;             // 税号
  creditDays: number;        // 账期（天）
  status: SupplierStatus;    // 状态
  createTime: string;        // 创建时间
}

// 供货商查询参数
export interface SupplierQuery {
  keyword?: string;          // 搜索关键词
  status?: SupplierStatus;   // 状态筛选
  page: number;
  pageSize: number;
}

// 供货商表单数据
export interface SupplierFormData {
  id?: string;
  code: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  bankName: string;
  bankAccount: string;
  taxNo: string;
  creditDays: number;
  status: SupplierStatus;
}
