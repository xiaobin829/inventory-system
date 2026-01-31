import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/inventory/warehouse',
    children: [
      // 仓库管理
      {
        path: '/inventory/warehouse',
        name: 'Warehouse',
        component: () => import('@/views/inventory/warehouse/index.vue'),
        meta: { title: '仓库管理' }
      },
      // 仓库期初
      {
        path: '/inventory/opening',
        name: 'Opening',
        component: () => import('@/views/inventory/warehouse/opening.vue'),
        meta: { title: '仓库期初' }
      },
      // 原材料管理
      {
        path: '/inventory/material',
        name: 'Material',
        component: () => import('@/views/inventory/material/index.vue'),
        meta: { title: '原材料管理' }
      },
      // 成本卡管理
      {
        path: '/inventory/cost-card',
        name: 'CostCard',
        component: () => import('@/views/inventory/cost-card/index.vue'),
        meta: { title: '成本卡管理' }
      },
      // 库存管理 - 实时库存
      {
        path: '/inventory/stock/realtime',
        name: 'StockRealtime',
        component: () => import('@/views/inventory/stock/realtime/index.vue'),
        meta: { title: '实时库存' }
      },
      // 库存管理 - 入库管理
      {
        path: '/inventory/stock/in',
        name: 'StockIn',
        component: () => import('@/views/inventory/stock/in/index.vue'),
        meta: { title: '入库管理' }
      },
      // 库存管理 - 出库管理
      {
        path: '/inventory/stock/out',
        name: 'StockOut',
        component: () => import('@/views/inventory/stock/out/index.vue'),
        meta: { title: '出库管理' }
      },
      // 库存管理 - 损耗管理
      {
        path: '/inventory/stock/loss',
        name: 'StockLoss',
        component: () => import('@/views/inventory/stock/loss/index.vue'),
        meta: { title: '损耗管理' }
      },
      // 库存管理 - 调拨管理
      {
        path: '/inventory/stock/transfer',
        name: 'StockTransfer',
        component: () => import('@/views/inventory/stock/transfer/index.vue'),
        meta: { title: '调拨管理' }
      },
      // 库存管理 - 盘点管理
      {
        path: '/inventory/stock/inventory',
        name: 'StockInventory',
        component: () => import('@/views/inventory/stock/inventory/index.vue'),
        meta: { title: '盘点管理' }
      },
      // 订货管理
      {
        path: '/inventory/order',
        name: 'Order',
        component: () => import('@/views/inventory/order/index.vue'),
        meta: { title: '订货管理' }
      },
      // 生产加工
      {
        path: '/inventory/production',
        name: 'Production',
        component: () => import('@/views/inventory/production/index.vue'),
        meta: { title: '生产加工' }
      },
      // 供货商管理
      {
        path: '/inventory/supplier',
        name: 'Supplier',
        component: () => import('@/views/inventory/supplier/index.vue'),
        meta: { title: '供货商管理' }
      },
      // 支付设置
      {
        path: '/inventory/payment',
        name: 'Payment',
        component: () => import('@/views/inventory/payment/index.vue'),
        meta: { title: '支付设置' }
      },
      // 进销存报表
      {
        path: '/inventory/reports',
        name: 'Reports',
        component: () => import('@/views/inventory/reports/index.vue'),
        meta: { title: '进销存报表' }
      },
      // 基础设置
      {
        path: '/inventory/settings',
        name: 'Settings',
        component: () => import('@/views/inventory/settings/index.vue'),
        meta: { title: '基础设置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 进销存系统`
  }
  next()
})

export default router
