/**
 * Created by nantian on 2017/2/9.
 */
$(document).ready(function () {
    //添加异步请求时等待界面
    var $preloader = $('<div class="preloader hidden"> <i class="fa fa-spinner fa-spin fa-5x"></i></div>');
    $("section.content").append($preloader);
    $("div.preloader").removeClass("hidden");

    //页面加载完成第一次get请求全部数据
    $.post("/san/zoneset_summary/", function (d) {
        tableObj.init();
        tableObj.drawTable(d);
    }, "json");

    //创建一个表格对象
    var tableObj = {
        col: null,
        lang: null,
        html: "",
        table: null,
        init: function () {
            this.col = [
                {data: 'dev_name'},
                {data: 'node'},
                {data: 'zoneset_name'},
                {data: 'count'},
                {data: 'reg_pos'},
            ];
            this.lang = {//翻译
                "sProcessing": "处理中...",
                "sLengthMenu": "每页显示 _MENU_ 条记录",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "查找:",
                "sUrl": "",
                "sEmptyTable": "加载中，5s后无数据即为无数据",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                }
            };
            this.html = "<thead><tr><th>设备名</th><th>ip</th><th>zoneset</th><th>数量</th><th>地域</th></tr></thead>"
            + "<tbody><tr><td height='24'/><td/><td/><td/><td/></tr></tbody>";
            $('.portlist .table').html(this.html);
            this.drawTable([]);
        },
        drawTable: function (data) {
            if (this.table !== null) {
                this.table.destroy();
            }
            this.table = $('div.portlist .table').DataTable({
                scrollY: 600,
                columns: this.col,
                data: data,
                language: this.lang,
                lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "所有"]],
                bStateSave: true
            });
            $("div.preloader").addClass("hidden");
        },
    };
    //初始化表格
    tableObj.init();
});