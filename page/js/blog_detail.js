var blogDetail = new Vue({
    el: '#blog_detail',
    data: {
            title: '',
            tags: '',
            content: '',
            ctime: '',
            views: ''
    },
    // methods: {
    //
    // },
    created: function(){
        var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';

        if(searchUrlParams == ''){
            return;
        }

        var bid = -1;
        for(var i = 0; i < searchUrlParams.length; i++){
            if(searchUrlParams[i].split('=')[0] == 'bid'){
                try{
                    bid = searchUrlParams[i].split('=')[1];
                }catch(e){
                    console.log(e);
                }
            }
        }
        axios({
            method: 'get',
            url: '/queryBlogById?bid=' + bid
        }).then(function(resp){
            var result = resp.data.data[0];
            // console.log(result);
            blogDetail.title = result.title;
            blogDetail.tags = result.tags;
            blogDetail.ctime = result.ctime;
            blogDetail.content = result.content;
            blogDetail.views = result.views;

        }).catch(function(resp){
            console.log('请求失败');
        })
    },

});


var c= new Vue({    // c --> sendComment
    el: '#send_comment',
    data: {
        vcode: '',
        rightCode: ''
    },

    methods: {
        sendComment: function(){
            var code = document.getElementById('comment_code').value;

            if(code != c.rightCode){
                alert('验证码错误，请重新输入');
                return;
            }

            var searchUrlParams = location.search.indexOf('?') > -1 ? location.search.split('?')[1].split('&') : '';

            var bid = -10;
            for(var i = 0; i < searchUrlParams.length; i++){
                if(searchUrlParams[i].split('=')[0] == 'bid'){
                    try{
                        bid = searchUrlParams[i].split('=')[1];
                    }catch(e){
                        console.log(e);
                    }
                }
            }

            var reply = document.getElementById('comment_reply').value;
            var replyName = document.getElementById('comment_reply_name').value;
            var name = document.getElementById('comment_name').value;
            var email = document.getElementById('comment_email').value;
            var content = document.getElementById('comment_content').value;

            axios({
                method: 'get',
                url: '/addComment?bid=' + bid + '&parent=' + reply +'&userName=' + name + '&email=' + email + '&content=' + content + '&parentName=' + replyName
            }).then(function(resp){
                alert(resp.data.msg);
            });
        },

        changeCode: function(){
            axios({
                method: 'get',
                url: '/queryRandomCode'
            }).then(function(resp){
                // console.log(resp);
                c.vcode = resp.data.data.data;
                c.rightCode = resp.data.data.text;
            });
        },

    },

    created: function(){
        this.changeCode();
    }


});


var blogComments = new Vue({
    el: '#blog_comments',
    data: {
        total: 100,
        commentsList: []
    },
    methods: {
        reply: function(commentId, userName){
            document.getElementById('comment_reply').value = commentId;  // 回复哪条评论 id
            document.getElementById('comment_reply_name').value = userName;   // 原来评论的人
            location.href = '#send_comment';
        }
    },

    created: function(){
        var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        var bid = -10;

        for (var i = 0 ; i < searcheUrlParams.length ; i ++) {
            if (searcheUrlParams[i].split("=")[0] == "bid") {
                try {
                    bid = parseInt(searcheUrlParams[i].split("=")[1]);
                }catch (e) {
                    console.log(e);
                }
            }
        }
        axios({
            method: "get",
            url: "/queryCommentsByBlogId?bid=" + bid
        }).then(function(resp){
            blogComments.commentsList = resp.data.data;
            // console.log(blogComments.commentsList);
            for(var i = 0; i < blogComments.commentsList.length; i++){
                if(blogComments.commentsList[i].parent > -1){
                    blogComments.commentsList[i].options = '回复@' + blogComments.commentsList[i].parent_name;
                }
            }
            });

        axios({
            method: "get",
            url: "/queryCommentsCountByBlogId?bid=" + bid
        }).then(function(resp){
            // console.log(resp.data.data);
            blogComments.total = resp.data.data[0].count;
        })

    },
});

