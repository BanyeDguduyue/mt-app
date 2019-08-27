const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PoiSchema = new Schema({
    name: {
        type: String, //景点名
    },
    province: {
        type: String, //省份
    },
    city: {
        type: String, //城市
    },
    county: {
        type: String, //区县
    },
    areaCode: {
        type: String, //区号
    },
    tel: {
        type: String, //电话
    },
    area: {
        type: String, //地区商圈
    },
    addr: {
        type: String, //地址
    },
    type: {
        type: String, //丽人 景点
    },
    module: {
        type: String, //子分类
    },
    longitude:{
        type:Number
    },
    latitude:{
        type:Number
    }
})

// 这个文件名是province 查找时是以province的复数形式去查询 或者更加第三个参数 表明 明确的数据库名称
module.exports = mongoose.model('poi', PoiSchema)