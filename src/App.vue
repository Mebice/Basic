<script setup>
import { ref, onMounted,computed,watch } from 'vue';
import Edit from './components/Edit.vue'
import Add from './components/Add.vue'
import axios from 'axios';

// TODO: 列表渲染  // 查詢功能
// 聲明響應式list -> 調用接口獲取數據 -> 後端數據賦值給list -> 綁定到table組件
const name = ref(''); // 绑定输入的姓名
const city = ref(''); // 绑定输入的城市
const list = ref([]) // 存放的地方
const currentPage = ref(1); // 當前頁
const pageSize = ref(10); // 一頁顯示的筆數

// const getList = async () => {
//   // 調用接口，await.get('') 或 await.post('')
//   const response = await axios.get('/list')
//   // 交給list
//   list.value = response.data
// }
const search = async () => {
  const response = await axios.get(`/search?name=${name.value}&city=${city.value}`);
  list.value = response.data;
}
// 加載完畢後獲取
onMounted(() =>
  // getList()
  search()
)

// TODO: 删除功能
// 獲取當前行的ID -> 通過ID調用刪除接口 -> 更新最新的列表
const onDelete = async (id) => {
  console.log(id)
  await axios.delete(`/del/${id}`)
  // getList()
  search()

}


// TODO: 编辑功能
// 打開彈窗 -> 回填數據 -> 更新數據
// 1.打開彈窗(獲取子組件實例，調用方法或修改屬性)
// 2.回調數據(調用詳情接口/當前行的靜態數據)
const editRef = ref(null)
const onEdit = (row) => {
  editRef.value.open(row)
}

// 新增
const addRef = ref(null)
const onAdd = () => {
  addRef.value.open()
}

// 分頁 : 需要计算当前页数据的起始索引和结束索引，以便从整个数据列表中提取当前页的数据子集
// 計算起始索引 : 因为 JavaScript 的数组索引是从 0 开始的，所以需要将 currentPage 减去 1
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
// 计算结束索引 : 起始索引加上每页显示的数据数量，但是不能超过整个数据列表的长度。将起始索引加上每页显示的数据数量，然后将结果与整个数据列表的长度进行比较，取两者中的最小值
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, list.value.length));
// 提取当前页数据 : 从整个数据列表中提取当前页的数据子集，使用数组的 slice() 方法
const currentPageData = computed(() => list.value.slice(startIndex.value, endIndex.value));
const totalItems = computed(() => list.value.length); // 總頁數

</script>

<template>
  <div class="bgArea">
    <div class="searchArea">
      <label for="name">姓名</label>
      <input type="text" id="name" v-model="name" placeholder="請輸入姓名">
      <label for="city">城市</label>
      <input type="text" id="city" v-model="city" placeholder="請輸入城市">
      <button @click="search">搜尋</button>
    </div>
    <div class="app">
      <!-- 要使用此table的話需要 npm install element-plus -->
      <!-- <el-table :data="[{
      id: 1,
      name: 'jack',
      place: '北京',
    }, {
      id: 2,
      name: 'momo',
      place: '上海',
    }]"> -->
      <button @click="onAdd">新增</button>
      <el-table :data="currentPageData" >
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="姓名" prop="name" width="150"></el-table-column>
        <el-table-column label="城市" prop="place"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" @click="onEdit(row)" link>编辑</el-button>
            <el-button type="danger" @click="onDelete(row.id)" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <Edit ref="editRef" @on-update="getList" /> -->
    <Edit ref="editRef" @on-update="search" />
    <!-- <Add ref="addRef" @on-add="getList" /> -->
    <Add ref="addRef" @on-add="search" />  

    <div class="demo-pagination-block">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      background
      layout="prev, pager, next, total, jumper"
      :total="totalItems"
    />
  </div>

  </div>
</template>

<style scoped>
.bgArea {
.searchArea{
  width: 500px;
  margin: 50px auto 0;
}

  .app {
    width: 980px;
    margin: 0px auto 50px;
  }

}
</style>
