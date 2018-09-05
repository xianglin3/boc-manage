/**
 * Created by nantian on 2016/12/7.
 */

$(document).ready(function () {
    //添加异步请求时等待界面
    var $preloader = $('<div class="preloader hidden"> <i class="fa fa-spinner fa-spin fa-5x"></i></div>');
    $("section.content").append($preloader);
    $("div.preloader").removeClass("hidden");

    //页面加载完成第一次get请求全部数据
    $.get("/portconfiger/get_ports_status/", function (d) {
        tableObj.init();
        tableObj.drawTable(d);
    }, "json");

    //获取园区和IP对应关系
    $.get("/portconfiger/campus_areas_info/", function (d) {
        var parameters = {};
        var li = "";
        $.each(d, function (i, v) {
            li += '<li class="option"><a href="' + i + '">' + i + '</a></li>';
        });
        $("ul[data-title=ip_list]").append(li);
        //选择按钮的选择事件
        $("div.filterBox li>a").click(function (e) {
            var e = e || event;
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            $(this).parent("li").toggleClass("active");
            var pro = $(this).attr("href");
            var field = $(this).parents("ul.list-inline").attr("data-title");
            var hasClass = $(this).parent("li").hasClass("active");
            if (pro == "all") {
                if (hasClass) {
                    $(this).parent("li").siblings("li.option").addClass("active");
                } else {
                    $(this).parent("li").siblings("li.option").removeClass("active");
                }
                delete parameters[field];
            } else {
                parameters[field] = [];
                $(this).parents("ul.list-inline")
                    .find("li.option.active>a").each(function (i, v) {
                    var href = $(v).attr("href");
                    if(field=="ip_list"){
                        parameters[field]=Array.prototype.concat.apply(parameters[field],d[href]);
                    }else{
                        parameters[field].push(href);
                    }
                });
                parameters[field].length == 0 && delete parameters[field];
                if (hasClass) {
                    var liTotal = $(this).parent("li").siblings("li.option").length + 1;
                    var liActive = $(this).parents("ul.list-inline").find("li.active").length;
                    if (liActive >= liTotal) {
                        $(this).parent("li").siblings("li.all").addClass("active");
                        delete parameters[field];
                    }
                } else {
                    $(this).parent("li").siblings("li.all").removeClass("active");
                }
            }
        });
        //开始筛选
        $("#search").click(function () {
            $("div.preloader").removeClass("hidden");
            $.post("/portconfiger/get_ports_status/", parameters, function (d) {
                tableObj.drawTable(d);
            }, "json")
        });
        //下载按钮
        $("#download").click(function () {
            $.post("/portconfiger/download_all_ports/", parameters, function (d) {
                function export_raw(name, data) {
                    var urlObject = window.URL || window.webkitURL || window;

                    var export_blob = new Blob([data]);

                    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                    save_link.href = urlObject.createObjectURL(export_blob);
                    save_link.download = name;
                    fake_click(save_link);
                }
                function fake_click(obj) {
                    var ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent(
                        "click", true, false, window, 0, 0, 0, 0, 0
                        , false, false, false, false, 0, null
                    );
                    obj.dispatchEvent(ev);
                }
                export_raw("过滤后的端口列表.csv",d)
            })
        });
    }, "json");
    //创建一个表格对象
    var tableObj = {
        col: null,
        lang: null,
        html: "",
        table: null,
        init: function () {
            this.col = [
                {data: 'ip'},
                {data: 'name'},
                {data: 'status'},
                {data: 'status_reason'},
                {data: 'mode'},
                {data: 'mac'},
                {data: 'mac_history'},
                {data: 'interface_ip'},
                {data: 'interface_ip_history'},
                {data: 'updatetime'}
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
            this.html = "<thead><tr><th>ip</th><th>name</th><th>status</th><th>status原因</th><th>mode</th><th>当前mac</th><th>历史mac</th><th>arp</th><th>历史arp</th><th>update</th></tr></thead>"
                + "<tbody><tr><td height='24'/><td/><td/><td/><td/><td/><td/><td/><td/></tr></tbody>";
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
                bStateSave: true,
            });
            $("div.preloader").addClass("hidden");
        }
    };
    //初始化表格
    tableObj.init();
});