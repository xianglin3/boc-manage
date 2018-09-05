/**
 * Created by nantian on 2017/2/9.
 */
$(document).ready(function () {
    //添加异步请求时等待界面
    var $preloader = $('<div class="preloader hidden"> <i class="fa fa-spinner fa-spin fa-5x"></i></div>');
    $("section.content").append($preloader);
    $("div.preloader").removeClass("hidden");

    //页面加载完成第一次get请求全部数据
    $.post("/deviceassets/device_list/san/", function (d) {
        //tableObj.init();
        tableObj.drawTable(d);
    }, "json");

    //创建一个表格对象
    var tableObj = {
        col: null,
        lang: null,
        html: "",
        table: null,
        init: function () {
                var me = this;
                this.col = [
                {data: 'node',CH:"ip"},
                {data: 'dev_name',CH:"设备名"},
                {data: 'device_model',CH:"型号"},
                {data: 'factory',CH:"厂商"},
                {data: 'list_name',CH:"环"},
                {data: 'role',CH:"角色"},
                {data: 'building_location',CH:"楼房"},
                {data: 'detail_locate',CH:"详细位置"},
                {data: 'opt',CH:"操作"}
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
            this.html = "<thead><tr>";
            $.each(this.col,function(i,v){
                me.html += "<th>"+v['CH']+"</th>"
            });
            this.html += '</tr></thead>'
            $('.portlist .table').html(this.html);
            //this.drawTable([]);
            this.addEvent();
        },
        drawTable: function (data) {
            var me = this;
            if (this.table !== null) {
                this.table.destroy();
            }
            var tbody = '<tbody>';
            $.each(data,function(i,v){
                tbody += '<tr>';
                $.each(me.col,function(item,val){
                    var td = (val['data'] == "opt"?'<button type="button" data-ip="'+v['node']+'" class="request_wwn_data btn-success">所有wwn</button><button type="button" data-id="'+v['id']+'" class="request_interface_data btn-success">所有端口</button>':
                        v[val['data']]);
                    tbody += '<td>'+td+'</td>';
                });
                tbody += '</tr>';
            });
            tbody += '</tbody>';
            $('div.portlist .table').append(tbody);
            this.table = $('div.portlist .table').DataTable({
                //scrollY: 600,
                columns: this.col,
                language: this.lang,
                lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "所有"]],
                bStateSave: true
            });
            $("div.preloader").addClass("hidden");
        },
        addEvent:function(){
            $("div.portlist .table").on("click",".request_wwn_data",function(){
                var ip=$(this).attr("data-ip");
                window.open('/san/search_wwn/?ip='+ip, '_blank')

            });
            $("div.portlist .table").on("click",".request_interface_data",function(){
                var device_id=$(this).attr("data-id");
                window.open('/device_switch/device_panel/?device_id='+device_id, '_blank')
            });
        }
    };
    //初始化表格
    tableObj.init();
});