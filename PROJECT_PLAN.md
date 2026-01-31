# 进销存系统开发计划

## 项目概述
基于 TDesign Vue Next 开发的进销存管理系统，参考网站：https://console.yunjianyao.com/tea/admin/inventory/store

## 技术栈
- **框架**: Vue 3 + TypeScript
- **UI库**: TDesign Vue Next
- **状态管理**: Pinia
- **路由**: Vue Router
- **构建工具**: Vite
- **HTTP客户端**: Axios
- **代码规范**: ESLint + Prettier

## 功能模块

### 1. 仓库管理 (Warehouse Management)
**路径**: `/inventory/warehouse`

**功能点**:
- 仓库列表展示
- 类型筛选（配送中心仓库/门店仓库）
- 仓库信息：名称、编码、类型、联系人、联系方式、地址、状态、期初状态
- 操作：禁用/启用、编辑、期初设置
- 分页功能

**UI组件**:
- t-table（数据表格）
- t-button（操作按钮）
- t-select（类型筛选）
- t-pagination（分页器）

### 2. 仓库期初 (Warehouse Opening)
**路径**: `/inventory/opening`

**功能点**:
- 仓库期初库存设置
- 原材料初始数量录入
- 期初确认状态管理

### 3. 原材料管理 (Material Management)
**路径**: `/inventory/material`

**功能点**:
- 左侧分类树
- 原材料列表（名称、规格、成本单位、订货单位、订货单价、状态）
- 新建原材料
- 导入原材料（Excel）
- 导入记录查看
- 批量操作（启用/禁用）
- 搜索筛选（名称、状态、类型）
- 分类管理（添加分类、分类排序）

**UI组件**:
- t-tree（分类树）
- t-table（数据表格）
- t-dialog（新建/编辑弹窗）
- t-upload（Excel导入）
- t-checkbox（批量选择）

### 4. 成本卡管理 (Cost Card Management)
**路径**: `/inventory/cost-card`

**功能点**:
- 两个Tab：商品成本卡、加料成本卡
- 商品列表展示（商品图片、名称、ID、规格、售价、成本卡状态）
- 搜索筛选（商品名称、商品编码、成本卡状态）
- 配置成本卡（跳转到成本卡编辑页）

### 5. 库存管理 (Stock Management)
**路径**: `/inventory/stock`

**子模块**:
- **实时库存** (`/inventory/stock/realtime`)
  - 查看当前库存数量
  - 库存预警
  
- **入库管理** (`/inventory/stock/in`)
  - 入库单列表
  - 新建入库单
  - 入库审核
  
- **出库管理** (`/inventory/stock/out`)
  - 出库单列表
  - 新建出库单
  - 出库审核
  
- **损耗管理** (`/inventory/stock/loss`)
  - 损耗单列表
  - 损耗登记
  
- **调拨管理** (`/inventory/stock/transfer`)
  - 调拨单列表
  - 创建调拨单
  
- **盘点管理** (`/inventory/stock/inventory`)
  - 盘点单列表
  - 创建盘点单
  - 盘点差异处理

### 6. 订货管理 (Order Management)
**路径**: `/inventory/order`

**子模块**:
- 订货单列表
- 创建订货单
- 订货审核
- 订货收货

### 7. 生产加工 (Production)
**路径**: `/inventory/production`

**子模块**:
- 生产单列表
- 创建生产单
- 生产进度跟踪

### 8. 供货商管理 (Supplier Management)
**路径**: `/inventory/supplier`

**功能点**:
- 供应商列表
- 新建/编辑供应商
- 供应商信息（名称、联系人、联系方式、地址、结算方式）

### 9. 支付设置 (Payment Settings)
**路径**: `/inventory/payment`

**功能点**:
- 支付方式配置
- 结算周期设置

### 10. 进销存报表 (Reports)
**路径**: `/inventory/reports`

**功能点**:
- 库存报表
- 进销存明细
- 成本分析
- 图表展示

### 11. 基础设置 (Basic Settings)
**路径**: `/inventory/settings`

**功能点**:
- 单位管理
- 分类管理
- 其他基础配置

## 开发阶段

### 阶段一：基础框架搭建（第1-2天）
- [x] 初始化 Vite + Vue 3 + TypeScript 项目
- [ ] 安装并配置 TDesign Vue Next
- [ ] 配置路由系统
- [ ] 配置状态管理（Pinia）
- [ ] 创建基础布局组件
- [ ] 配置 Axios 和 API 模块

### 阶段二：核心模块开发（第3-7天）
- [ ] 仓库管理模块
- [ ] 原材料管理模块
- [ ] 成本卡管理模块
- [ ] 库存管理模块（实时库存、入库、出库）

### 阶段三：扩展功能（第8-10天）
- [ ] 调拨管理
- [ ] 盘点管理
- [ ] 订货管理
- [ ] 供货商管理

### 阶段四：报表和设置（第11-12天）
- [ ] 进销存报表
- [ ] 基础设置
- [ ] 支付设置

### 阶段五：优化和测试（第13-14天）
- [ ] UI/UX 优化
- [ ] 性能优化
- [ ] 功能测试
- [ ] Bug 修复

## 目录结构

```
inventory-system/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── warehouse.ts
│   │   ├── material.ts
│   │   ├── stock.ts
│   │   └── ...
│   ├── assets/            # 资源文件
│   ├── components/        # 通用组件
│   │   ├── TableLayout/
│   │   ├── SearchForm/
│   │   └── ...
│   ├── layouts/           # 布局组件
│   │   ├── MainLayout.vue
│   │   └── ...
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── stores/            # 状态管理
│   │   ├── warehouse.ts
│   │   ├── material.ts
│   │   └── ...
│   ├── types/             # TypeScript 类型定义
│   │   ├── warehouse.ts
│   │   ├── material.ts
│   │   └── ...
│   ├── utils/             # 工具函数
│   │   ├── request.ts
│   │   └── ...
│   ├── views/             # 页面组件
│   │   └── inventory/
│   │       ├── warehouse/
│   │       │   ├── index.vue
│   │       │   └── components/
│   │       ├── material/
│   │       ├── cost-card/
│   │       ├── stock/
│   │       │   ├── realtime/
│   │       │   ├── in/
│   │       │   ├── out/
│   │       │   ├── loss/
│   │       │   ├── transfer/
│   │       │   └── inventory/
│   │       └── ...
│   ├── App.vue
│   └── main.ts
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 数据模型

### Warehouse (仓库)
```typescript
interface Warehouse {
  id: number;
  code: string;           // 仓库编码
  name: string;           // 仓库名称
  type: 'distribution' | 'store';  // 类型：配送中心/门店
  contact: string;        // 联系人
  phone: string;          // 联系方式
  address: string;        // 地址
  status: boolean;        // 状态：启用/禁用
  openingStatus: 'confirmed' | 'unconfirmed';  // 期初状态
}
```

### Material (原材料)
```typescript
interface Material {
  id: number;
  name: string;           // 原材料名称
  code: string;           // 编码
  categoryId: number;     // 分类ID
  specification: string;  // 规格
  costUnit: string;       // 成本单位
  orderUnit: string;      // 订货单位
  orderPrice: number;     // 订货单价
  status: boolean;        // 状态
  image?: string;         // 图片
}
```

### CostCard (成本卡)
```typescript
interface CostCard {
  id: number;
  productId: number;      // 商品ID
  productName: string;    // 商品名称
  specification: string;  // 规格
  price: number;          // 售价
  status: 'configured' | 'unconfigured';  // 配置状态
  materials: Array<{
    materialId: number;
    quantity: number;
    unit: string;
  }>;
}
```

## 开发规范

1. **组件命名**: 使用 PascalCase
2. **文件命名**: kebab-case
3. **变量命名**: camelCase
4. **常量命名**: UPPER_SNAKE_CASE
5. **提交信息**: 
   - feat: 新功能
   - fix: 修复bug
   - docs: 文档更新
   - style: 代码格式调整
   - refactor: 重构
   - test: 测试相关
   - chore: 构建/工具链相关

## 注意事项

1. 所有列表页面都需要实现分页
2. 表单需要完整的验证逻辑
3. 操作需要确认提示
4. 敏感操作需要权限控制
5. 所有请求需要统一的错误处理
6. 使用 Mock 数据进行开发（后续对接真实API）
