# 待开发任务队列

## 第一批：库存操作（3个）

### ✅ 1. 损耗管理 - 已完成
- 337 lines
- 4种损耗类型

### 🔄 2. 调拨管理 - 进行中
Claude Code 正在工作...

### ⏳ 3. 盘点管理 - 待开发

**Prompt:**
```
Implement Inventory Check Management (盘点管理) page at src/views/inventory/stock/inventory/index.vue.

Requirements:
1. Similar structure to other stock pages
2. Add types to src/types/bill.ts:
   - CheckOrder: id, billNo, date, warehouseId, warehouseName, checkType (full/partial/spot), items, totalQuantity, totalDiffAmount, operatorId, operatorName, status, createTime
   - CheckDetail: materialId, materialName, specification, unit, bookQuantity, actualQuantity, diffQuantity, unitCost, diffAmount
   - CheckOrderQuery: checkType, status, keyword, startDate, endDate, page, pageSize
3. Add to src/api/bill.ts with 3-4 mock check orders
4. Features:
   - Filters: check type, status, date range, search
   - Table: bill no + date, warehouse, check type tag, quantity difference, amount difference, operator, status, actions
   - Check type colors: full=blue, partial=green, spot=orange
   - Show diff in red if negative (loss), green if positive (gain)
   - Actions: view, edit (draft), delete

Keep it consistent!
```

---

## 第二批：辅助管理（3个）

### 4. 供货商管理

**Prompt:**
```
Implement Supplier Management (供货商管理) page at src/views/inventory/supplier/index.vue.

Requirements:
1. Create src/types/supplier.ts:
   - Supplier: id, code, name, contact, phone, email, address, bankName, bankAccount, taxNo, creditDays, status, createTime
   - SupplierQuery: keyword, status, page, pageSize
2. Create src/api/supplier.ts with 5-6 mock suppliers
3. Features:
   - Filters: search, status
   - Table: code, name, contact, phone, email, credit days, status, actions
   - Form dialog with tabs: Basic Info, Bank Info, Other
   - Actions: add, edit, toggle status, delete

Simple CRUD page!
```

### 5. 订货管理

**Prompt:**
```
Implement Order Management (订货管理) page at src/views/inventory/order/index.vue.

Requirements:
1. Add types to src/types/bill.ts:
   - PurchaseOrder: id, billNo, date, supplierId, supplierName, items, totalAmount, deliveryDate, status, createTime
   - PurchaseOrderDetail: materialId, materialName, specification, unit, quantity, unitPrice, totalPrice
2. Add to src/api/bill.ts with 4-5 mock purchase orders
3. Features:
   - Filters: supplier, status, date range, search
   - Table: bill no, date, supplier, quantity, amount, delivery date, status, actions
   - Actions: view, edit, submit, delete

Standard order page!
```

### 6. 生产加工

**Prompt:**
```
Implement Production Management (生产加工) page at src/views/inventory/production/index.vue.

Requirements:
1. Add types to src/types/bill.ts:
   - ProductionOrder: id, billNo, date, productId, productName, plannedQuantity, actualQuantity, materials (consumed), status, createTime
   - ProductionMaterial: materialId, materialName, specification, unit, plannedQuantity, actualQuantity, unitCost
2. Add to src/api/bill.ts with 3-4 mock production orders
3. Features:
   - Filters: product, status, date range
   - Table: bill no, date, product, planned/actual quantity, material cost, status, actions
   - Actions: view, edit, complete, delete

Production tracking page!
```

---

## 第三批：配置功能（4个）

### 7. 仓库期初
Simple config page with material initial stock input.

### 8. 支付设置
Payment method configuration page.

### 9. 进销存报表
Reports summary page with charts.

### 10. 基础设置
System settings page.

---

**策略**：
- 先完成第一批（库存核心）
- 再做第二批（业务辅助）
- 最后第三批（配置）可以简化实现
