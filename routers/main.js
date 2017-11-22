

var express = require('express');
var markdown = require('markdown').markdown;
const marked = require('marked');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;

/*
* 处理通用的数据
* */
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

/*
* 首页
* */
router.get('/', function(req, res, next) {

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 10;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then(function(count) {

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime: -1   // 按时间倒序排列
        });

    }).then(function(contents) {
        data.contents = contents;
        res.render('main/index', data);
    })
});

/* 
    文章详情页
*/
router.get('/view', function (req, res){
    var contentId = req.query.contentid || '';

    Content.findOne({ 
        _id: contentId
    }).populate(['category', 'user']).then(function (datas) {
        data.content = datas;
        data.contentmd = markdown.toHTML(datas.content);
        datas.views++;
        datas.save();
        
        res.render('main/view', data);
    })
});

/* 
    社区首页
*/
router.get('/community', (req, res, next) => {
    res.render('main/community/community');
})

/* 
    社区 - 聊天室
*/
router.get('/community/talkRoom', (req, res, next) => {
    res.render('main/community/talkRoom');
})

/* 
    社区 - 拼图
*/
router.get('/community/puzzle', (req, res, next) => {
    res.render('main/community/puzzle');
})

/* 
    社区 - flappy bird
*/
router.get('/community/flappy_bird', (req, res, next) => {
    res.render('main/community/flappy_bird');
})


/* 
    工具首页
*/
router.get('/tool', (req, res, next) => {
    res.render('main/tool/tool');
})

/* 
    工具 - 画板
*/
router.get('/tool/palette', (req, res, next) => {
    res.render('main/tool/palette');
})
/* 
    工具 - 模拟钢琴
*/
router.get('/tool/piano', (req, res, next) => {
    res.render('main/tool/piano');
})

module.exports = router;
