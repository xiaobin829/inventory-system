# Cursor 开发任务清单

## ⚠️ 重要提醒
**必须使用 Cursor 编辑器进行所有开发工作！**

## 📋 第一步：登录 Cursor 账号

### 登录信息
- **邮箱**: zl@k3n.cn
- **密码**: wdkj!@#123

### 登录步骤
1. 打开 Cursor 应用（已完成 ✅）
2. 点击右上角的账号图标或设置
3. 选择 "Sign In" 或 "登录"
4. 输入邮箱：`zl@k3n.cn`
5. 输入密码：`wdkj!@#123`
6. 点击登录

## 📂 第二步：确认项目已打开

### 项目路径
```
/Users/xiaobin/.openclaw/workspace/inventory-system
```

### 确认清单
- [ ] 左侧文件树显示项目文件
- [ ] 可以看到 `src/` 目录
- [ ] 可以看到 `package.json` 文件
- [ ] 底部终端可用

## 🚀 第三步：在 Cursor 中开始开发

### 当前任务：完善仓库管理模块

#### 任务 1: 创建仓库编辑弹窗组件
**文件**: `src/views/inventory/warehouse/components/WarehouseDialog.vue`

使用 Cursor 创建该文件，内容包括：
- 弹窗组件（使用 TDesign t-dialog）
- 表单字段：仓库编码、名称、类型、联系人、电话、地址
- 表单验证
- 提交和取消按钮

**提示**: 可以使用 Cursor 的 AI 功能（Cmd+K）来辅助生成代码

#### 任务 2: 修改仓库管理主页面
**文件**: `src/views/inventory/warehouse/index.vue`

需要修改的内容：
1. 添加"新建仓库"按钮
2. 引入 WarehouseDialog 组件
3. 实现新建和编辑功能
4. 添加删除确认对话框

#### 任务 3: 创建 API 接口
**文件**: `src/api/warehouse.ts`

创建仓库相关的 API 接口：
```typescript
- getWarehouseList() // 获取仓库列表
- createWarehouse() // 创建仓库
- updateWarehouse() // 更新仓库
- deleteWarehouse() // 删除仓库
- toggleWarehouseStatus() // 切换状态
```

#### 任务 4: 创建 Mock 数据服务（可选）
可以使用 vite-plugin-mock 或者简单的 setTimeout 模拟 API 响应

## 💡 Cursor 使用技巧

### 1. AI 辅助编程
- **Cmd + K**: 打开 AI 对话框，描述你想要的代码
- **Cmd + L**: 打开 AI Chat 面板，进行对话式编程
- **选中代码 + Cmd + K**: 让 AI 修改选中的代码

### 2. 快速操作
- **Cmd + P**: 快速打开文件
- **Cmd + Shift + P**: 命令面板
- **Cmd + B**: 切换侧边栏
- **Ctrl + `**: 打开/关闭终端

### 3. 代码提示
- Cursor 会自动提供智能代码补全
- Tab 键接受建议
- Esc 键取消建议

### 4. 终端使用
在 Cursor 底部终端中运行：
```bash
# 安装依赖（如果还没安装）
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000/
```

## 📝 开发规范提醒

### 代码风格
- 使用 TypeScript
- 组件使用 `<script setup lang="ts">`
- 遵循 Vue 3 Composition API
- 使用 TDesign 组件库

### 文件命名
- 组件文件：PascalCase（如 `WarehouseDialog.vue`）
- 普通文件：kebab-case（如 `warehouse.ts`）

### Git 提交
```bash
# 在 Cursor 终端中
git add .
git commit -m "feat: 添加仓库管理新建/编辑功能"
```

## 📖 参考资源

### 在 Cursor 中打开文档
1. **项目计划**: `PROJECT_PLAN.md`
2. **进度报告**: `PROGRESS.md`
3. **工作报告**: `WORK_REPORT.md`
4. **README**: `README.md`

### 在线文档
- TDesign Vue Next: https://tdesign.tencent.com/vue-next/components/dialog
- Vue 3 文档: https://vuejs.org/
- TypeScript 文档: https://www.typescriptlang.org/

## ✅ 完成后检查清单

- [ ] 已登录 Cursor 账号（zl@k3n.cn）
- [ ] 项目在 Cursor 中打开
- [ ] 创建了 WarehouseDialog.vue 组件
- [ ] 修改了仓库管理主页面
- [ ] 创建了 API 接口文件
- [ ] 代码可以正常运行
- [ ] 新建/编辑功能可用
- [ ] 已提交代码到 Git

## 🆘 遇到问题？

### Cursor 登录问题
- 确保网络连接正常
- 尝试重启 Cursor 应用
- 检查账号密码是否正确

### 代码问题
- 使用 Cursor AI (Cmd+K) 询问问题
- 查看控制台错误信息
- 参考项目文档和在线资源

### 运行问题
- 确保依赖已安装 (`npm install`)
- 检查开发服务器是否启动
- 查看终端错误信息

---

## 🎯 当前目标

**使用 Cursor 完成仓库管理模块的新建和编辑功能**

祝开发顺利！有任何问题都可以使用 Cursor 的 AI 功能寻求帮助。
