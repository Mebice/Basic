<script setup>
// TODO: 编辑
import { ref } from 'vue'
import axios from 'axios';
// 弹框开关
const dialogVisible = ref(false)
// 準備form
const form = ref({
  id: '',
  name: '',
  place: ''
})
const open = (row) => {
  console.log(row)
  // 賦值
  form.value.id = row.id
  form.value.name = row.name
  form.value.place = row.place
  dialogVisible.value = true
}
defineExpose({
  open
})

// 更新
const emit = defineEmits (['on-update'])
const onUpdate = async () => {
  // 1.收集表單數據，調用接口
  await axios.patch(`/edit/${form.value.id}`, {
    name: form.value.name,
    place: form.value.place,
  })

  // 2.關閉彈窗
  dialogVisible.value = false
  // 3.通知父組件做列表更新
  emit('on-update')
}

</script>

<template>
  <el-dialog v-model="dialogVisible" title="编辑" width="400px">
    <el-form label-width="50px">
      <el-form-item label="姓名">
        <el-input placeholder="請输入姓名" v-model="form.name" />
      </el-form-item>
      <el-form-item label="城市">
        <el-input placeholder="請输入城市" v-model="form.place" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onUpdate">確認</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-input {
  width: 290px;
}
</style>
