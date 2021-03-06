﻿'use strict';
exports.ready = (req, res, that) => {

    const method = req.method; // 当前链接的请求类型, GET / POST / PUT
    const query = req.query; // 当前请求传递过来的 GET 数据,
    const body = req.body; // 当前请求传递过来的 POST 数据

    // 链接数据库
    // 链接 / 操作数据库
    // 有不懂, 看这个 http://blog.csdn.net/zxsrendong/article/details/17006185
    
    if(req.session.user_rows == null){
         return res.errorEnd('当前请求不存在 Token 或 Token 不可用', 300);
     }
    if(req.session.user_token != body.token){
         return res.errorEnd('当前请求不存在 Token 或 Token 不可用', 300);
    }
    if(  that.isEmpty(body.pid) ){
        return res.errorEnd('个人不能为空', 200);
    }
    that.connect((err, db,conn) => {

      

        db.query("select * from `db_people`  where id = ? and is_manager='0'  and is_shopowner='0' ", [body.pid], function(err, row, fields) {
                // 数据获取失败
                if (err) {
                    db.release(); // 释放资源
                    conn.end(); // 结束当前数据库链接
                    return res.errorEnd('老板或店长直接关联代言人不可撤销', 200);
                }
                //余额为零就可以取消代言人
                if(row[0].amount==0){
                    db.query(" update db_people set is_clerk='0',is_prolocutor='0' where id=? ",[body.pid], function(err, result1, fields) {
                        // 数据获取失败
                        if (err) {
                            db.rollback();
                            db.release(); // 释放资源
                            conn.end(); // 结束当前数据库链接
                            return res.errorEnd('修改个人信息失败', 200);
                        }
                        db.commit();
                        db.release(); // 释放资源
                        conn.end(); // 结束当前数据库链接
                        return res.successEnd('撤销代言人成功！', 0);

                    })
                }else{
                    db.commit();
                    db.release(); // 释放资源
                    conn.end(); // 结束当前数据库链接
                    return res.errorEnd('账号有余额，无法撤销代言人！', 200);
                }
    

            })

    });
}