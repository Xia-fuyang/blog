var perpage = 10;
var page = 1;
var pages = 0;
var comments = [];

// 提交评论
$("#messageBtn").on("click", function() {
    if($("#messageContent").val() == "") {
        return;
    }
    $.ajax({
        type: "post",
        url: "/api/comment/post",
        data: {
            contentid: $("#contentId").val(),
            content: $("#messageContent").val()
        },
        success: function(result) {
            $("#messageContent").val("");
            comments = result.data.comments.reverse();
            renderComment();

        }
    });
});

/*
* 每次页面重载的时候，获取一下该文章的所有评论
* */
$.ajax({
    url: "/api/comment",
    data: {
        contentid: $("#contentId").val()
    },
    success: function(result) {
        comments = result.data.reverse();
        renderComment();
    }
});

$(".pager").delegate("a", "click", function() {
    if($(this).parent().hasClass("previous")) {
        page--;
    } else {
        page++;
    }
    renderComment();
})

function renderComment() {
    $("#messageCount").html(comments.length);
    $(".colInfo").eq(3).html(comments.length);

    pages = Math.ceil(comments.length / perpage);
    var start = Math.max(0, (page - 1) * perpage);
    var end = Math.min(start + perpage, comments.length);

    $lis = $(".pager li");
    $lis.eq(1).html( page + "/" + pages );

    if(page <= 1) {
        page = 1;
        $lis.eq(0).html("<span>没有上一页</span>")
    } else {
        $lis.eq(0).html("<a href='javascript:;'>上一页</a>")
    }

    if(page >= pages) {
        page = pages;
        $lis.eq(2).html("<span>没有下一页</span>")
    } else {
        $lis.eq(2).html("<a href='javascript:;'>下一页</a>")
    }

    if(comments.length == 0) {
        $(".messageList").html("<div class='showMessage'><p>还没有评论</p></div>");
        $(".pager").hide();
    } else {
        var html = "";
        for(var i = start; i < end; i++) {
            html += '<div class="messageBox">' +
                '<p class="name"><span class="fl">'+ comments[i].username +'</span><span class="fr">'+ formatDate(comments[i].postTime) +'</span></p><p>'+ comments[i].content +'</p>' +
                '</div>'
        }
        $(".messageList").html(html);
        $(".pager").show();
    }
}

function formatDate(date) {
    var date1 = new Date(date);
    return date1.getFullYear() + "-" + (date1.getMonth()+1) + "-" + date1.getDate() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
}
