$(function () {

    // 文章预览
    $('.content_views_Btn').click(function () {
        var html = markdown.toHTML($('#content').val());
        $('#content_views .modal-body').html(html);
    })
});