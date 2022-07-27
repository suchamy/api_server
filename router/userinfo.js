const express = require('express')
const router = express.Router()
// 导入处理函数
const fun = require('../router_handler/userinfo')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const { update_userinfo_schema, update_pwd_schema, update_avatar_schema } = require('../schema/user')

router.get('/userinfo', fun.getUserInfo)

router.post('/userinfo', expressJoi(update_userinfo_schema), fun.updateInfo)

router.post('/updatepwd', expressJoi(update_pwd_schema), fun.updatePwd)

router.post('/update/avatar', expressJoi(update_avatar_schema), fun.updateAvatar)
module.exports = router