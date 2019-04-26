
var path = new Map();
var url = require('url');
var tagsDao = require('../dao/TagsDao');
var blogDao = require('../dao/BlogDao');
var timeUtil = require('../util/TimeUtil');
var respUtil = require('../util/RespUtil');
var tagBlogMappingDao = require('../dao/TagBlogMappingDao');


function queryRandomTags(request, response){
    tagsDao.queryAllTags(function(result){

        result.sort(function(){
            return Math.random() > 0.5 ? true : false;
        });
        // console.log(result);

        response.writeHead(200);
        response.write(respUtil.writeResult('success', '添加成功', result));
        response.end();
    })
}

path.set('/queryRandomTags', queryRandomTags);



function queryBlogByTag(request, response) {
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function (result) {
        if (result == null || result.length == 0) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        } else {
            // 先用传入的tag值在tag表中查找到相应的字段和id，然后利用id去tag_blog_mapping表去查找相应的blog的id,最后用blog.id去blog表查找对应的blog
            // console.log(result[0]);
            tagBlogMappingDao.queryBlogByTagId(result[0].id, parseInt(params.page), parseInt(params.pageSize), function (result) {

                var blogList = [];
                for (var i = 0 ; i < result.length ; i ++) {
                    blogDao.queryBlogById(result[i].blog_id, function (result) {  // 这里存在异步
                        blogList.push(result[0]);
                    });
                }
                // console.log(blogList);  --> []
                getResult(blogList, result.length, response);  //阻塞的作用，不设置这个函数，blogList = []
            });
        }
    });
}

path.set('/queryBlogByTag', queryBlogByTag);



function getResult(blogList, len, response) {
    if (blogList.length < len) {
        setTimeout(function () {
            getResult(blogList, len, response);
        }, 10);
    } else {
        for (var i = 0 ; i < blogList.length ; i ++) {
            blogList[i].content = blogList[i].content.replace(/<img[\w\W]*">/, "");
            blogList[i].content = blogList[i].content.replace(/<[\w\W]{1,5}>/g, "");
            blogList[i].content = blogList[i].content.substring(0, 300);
        }
        // console.log(blogList);
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", blogList));
        response.end();
    }
}



function queryBlogCountByTag(request, response){
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function(result){
        tagBlogMappingDao.queryBlogCountByTagId(result[0].id,function(result){
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        })
    })
}

path.set('/queryBlogCountByTag', queryBlogCountByTag);




module.exports.path = path;
