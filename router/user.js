const express = require('express')
const router = express.Router()
// 导入处理函数
const fun = require('../router_handler/user')
// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')
router.post('/reguser', expressJoi(reg_login_schema), fun.regUser)

router.post('/login', expressJoi(reg_login_schema), fun.login)

module.exports = router