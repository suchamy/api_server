const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secretKey, expiresIn } = require('../config')
// 注册新用户处理函数
exports.regUser = function (req, res) {
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空！')
    }
    const dbStr = 'select * from ev_users where username = ?'
    db.query(dbStr, [userinfo.username], function (err, results) {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('用户名已被占用~')
        }
        // 准备插入新用户的数据
        const insertStr = 'insert into ev_users set ?'
        // 将密码进行加密，变成非明文, 其中10为随即盐的长度
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        db.query(insertStr, userinfo, function (err, results) {
            // 发生错误
            if (err) {
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                return res.cc('注册失败！请稍后重试~')
            }
            //注册成功
            res.cc('恭喜！注册成功~', 0)
        })
    })
}

// 登录处理函数
exports.login = function (req, res) {
    const userinfo = req.body
    // 判断数据库中是否存在该用户名
    const sqlStr = 'select * from ev_users where username = ?'
    db.query(sqlStr, userinfo.username, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户名不存在！')
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('用户名或密码错误！')
        // 密码正确 生成token并返回给客户端
        // 生成token时需要提出密码和头像的敏感信息
        const user = { ...results[0], password: '', user_pic: '' }
        // 生成有效期为20h的token，有效载荷为用户信息，但密码和头像信息都被空值覆盖
        const token = jwt.sign(user, secretKey, { expiresIn })
        res.send({
            status: 0,
            message: '登陆成功！',
            token: 'Bearer ' + token
        })
    })
}