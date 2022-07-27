const express = require('express')
const router = express.Router()

const fun = require('../router_handler/art_cate')

//导入分类名称验证的规则及使用函数
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { art_cate_schema, del_cate_schema, update_cate_schema } = require('../schema/artcate')
router.get('/cates', fun.getCateList)
router.post('/addcates', expressJoi(art_cate_schema), fun.addCate)
router.get('/deletecate/:id', expressJoi(del_cate_schema), fun.delCateById)
router.get('/cates/:id', expressJoi(del_cate_schema), fun.getCateById)
router.post('/updatecate', expressJoi(update_cate_schema), fun.updateCateById)
module.exports = router