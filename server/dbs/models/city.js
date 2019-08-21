const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CitySchema = new Schema({
  id: {
    type: String,
    require: true
  },
  value: {
    type: Array,
    require: true
  }
})

// 这个文件名是province 查找时是以province的复数形式去查询 或者更加第三个参数 表明 明确的数据库名称
module.exports = mongoose.model('city', CitySchema)