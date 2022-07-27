const db = require('../db/index')
const bcrypt = require('bcryptjs')

exports.getUserInfo = function (req, res) {
    // 在expressJwt解析token时，会把解析出的数据挂载到req.user属性上
    // 用user常量获取,其中包含id, username, nickname, email信息
    const user = req.user
    const sqlStr = 'select id,username,nickname,email,user_pic from ev_users where id = ?'
    db.query(sqlStr, user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取用户信息失败!')
        res.send({
            status: 0,
            message: '获取信息成功!',
            data: results[0]
        })
    })
}

exports.updateInfo = function (req, res) {
    const user = req.body
    const sqlStr = 'update ev_users set nickname = ?,email = ? where id = ?'
    db.query(sqlStr, [user.nickname, user.email, user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新信息失败！')
        res.cc('更新用户信息成功！', 0)
    })
}

exports.updatePwd = function (req, res) {
    const user = req.user
    const pwd = req.body
    const sqlStr = 'select * from ev_users where id = ?'
    db.query(sqlStr, user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('更新密码失败！')
        const compareResult = bcrypt.compareSync(pwd.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        const updateStr = 'update ev_users set password = ? where id = ?'
        const npwd = bcrypt.hashSync(pwd.newPwd, 10)
        db.query(updateStr, [npwd, user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('更新密码成功！', 0)
        })
    })
}

exports.updateAvatar = function (req, res) {
    const img = req.body
    console.log(img)
    const user = req.user
    const sqlStr = 'update ev_users set user_pic=? where id=?'
    db.query(sqlStr, [img.avatar, user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        res.cc('更新头像成功！', 0)
    })
}