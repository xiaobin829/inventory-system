<template>
  <div class="main-layout">
    <t-layout>
      <!-- 头部 -->
      <t-header class="layout-header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-text">进销存系统</span>
          </div>
          <div class="header-right">
            <span>用户名</span>
          </div>
        </div>
      </t-header>

      <t-layout>
        <!-- 侧边栏 -->
        <t-aside class="layout-aside">
          <t-menu
            v-model:value="activeMenu"
            :default-expanded="expandedMenus"
            theme="light"
            @change="handleMenuChange"
          >
            <t-menu-item value="/inventory/warehouse">
              仓库管理
            </t-menu-item>

            <t-menu-item value="/inventory/opening">
              仓库期初
            </t-menu-item>

            <t-menu-item value="/inventory/material">
              原材料管理
            </t-menu-item>

            <t-menu-item value="/inventory/product">
              成品管理
            </t-menu-item>

            <t-menu-item value="/inventory/cost-card">
              成本卡管理
            </t-menu-item>

            <t-submenu value="stock" title="库存管理">
              <t-menu-item value="/inventory/stock/realtime">实时库存</t-menu-item>
              <t-menu-item value="/inventory/stock/in">入库管理</t-menu-item>
              <t-menu-item value="/inventory/stock/out">出库管理</t-menu-item>
              <t-menu-item value="/inventory/stock/loss">损耗管理</t-menu-item>
              <t-menu-item value="/inventory/stock/transfer">调拨管理</t-menu-item>
              <t-menu-item value="/inventory/stock/inventory">盘点管理</t-menu-item>
            </t-submenu>

            <t-submenu value="order" title="订货管理">
              <t-menu-item value="/inventory/order">订货管理</t-menu-item>
            </t-submenu>

            <t-submenu value="production" title="生产加工">
              <t-menu-item value="/inventory/production">生产加工</t-menu-item>
            </t-submenu>

            <t-menu-item value="/inventory/supplier">
              供货商管理
            </t-menu-item>

            <t-menu-item value="/inventory/payment">
              支付设置
            </t-menu-item>

            <t-menu-item value="/inventory/reports">
              进销存报表
            </t-menu-item>

            <t-menu-item value="/inventory/settings">
              基础设置
            </t-menu-item>
          </t-menu>
        </t-aside>

        <!-- 内容区域 -->
        <t-layout>
          <t-content class="layout-content">
            <div class="content-wrapper">
              <router-view />
            </div>
          </t-content>
        </t-layout>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前激活的菜单
const activeMenu = ref(route.path)
// 默认展开的子菜单
const expandedMenus = ref(['stock', 'order', 'production'])

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)

// 菜单点击事件
const handleMenuChange = (value: string) => {
  router.push(value)
}
</script>

<style scoped>
.main-layout {
  width: 100%;
  height: 100vh;
}

.layout-header {
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  padding: 0 24px;
  height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #0052d9;
}

.logo-text {
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.layout-aside {
  background: #fff;
  border-right: 1px solid #e7e7e7;
  width: 240px !important;
}

.layout-content {
  background: #f5f5f5;
  padding: 24px;
  overflow: auto;
}

.content-wrapper {
  background: #fff;
  border-radius: 6px;
  padding: 24px;
  min-height: calc(100vh - 112px);
}

:deep(.t-menu) {
  border-right: none;
}
</style>
