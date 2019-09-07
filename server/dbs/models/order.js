const mongoose = require('mongoose')
const Schema = mongoose.Schema
const OrderSchema = new Schema({
  id: {
    type: String,
    require:'true'
  },
  user:{
    type:String,
    require:true
  },
  time:{
    type:String,
    require:true
  },
  total:{
    type:Number,
    require:true
  },
  imgs:{
    type:Array,
    require:true
  },
  name:{
    type:String,
    require:true
  },
  status:{
    type:Number,
    require:true
  }
})

// 这个文件名是province 查找时是以province的复数形式去查询 或者更加第三个参数 表明 明确的数据库名称
module.exports = mongoose.model('order', OrderSchema)