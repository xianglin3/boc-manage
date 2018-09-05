/**
 * Created by nantian on 2017/2/23.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    $.get("/static/app/questionnaire/json_info/questionnaireThead.json",function(d){
        table.init(d);
    },"json");
    var table = {
        ele:"#examination",
        thead:null,
        url:"/questionnaire/list/",//获取表格数据接口
        lang:{
            "sProcessing": "处理中...",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项结果",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "全文查找:",
            "sUrl": "",
            "sEmptyTable": "未搜索任何数据...",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            }
        },
        init:function(thead){
            var me = this;
            this.thead=thead;
            this.drawHead();
            //this.addEvent(); //通过js添加事件 实现跳转 与按钮不可同时使用
        },
        drawHead:function(){
            var thead = '<thead><tr>';
            $.each(this.thead,function(i,v){
                thead += '<td>'+v["CH"]+'</td>';
            });
            thead += '</tr></thead>';
            $(this.ele).html(thead);
            this.drawBody();
        },
        drawBody:function(){
            $(this.ele).dataTable({
                "processing": true,
                "ajax": {
                    "url":this.url,
                    "type": 'POST',
                    "dataSrc":function(jsonData){
                        $.each(jsonData['data'],function(i,v){
                            v['opt'] = '<a href="/questionnaire/export/'+v["id"]+'" target="_blank" class="btn btn-info btn-sm">导出</a>';
                        });

                        return jsonData['data'];
                    }
                },
                "columns": this.thead,
                "serverSide": true,
                "language": this.lang,
                "ordering":  false
            });
            $(".preloader").addClass("hidden");
        },
        addEvent:function(){
            $(this.ele).on("click","tbody>tr",function(){
                var id = $(this).children("td:first-child").html();
                window.open("/questionnaire/examination/edit/"+id,"_blank");
            });
        }
    }
});