const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CartSchema = new Schema({
  id: {
    type: String,
    require: true
  },
  detail: {
    type: Array,
    require: true
  },
  cartNo: {
    type: String,
    require: true
  },
  user: {
    type: String,
    require: true
  },
  time: {
    type: String,
    require: true
  }
})

// 这个文件名是province 查找时是以province的复数形式去查询 或者更加第三个参数 表明 明确的数据库名称
module.exports = mongoose.model('cart', CartSchema)