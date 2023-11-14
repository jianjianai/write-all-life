// 此脚本针对网站
// http://www.yuwenlexue.com/category/ershang.html

let d;
onPost = function onPost(id, slug) {
    // datas.push({ "pid": id, "slug": slug });
    $.ajax({
        url: "/doArtiAjax",
        type: 'POST',
        async: false,
        data: { "pid": id, "slug": slug },
        success: function(response) {
            d = new DOMParser().parseFromString(response,"text/html");
        }
    });
}


