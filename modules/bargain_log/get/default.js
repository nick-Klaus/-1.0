/**
 * Created by Administrator on 2017/8/14.
 * 砍价活动日志 获取
 */
'use strict';
exports.ready = (req, res, that) => {

    const method = req.method; // 当前链接的请求类型, GET / POST / PUT
    const query = req.query; // 当前请求传递过来的 GET 数据,
    const body = req.body; // 当前请求传递过来的 POST 数据
    that.connect(( err , db , conn ) => {
        // 查询数据
        db.query("select * from `db_bargain_log` where  user_id=? and openid=? and bargain_id=?",[body.user_id,body.openid,body.bargain_id], function(err, row, fields) {
            // 数据获取失败
            if (err) {
                db.release();// 释放资源
                conn.end(); // 结束当前数据库链接
                return res.errorEnd('没有找到可用数据', 200);
            }
            // 这个打印, 只会出现在主程序的控制台中
            db.release(); // 释放资源
            conn.end(); // 结束当前数据库链接
            return res.successEnd(row);
        })
    });
}