import Mock from "mockjs"
// 内存模拟数据
const arr = []
for (let i = 0; i < 10; i++) {
  arr.push({
    id: Mock.mock("@id"),
    name: Mock.mock("@name"),
    place: Mock.mock("@city(true)"),
  })
}
export default [
  {
    url: "/list",
    method: "get",
    response: () => {
      return arr
    },
  },
  {
    url: "/del/:id",
    method: "delete",
    response: (req) => {
      const index = arr.findIndex((item) => item.id === req.query.id)
      if (index > -1) {
        arr.splice(index, 1)
        return { success: true }
      } else {
        return { success: false }
      }
    },
  },
  {
    url: "/edit/:id",
    method: "patch",
    response: ({ query, body }) => {
      const item = arr.find((item) => item.id === query.id)
      if (item) {
        item.name = body.name
        item.place = body.place
        return { success: true }
      } else {
        return { success: false }
      }
    },
  },
  {
    url: "/add",
    method: "post",
    response: ({ body }) => {
      const newItem = {
        id: Mock.mock("@id"),
        name: body.name,
        place: body.place
      };
      arr.push(newItem);
      return { success: true, item: newItem };
    },
  },
  {
    url: "/search",
    method: "get",
    response: (req) => {
      const { name, city } = req.query;
      // 在这里根据接收到的查询参数进行搜索操作
      // 假设 arr 是一个包含所有数据的数组
      // 这里使用了模糊搜索，只要 name 或者 city 包含查询参数，就返回匹配的数据项

      // const result = arr.filter(item => {   // 一個input搜尋name或city
      //   return item.name.includes(name) || item.place.includes(city);
      // });

      let result = arr;
      if (name && !city) { // 如果只有姓名有值
        result = arr.filter(item => item.name.includes(name));
      } else if (!name && city) { // 如果只有城市有值
        result = arr.filter(item => item.place.includes(city));
      } else if (name && city) { // 如果姓名和城市都有值
        result = arr.filter(item => item.name.includes(name) && item.place.includes(city));
      }

      return result;
    }
  }
  
  
]
