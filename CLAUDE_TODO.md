# Claude Code 开发任务队列

## 等待 Claude Code 重置（5:00 AM）

**当前时间**：04:05  
**重置时间**：05:00  
**剩余时间**：55 分钟

---

## 📋 待开发页面清单（优先级排序）

### 第一批 - 库存操作核心功能（P0）

#### 1. 损耗管理 (`stock/loss/index.vue`)
参考：出库管理页面结构
特点：
- 损耗类型筛选（过期、破损、盘亏等）
- 损耗单表格
- Mock 数据：3-4 条损耗记录

#### 2. 调拨管理 (`stock/transfer/index.vue`)
参考：入库/出库管理
特点：
- 源仓库 → 目标仓库
- 调拨单状态流程
- Mock 数据：3-4 条调拨记录

#### 3. 盘点管理 (`stock/inventory/index.vue`)
参考：实时库存页面
特点：
- 盘点单管理
- 盈亏明细
- Mock 数据：2-3 个盘点单

### 第二批 - 辅助管理功能（P1）

#### 4. 供货商管理 (`supplier/index.vue`)
参考：原材料管理结构
特点：
- 供应商列表
- 联系方式、结算信息
- Mock 数据：5-6 个供应商

#### 5. 订货管理 (`order/index.vue`)
参考：入库管理
特点：
- 订单列表
- 订单状态跟踪
- Mock 数据：4-5 个订单

#### 6. 生产加工 (`production/index.vue`)
参考：入库管理（生产入库）
特点：
- 生产计划/任务
- 物料消耗记录
- Mock 数据：3-4 条生产记录

### 第三批 - 配置功能（P2）

#### 7. 仓库期初 (`warehouse/opening.vue`)
特殊：不是列表页，是设置页
特点：
- 初始化库存数据
- 期初数量、成本录入
- 批量导入支持

#### 8. 支付设置 (`payment/index.vue`)
配置页面
特点：
- 支付方式管理
- 收款账户配置

#### 9. 进销存报表 (`reports/index.vue`)
报表汇总页
特点：
- 各类报表入口
- 数据统计图表

#### 10. 基础设置 (`settings/index.vue`)
系统设置页
特点：
- 基础参数配置
- 系统偏好设置

---

## 🎯 开发策略

### 批次执行
- **5:00-6:00**：完成第一批（3 个库存操作页面）
- **6:00-7:00**：完成第二批（3 个辅助管理页面）
- **7:00-8:00**：完成第三批（4 个配置页面）

### 每个页面预计时间
- 简单列表页：10-15 分钟
- 复杂页面（如盘点）：15-20 分钟
- 配置页面：5-10 分钟

### 质量控制
- 每完成一个立即测试
- 确保 Mock 数据完整
- 保持 UI 一致性

---

## ⏰ 5:00 启动命令

```bash
cd inventory-system && ~/.local/bin/claude
```

然后依次发送任务（英文）：

### Task 1: Loss Management
```
Implement Loss Management (损耗管理) page at src/views/inventory/stock/loss/index.vue.

Features:
- Loss type filter (expiry/损坏/盘亏/other)
- Loss bill table (bill no, date, warehouse, type, quantity, amount, operator, status)
- Actions: view, edit, delete
- Mock 3-4 loss records
- Reference stock/out page structure

Keep it simple!
```

### Task 2-10: 类似格式...

---

## 📝 进度追踪

完成后更新：

- [ ] 损耗管理
- [ ] 调拨管理  
- [ ] 盘点管理
- [ ] 供货商管理
- [ ] 订货管理
- [ ] 生产加工
- [ ] 仓库期初
- [ ] 支付设置
- [ ] 进销存报表
- [ ] 基础设置

---

*等待 5:00...*
