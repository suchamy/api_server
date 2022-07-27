//导入并配置服务器
const express = require('express')
const app = express()

//导入并配置跨域
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

//封装全局可使用的函数res.cc() , 以简化res.send()函数的使用
app.use(function (req, res, next) {
    res.cc = (err, status = 1) => {
        res.send({
            status: status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 配置解析token的中间件
const expressJwt = require('express-jwt')
const { secretKey } = require('./config')
app.use(expressJwt({ secret: secretKey }).unless({ path: [/^\/api\//] }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

//配置登陆注册模块的路由
const userRouter = require('./router/user')
app.use('/api', userRouter)

//配置个人中心模块路由
const userInfoRouter = require('./router/userinfo')
app.use('/my', userInfoRouter)

// 配置文章类别管理路由
const artCateRouter = require('./router/art_cate')
app.use('/my/article', artCateRouter)

// 配置文章路由
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

const joi = require('joi')
// 全局错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // token 解析失败
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})

app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})