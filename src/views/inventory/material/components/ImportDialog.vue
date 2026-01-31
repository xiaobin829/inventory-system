<template>
  <t-dialog
    v-model:visible="dialogVisible"
    header="导入Excel"
    :width="600"
    :confirm-btn="{
      content: '开始导入',
      theme: 'primary',
      loading: uploading,
      disabled: !fileList.length
    }"
    :cancel-btn="{ content: '取消' }"
    @confirm="handleImport"
    @close="handleClose"
  >
    <div class="import-content">
      <!-- 下载模板 -->
      <t-alert theme="info" message="请先下载导入模板，按模板格式填写数据后上传" close />
      
      <div class="template-section">
        <t-button theme="primary" variant="outline" @click="handleDownloadTemplate">
          <template #icon><t-icon name="download" /></template>
          下载导入模板
        </t-button>
      </div>

      <!-- 文件上传 -->
      <div class="upload-section">
        <t-upload
          v-model="fileList"
          :auto-upload="false"
          :max="1"
          accept=".xlsx,.xls"
          theme="file"
          placeholder="选择Excel文件"
          @change="handleFileChange"
        >
          <template #file-list-display>
            <div v-if="fileList.length > 0" class="file-info">
              <t-icon name="file-excel" size="24px" style="color: #1e7e34;" />
              <span class="file-name">{{ fileList[0].name }}</span>
              <t-link theme="danger" @click="handleRemoveFile">删除</t-link>
            </div>
          </template>
        </t-upload>
      </div>

      <!-- 导入说明 -->
      <div class="tips-section">
        <div class="tips-title">导入说明：</div>
        <ul class="tips-list">
          <li>支持 .xlsx 和 .xls 格式的Excel文件</li>
          <li>物料名称、物料编码、分类、计量单位为必填项</li>
          <li>物料编码不能重复</li>
          <li>分类名称必须在系统中已存在</li>
          <li>单次最多导入1000条数据</li>
        </ul>
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { UploadFile } from 'tdesign-vue-next'

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<{ visible: boolean }>(), {
  visible: false
})

const emit = defineEmits<Emits>()

const dialogVisible = ref(false)
const uploading = ref(false)
const fileList = ref<UploadFile[]>([])

// 监听弹窗显示状态
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
})

// 文件变化
const handleFileChange = (files: UploadFile[]) => {
  fileList.value = files
}

// 删除文件
const handleRemoveFile = () => {
  fileList.value = []
}

// 下载模板
const handleDownloadTemplate = () => {
  MessagePlugin.info('模板下载功能开发中...')
  // TODO: 实现模板下载
}

// 开始导入
const handleImport = async () => {
  if (fileList.value.length === 0) {
    MessagePlugin.warning('请选择要导入的文件')
    return
  }

  uploading.value = true
  try {
    // TODO: 实现文件上传和解析
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    MessagePlugin.success('导入成功')
    emit('success')
    handleClose()
  } catch (error) {
    console.error('导入失败:', error)
    MessagePlugin.error('导入失败')
  } finally {
    uploading.value = false
  }
}

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  fileList.value = []
}
</script>

<style scoped>
.import-content {
  padding: 16px 0;
}

.template-section {
  margin: 20px 0;
  text-align: center;
}

.upload-section {
  margin: 24px 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #e7e7e7;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.tips-section {
  margin-top: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
}

.tips-list li {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}
</style>
