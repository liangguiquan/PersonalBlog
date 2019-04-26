
var everyDay = new Vue({
    el: '#every_day',

    data: {
        content: '',
    },
    created: function (){
        // 请求数据，给content赋值
        axios({
            method: 'get',
            url: '/queryEveryDay'
        }).then(function(resp){
            // console.log(resp.data.data[0].content);
            everyDay.content = resp.data.data[0].content;
        }).catch(function(){
            console.log('请求失败');
        })
    }

});



var list = new Vue({
    el: '#article_list',

    data: {
        page: 1,
        pageSize: 5,
        count: 100,
        articleList: [],
        pageNumList: []
    },


    methods: {
        getPage: function(page, pageSize){
            var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
            var tag = '';

            for (var i = 0 ; i < searcheUrlParams.length ; i ++) {
                if (searcheUrlParams[i].split("=")[0] == "tag") {
                    try {
                        tag = searcheUrlParams[i].split("=")[1];
                    }catch (e) {
                        console.log(e);
                    }
                }
            }

            if(tag == ''){   // 不是查询的情况.正常加载index.html的情况
                axios({
                    method: 'get',
                    url: "/queryBlogByPage?page=" + (page - 1) + "&pageSize=" + pageSize
                }).then(function(resp){
                    // console.log(resp.data.data);
                    var result = resp.data.data;
                    var listArr = [];
                    for(var i = 0; i < result.length; i++){
                        var temp = {};
                        for( var key in result[i]){
                            temp[key] = result[i][key];
                        }
                        temp.link = '/blog_detail.html?bid=' + result[i].id;
                        listArr.push(temp);
                    }
                    // console.log(listArr);
                    list.articleList = listArr;
                }).catch(function(){
                    console.log('请求失败');
                });

                axios({
                    method: 'get',
                    url: '/queryBlogCount'
                }).then(function(resp){
                    list.count = resp.data.data[0].count;
                    list.generatePageTool();
                    // console.log(this, this.pageNumList);
                });
            }else{
                axios({
                    method: 'get',
                    url: "/queryBlogByTag?page=" + (page - 1) + "&pageSize=" + pageSize + '&tag=' + tag
                }).then(function(resp){
                    var result = resp.data.data;
                    var listArr = [];
                    for(var i = 0; i < result.length; i++){
                        var temp = {};
                        for( var key in result[i]){
                            temp[key] = result[i][key];
                        }
                        temp.link = '/blog_detail.html?bid=' + result[i].id;
                        listArr.push(temp);
                    }
                    // console.log(listArr);
                    list.articleList = listArr;
                }).catch(function(){
                    console.log('请求失败');
                });

                axios({
                    method: 'get',
                    url: '/queryBlogCountByTag?tag='+ tag
                }).then(function(resp){
                    list.count = resp.data.data[0].count;
                    list.generatePageTool();
                });
            }


        },

        generatePageTool: function () {
            var nowPage = this.page;
            var pageSize = this.pageSize;
            var totalCount = this.count;
            var result = [];
            result.push({text:"第一页", page: 1});
            if (nowPage > 2) {
                result.push({text: nowPage - 2, page:nowPage - 2});
            }
            if (nowPage > 1) {
                result.push({text: nowPage - 1, page:nowPage - 1});
            }
            result.push({text: nowPage, page:nowPage});
            if (nowPage + 1 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({text:nowPage + 1, page: nowPage + 1});
            }
            if (nowPage + 2 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({text:nowPage + 2, page: nowPage + 2});
            }
            result.push({text:"最后", page: parseInt((totalCount + pageSize - 1) / pageSize)});
            this.pageNumList = result;
            return result;
        },

        jumpTo: function (page) {
            this.getPage(page, this.pageSize);
            this.page = page;
        },

    },

    created: function (){
        this.getPage(this.page, this.pageSize);
    }

});
