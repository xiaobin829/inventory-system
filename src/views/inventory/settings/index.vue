<template>
  <div class="settings-page">
    <div class="page-header">
      <h3 class="page-title">基础设置</h3>
    </div>

    <t-card class="settings-card" bordered>
      <template #header>
        <div class="card-header">
          <span class="card-title">系统配置</span>
        </div>
      </template>

      <t-form
        ref="formRef"
        :data="formData"
        :rules="rules"
        label-width="120px"
        @submit="onSubmit"
      >
        <t-form-item label="公司名称" name="companyName">
          <t-input v-model="formData.companyName" placeholder="请输入公司名称" />
        </t-form-item>

        <t-form-item label="联系电话" name="phone">
          <t-input v-model="formData.phone" placeholder="请输入联系电话" />
        </t-form-item>

        <t-form-item label="联系地址" name="address">
          <t-textarea
            v-model="formData.address"
            placeholder="请输入联系地址"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </t-form-item>

        <t-form-item label="库存预警阈值" name="stockAlertThreshold">
          <t-input-number
            v-model="formData.stockAlertThreshold"
            :min="0"
            placeholder="低于此数量时预警"
            style="width: 200px"
          />
          <span class="form-tip">低于此数量时系统会发出预警提示</span>
        </t-form-item>

        <t-form-item label="成本计价方法" name="costMethod">
          <t-select v-model="formData.costMethod" style="width: 200px">
            <t-option value="FIFO" label="先进先出(FIFO)" />
            <t-option value="LIFO" label="后进先出(LIFO)" />
            <t-option value="AVG" label="加权平均" />
            <t-option value="INDIVIDUAL" label="个别计价" />
          </t-select>
        </t-form-item>

        <t-form-item label="默认仓库" name="defaultWarehouse">
          <t-select
            v-model="formData.defaultWarehouse"
            placeholder="选择默认仓库"
            style="width: 200px"
          >
            <t-option
              v-for="item in warehouses"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </t-select>
        </t-form-item>

        <t-form-item label="启用批次管理" name="enableBatchManagement">
          <t-switch v-model="formData.enableBatchManagement" />
          <span class="form-tip">开启后可记录物料的批次和有效期信息</span>
        </t-form-item>

        <t-form-item label="启用序列号管理" name="enableSerialNumber">
          <t-switch v-model="formData.enableSerialNumber" />
          <span class="form-tip">开启后可为商品分配唯一序列号</span>
        </t-form-item>

        <t-form-item label="自动审核入库单" name="autoApproveInbound">
          <t-switch v-model="formData.autoApproveInbound" />
          <span class="form-tip">新建入库单后自动审核通过</span>
        </t-form-item>

        <t-form-item label="自动审核出库单" name="autoApproveOutbound">
          <t-switch v-model="formData.autoApproveOutbound" />
          <span class="form-tip">新建出库单后自动审核通过</span>
        </t-form-item>

        <t-form-item label="备注" name="remark">
          <t-textarea
            v-model="formData.remark"
            placeholder="其他配置说明"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </t-form-item>

        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit">保存设置</t-button>
            <t-button theme="default" variant="base" @click="onReset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

interface SettingsFormData {
  companyName: string;
  phone: string;
  address: string;
  stockAlertThreshold: number;
  costMethod: string;
  defaultWarehouse: string;
  enableBatchManagement: boolean;
  enableSerialNumber: boolean;
  autoApproveInbound: boolean;
  autoApproveOutbound: boolean;
  remark: string;
}

const formRef = ref();

const formData = ref<SettingsFormData>({
  companyName: '',
  phone: '',
  address: '',
  stockAlertThreshold: 10,
  costMethod: 'FIFO',
  defaultWarehouse: '',
  enableBatchManagement: false,
  enableSerialNumber: false,
  autoApproveInbound: false,
  autoApproveOutbound: false,
  remark: '',
});

const rules = {
  companyName: [{ required: true, message: '请输入公司名称', type: 'error' }],
  phone: [
    { required: true, message: '请输入联系电话', type: 'error' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', type: 'warning' },
  ],
};

const warehouses = ref([
  { label: '黔灶', value: '1' },
  { label: '配送中心仓库A', value: '2' },
  { label: '观山湖门店', value: '3' },
  { label: '花溪门店', value: '4' },
]);

// 从 localStorage 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('inventory-settings');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.assign(formData.value, data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }
};

// 保存设置到 localStorage
const saveSettings = () => {
  try {
    localStorage.setItem('inventory-settings', JSON.stringify(formData.value));
    return true;
  } catch (e) {
    console.error('Failed to save settings:', e);
    return false;
  }
};

const onSubmit = ({ validateResult }: any) => {
  if (validateResult === true) {
    if (saveSettings()) {
      MessagePlugin.success('设置保存成功');
    } else {
      MessagePlugin.error('设置保存失败');
    }
  }
};

const onReset = () => {
  formRef.value?.reset();
  loadSettings();
};

onMounted(() => {
  loadSettings();
});
</script>

<style lang="less" scoped>
.settings-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #000;
}

.settings-card {
  margin-bottom: 24px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #000;
    }
  }
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}
</style>
