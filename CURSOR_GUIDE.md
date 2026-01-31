# 进销存系统开发 - Cursor 工作指南

## ✅ 当前状态

### 已完成
- ✅ 项目已初始化并成功运行
- ✅ 开发服务器运行在 http://localhost:3000/
- ✅ 基础架构已搭建完成
- ✅ 仓库管理模块完成 80%（列表、筛选、分页）
- ✅ Cursor 已打开项目目录

### ⚠️ 重要：必须登录 Cursor 账号
**账号信息**:
- 邮箱: zl@k3n.cn
- 密码: wdkj!@#123

**登录后才能开始开发！**

---

## 📋 接下来的开发任务

### 任务优先级

#### 🔥 紧急任务（本次必须完成）

**任务1: 创建仓库编辑对话框**
- 文件路径: `src/views/inventory/warehouse/components/WarehouseDialog.vue`
- 需要实现: 弹窗表单、字段验证、提交逻辑

**任务2: 完善仓库管理主页面**
- 文件路径: `src/views/inventory/warehouse/index.vue`
- 添加: 新建按钮、编辑功能、删除确认

**任务3: 创建API接口层**
- 文件路径: `src/api/warehouse.ts`
- 实现: CRUD 接口函数

---

## 🎨 Cursor 开发流程

### 第1步：登录 Cursor
1. 打开 Cursor（已完成）
2. 点击右上角账号图标
3. 输入邮箱: `zl@k3n.cn`
4. 输入密码: `wdkj!@#123`
5. 点击登录

### 第2步：检查项目环境
在 Cursor 底部终端运行：
```bash
# 确认当前目录
pwd
# 应该输出: /Users/xiaobin/.openclaw/workspace/inventory-system

# 查看开发服务器状态
npm run dev
# 如果未运行，会启动服务器
# 访问 http://localhost:3000/ 确认页面正常
```

### 第3步：使用 Cursor AI 创建组件
按 `Cmd + K` 打开 AI 对话框，输入：
```
创建一个仓库编辑对话框组件 WarehouseDialog.vue，要求：
1. 使用 TDesign 的 t-dialog 组件
2. 包含表单字段：仓库编码、名称、类型、联系人、电话、地址
3. 使用 TypeScript
4. 添加表单验证
5. 提供 v-model:visible 控制显示
6. 提供 @submit 事件
```

### 第4步：在主页面集成组件
1. 打开 `src/views/inventory/warehouse/index.vue`
2. 使用 Cursor AI 修改代码
3. 添加新建按钮和对话框

### 第5步：创建 API 接口
1. 创建 `src/api/warehouse.ts`
2. 使用 Cursor AI 生成 API 函数
3. 配置 Mock 数据（可选）

---

## 💡 Cursor 快捷键速查

### AI 功能
| 快捷键 | 功能 |
|--------|------|
| `Cmd + K` | AI 编辑代码 |
| `Cmd + L` | AI 聊天面板 |
| `Tab` | 接受 AI 建议 |

### 编辑功能
| 快捷键 | 功能 |
|--------|------|
| `Cmd + P` | 快速打开文件 |
| `Cmd + Shift + P` | 命令面板 |
| `Cmd + /` | 注释/取消注释 |
| `Cmd + D` | 选中下一个相同内容 |

### 终端功能
| 快捷键 | 功能 |
|--------|------|
| `Ctrl + ` ` | 切换终端 |
| `Cmd + N` | 新建文件 |
| `Cmd + S` | 保存文件 |

---

## 📝 开发模板

### WarehouseDialog.vue 模板
```vue
<template>
  <t-dialog
    v-model:visible="dialogVisible"
    header="编辑仓库"
    :on-confirm="handleSubmit"
    :on-cancel="handleCancel"
  >
    <t-form
      ref="formRef"
      :data="formData"
      :rules="rules"
      label-width="100px"
    >
      <t-form-item label="仓库编码" name="code">
        <t-input v-model="formData.code" placeholder="请输入仓库编码" />
      </t-form-item>
      
      <t-form-item label="仓库名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入仓库名称" />
      </t-form-item>
      
      <!-- 更多字段... -->
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { WarehouseForm } from '@/types/warehouse'

// 组件逻辑...
</script>
```

### API 接口模板
```typescript
// src/api/warehouse.ts
import request from '@/utils/request'
import type { Warehouse, WarehouseQuery } from '@/types/warehouse'

export function getWarehouseList(params: WarehouseQuery) {
  return request.get<Warehouse[]>('/api/warehouses', { params })
}

export function createWarehouse(data: WarehouseForm) {
  return request.post('/api/warehouses', data)
}

// 更多接口...
```

---

## ✅ 完成标准

完成以下所有任务后，仓库管理模块达到 100%：

- [ ] WarehouseDialog.vue 组件创建完成
- [ ] 新建仓库功能可用
- [ ] 编辑仓库功能可用
- [ ] 删除仓库功能可用（带确认）
- [ ] 表单验证正常工作
- [ ] API 接口层创建完成
- [ ] 所有功能在浏览器中测试通过
- [ ] 代码提交到 Git

---

## 🔍 测试检查清单

### 功能测试
1. 点击"新建仓库"按钮，弹窗打开 ✓
2. 填写表单，提交成功 ✓
3. 表单验证正常（空值、格式等）✓
4. 点击"编辑"，弹窗显示已有数据 ✓
5. 修改数据，提交成功 ✓
6. 点击"删除"，显示确认对话框 ✓
7. 确认删除，数据移除 ✓

### 界面测试
1. 弹窗样式正常 ✓
2. 表单布局美观 ✓
3. 按钮状态正确 ✓
4. 错误提示清晰 ✓

---

## 📚 参考文档（在 Cursor 中打开）

### 项目文档
- `PROJECT_PLAN.md` - 完整开发计划
- `PROGRESS.md` - 当前进度
- `WORK_REPORT.md` - 工作报告

### 代码参考
- `src/types/warehouse.ts` - TypeScript 类型定义
- `src/views/inventory/warehouse/index.vue` - 仓库管理主页面
- `src/layouts/MainLayout.vue` - 布局参考

### 在线文档
在浏览器中打开：
- TDesign Dialog: https://tdesign.tencent.com/vue-next/components/dialog
- TDesign Form: https://tdesign.tencent.com/vue-next/components/form

---

## 🆘 常见问题

### Q: Cursor 登录失败？
A: 
1. 检查网络连接
2. 确认账号密码正确
3. 尝试重启 Cursor

### Q: AI 建议不准确？
A: 
1. 提供更详细的描述
2. 选中相关代码再使用 AI
3. 手动调整 AI 生成的代码

### Q: 代码运行报错？
A: 
1. 检查控制台错误信息
2. 确认依赖已安装
3. 使用 Cursor AI 询问错误原因

---

## 🎯 下一步计划

完成仓库管理模块后，按优先级开发：

1. **原材料管理模块**
   - 分类树组件
   - 列表页面
   - 导入功能

2. **成本卡管理模块**
   - Tab 切换
   - 商品列表
   - 成本配置

3. **库存管理模块**
   - 实时库存
   - 入库/出库
   - 盘点功能

---

**开始在 Cursor 中开发吧！**

记住：所有代码必须在 Cursor 编辑器中编写，充分利用 AI 功能提高开发效率。
