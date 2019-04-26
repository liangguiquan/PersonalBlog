var randomTags = new Vue({
    el: '#random_tags',
    data: {
        tags: []
    },
    created: function(){
        axios({
            methid: 'get',
            url: '/queryRandomTags'
              }).then(function(resp){
                  // console.log(resp.data.data);
                  var temp = [];
                  for(var i = 0; i < resp.data.data.length; i++){
                      temp.push({text: resp.data.data[i].tag, link: '/?tag=' + resp.data.data[i].tag});
                      // console.log(temp);
                  }
                    randomTags.tags = temp;
                  // console.log(randomTags.tags);
        })
    },
    computed: {
        randomColor: function() {
            return function(){
                var red = Math.random() * 255 + 50;
                var green = Math.random() * 255 + 50;
                var blue = Math.random() * 255 + 50;
                return `rgb(${red}, ${green}, ${blue})`;
                // return "rgb(" + red + "," + green + "," + blue + ")";
            }

        },
        randomSize: function() {
            return function(){
                var size = (Math.floor(Math.random() * 10) + 12) + 'px';
                return size;
            }
        }
    }
});


var newHot = new Vue({
    el: '#new_hot',
    data: {
        titleList: []
    },
    created: function(){
    axios({
        mothed: 'get',
        url: '/queryHotBlog'
    }).then(function(resp){
        // console.log(resp.data.data);
        var result = [];
        for(var i = 0; i < resp.data.data.length; i++){
            var temp = [];
            temp.title = resp.data.data[i].title;
            temp.link = '/blog_detail.html?bid=' + resp.data.data[i].id;
            result.push(temp);
        }

        newHot.titleList = result;
    })

    },

});


var newComments = new Vue({
    el: '#new_comments',
    data:{
        commentsList: []
    },
    created: function(){
        axios({
            mothed: 'get',
            url: '/queryNewComments'
        }).then(function(resp){
            // console.log(resp.data.data);
            var result = [];
            for(var i = 0; i < resp.data.data.length; i++){
                var temp = [];
                temp.name = resp.data.data[i].user_name;
                temp.date = resp.data.data[i].ctime;
                temp.comment = resp.data.data[i].comment;
                result.push(temp);
            }

            newComments.commentsList = result;
        })
    }
});
