var express = require("express");
var router = express.Router();
var crypto = require("crypto");
var key = "xiafuyang*1995year";

var User = require("../models/User");
var Category = require("../models/Category");

router.use(function(req,res,next) {
    if(!req.userInfo.isAdmin) {
        // 如果当前用户是非管理员
        res.send("对不起，只有管理员才能进入后台管理");
        return;
    }
    next();
});

/*
* 首页
* */
router.get("/", function(req, res, next) {
    res.render("admin/index",{
        userInfo: req.userInfo
    });
});

/*
* 用户管理
* */
router.get("/user", function(req, res) {

    /*
    * 从数据库中读取所有的用户数据
    *
    * limit(Number) : 限制获取的数据条数
    *
    * skip(Number) : 忽略数据的条数
    *
    * */

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    var a = [];

    User.count().then(function(count) {

        // 计算总页数
        pages = Math.ceil(count / limit);
        // 取值不能超过pages
        page = Math.min(page, pages);
        // 取值不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;
        for(var i = 1; i <= pages; i++){
            a.push('{'+i+'}');
        }
        User.find().limit(limit).skip(skip).then(function(users) {
            for(var i = 0; i < users.length; i++) {
                var p =users[i].password;
                var decipher=crypto.createDecipher('aes-256-cbc',key);
                var dec=decipher.update(p,'hex','utf8');
                dec+=decipher.final('utf8');
                users[i].password = dec;
            }

            res.render("admin/user_index",{
                userInfo: req.userInfo,
                users: users,
                page: page,
                a: a
            });
        });
    });

});

/*
* 分类首页
* */
router.get("/category", function(req, res) {
    res.render('admin/category_index', {
        userInfo: req.userInfo
    });
});

/*
* 分类的添加
* */
router.get("/category/add", function(req, res) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});

/*
* 分类的保存
* */
router.post("/category/add", function(req, res) {
    var name = req.body.name || "";

    if(name == "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "名称不能为空"
        });
    }

    // 数据库中是否已经存在同名分类名称
    
});

module.exports = router;