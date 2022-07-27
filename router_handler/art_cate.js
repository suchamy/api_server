const db = require('../db/index')

exports.getCateList = function (req, res) {
    const sqlStr = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        if (!results) return res.cc('获取文章分类信息失败！')
        res.send({
            status: 0,
            message: '获取文章分类信息成功！',
            data: results
        })
    })
}

exports.addCate = function (req, res) {
    const cate = req.body
    const sql = 'select * from ev_article_cate where name = ? OR alias = ?'
    db.query(sql, [cate.name, cate.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc('文章分类名称或别名已被占用！')
        const sqlStr = 'insert into ev_article_cate set ?'
        db.query(sqlStr, cate, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            res.cc('新增文章分类成功！', 0)
        })
    })

}
exports.delCateById = function (req, res) {
    const sqlStr = 'update ev_article_cate set is_delete = 1 where id = ?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败！')
        res.cc('删除文章分类成功！', 0)
    })
}

exports.getCateById = function (req, res) {
    const sqlStr = 'select * from ev_article_cate where id = ?'
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('获取文章分类失败!')
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results
        })
    })
}

exports.updateCateById = function (req, res) {
    const cate = req.body
    // 查询分类名是否被占用
    const sql = 'select * from ev_article_cate where name = ? or alias = ?'
    db.query(sql, [cate.name, cate.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc('文章分类名称或别名已被占用!')
        // 名称可用，开始更新
        const sqlStr = 'update ev_article_cate set ? where id = ?'
        db.query(sqlStr, [cate, cate.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新文章分类信息失败！')
            res.cc('更新文章分类信息成功！', 0)
        })
    })
}