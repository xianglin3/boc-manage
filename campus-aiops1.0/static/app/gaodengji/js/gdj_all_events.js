/**
 * Created by nantian on 2017/4/5.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");

    var table = {
        ele:"#dataTables_device",
        table:null,
        thead:null,
        url:"",
        editUrl:"/gaodengji/editEvent/",
        batchUrl:"/gaodengji/batch_edit/",
        data:null,
        selected:[],
        init:function(thead){
            var me = this;
            me.url = $("#hid_url").html();
            $(me.ele).on('draw.dt',function (){
                $("#result_num").html($(me.ele+"_info").html());
            });
            me.thead = thead;
            me.drawHead();
            me.drawBody();
        },
        drawHead:function(){
            var tHead = '<thead><tr>';
            $.each(this.thead,function(i,v){
                tHead += '<th>'+v["CH"]+'</th>';
            });
            $(this.ele).html(tHead);
        },
        requestData:function(a,b){
            $(".preloader").removeClass("hidden");
            this.table.ajax.reload(a,b);
        },
        drawBody:function(){
            var me = this;
            me.table = $(me.ele).DataTable({
                dom: 'B<"clear">plrfti',
                responsive: false,
                ordering: false,
                columns:me.thead,
                lengthMenu:[[50,100,300,500,1000,-1],[50,100,300,500,1000,"所有"]],
                stateSave: true,
                language:{
                    "sProcessing": "处理中...",
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
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
                serverSide: true,
                ajax: {
                    url:me.url,
                    type: 'POST',
                    data:function(reqData){
                        var param = {};
                        $(".form-group .form-control").each(function(i,v){
                            param[$(v).attr("name")] = $(v).val();
                        });
                        reqData['search_json'] = JSON.stringify(param);
                    },
                    dataSrc:function(d){
                        me.data = {};
                        $.each(d['data'],function(i,v){
                            me.data["id_"+v["id"]] = v;
                            v['opt'] = '<div data-id="'+v["id"]+'">'+ $('#hid_row_btn').html()+'</div>';
                            v['note'] = '<div title="'+v['note']+'">'+v['note'].slice(-100)+'</div>';
                            v['checkbox'] = '<input type="checkbox" data-checkId="'+v["id"]+'">';
                        });
                        me.selected = [];
                        $(".mod_more").prop("disabled",true);
                        $("input[data-checkId=all]").prop("checked",false);
                        $(".preloader").addClass("hidden");
                        return d['data'];
                    }
                },
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '导出到Excel',
                        exportOptions: {//自定义导出的列
                            columns:( function ( idx, data, node ) {
                                return idx== 15 ?false : true;
                            } )
                        },
                        filename:"高等级事件"
                    }
                ]
            });
            me.colShow();
            me.addEvent();
        },
        colShow:function(){
            var me = this;
            $.each(me.thead,function(i,v){
                me.table.column(i).visible(v["show"],false);
            });
        },
        addEvent:function(){
            var me = this;
            $(me.ele+'_length').after('<div id="show_filed">'+$("#hid_show_col").html()+'</div>');
            //保持选中状态
            $("#show_filed .dropdown-menu>li").each(function(i,v){
                var index = $(v).children('a').attr("href")-0;
                me.thead[index]['show']&&$(v).addClass('active');
            });
            $("#show_filed .dropdown-menu>li>a").click(function(e){
                e = e || event;
                e.preventDefault();
                e.stopPropagation();
                $(this).parent("li").toggleClass("active");
                var index = $(this).attr("href")-0;
                me.thead[index]['show'] = $(this).parent("li").hasClass("active");
                sessionStorage.setItem(key,JSON.stringify(me.thead));
                me.colShow();
            });
            //清空搜索
            $("#btn_reset").click(function(){
                $(".form-group .form-control").each(function(i,v){
                    $(v).val("");
                });
            });
            //开始搜索
            $("#btn_search").click(function(){
                me.requestData();
            });
            //表格中按钮动作
            $(me.ele).on("click","button.btn",function(){
                var act = $(this).attr('data-act'),
                    id = $(this).parent("div").attr('data-id');
                if(act == "cl"){
                    $("#myModal [name=number]").val(me.data["id_"+id]["number"]);
                    $("#myModal [name=id]").val(id);
                    $("#myModal [name=state]").val(me.data["id_"+id]["state"]);
                    $("#myModal [name=note]").val("");
                    $("#myModal").modal("show");
                }else{
                    var param = {"id":id};
                    param[act] = 1;
                    $(".preloader").removeClass("hidden");
                    $.post(me.editUrl,param,function(d){
                        me.requestData(null,false);
                    });
                }
            });
            //弹出框中的保存
            $("#modal_save").click(function(){
                var param = {},
                    note = "";
                $("#myModal .modal_input").each(function(i,v){
                    param[$(v).attr("name")] = $(v).val();
                    $(v).attr("name")=="note"&&(note = $(v).val());
                });
                if(note){
                    $(".preloader").removeClass("hidden");
                    $('#myModal').modal('hide');
                    $.post(me.editUrl,param,function(d){
                        me.requestData(null,false);
                    });
                }else{
                    window.alert("备注不能为空!!");
                }
            });

            //复选框批量修改
            $(me.ele).on("click","input[data-checkId]",function(){
                var isSel = $(this).prop("checked");
                var id = $(this).attr("data-checkId");
                if(id == "all"){
                    if(isSel){
                        me.selected = [];
                        $(me.ele+" tbody input[data-checkId]").each(function(i,v){
                            me.selected.push($(v).attr("data-checkId"));
                            $(v).prop("checked",true);
                        });
                    }else{
                        $(me.ele+" tbody input[data-checkId]").each(function(i,v){
                            me.selected = [];
                            $(v).prop("checked",false);
                        });
                    }
                }else{
                    if(isSel){
                        me.selected.push(id);
                        if(me.selected.length == $(me.ele+" tbody input[data-checkId]").length){
                            $("input[data-checkId=all]").prop("checked",true);
                        }
                    }else{
                        var i = me.selected.indexOf(id);
                        if(i>-1){
                            me.selected.splice(i,1);
                        }
                        $("input[data-checkId=all]").prop("checked",false);
                    }
                }
                if(me.selected.length){
                    $(".mod_more").prop("disabled",false);
                }else{
                    $(".mod_more").prop("disabled",true);
                }
            });
            $(".box-body").on("click","input.mod_more",function(){
                $("#myModal_1 [name=note]").val("");
                $("#myModal_1").modal("show");
            });
            $("#modal_save_1").click(function(){
                var param = {},
                    note = "";
                $("#myModal_1 .modal_input").each(function(i,v){
                    param[$(v).attr("name")] = $(v).val();
                    $(v).attr("name")=="note"&&(note = $(v).val());
                });
                param['ids'] = me.selected;
                if(note){
                    $(".preloader").removeClass("hidden");
                    $('#myModal_1').modal('hide');
                    $.post(me.batchUrl,param,function(d){
                        me.requestData(null,false);
                    });
                }else{
                    window.alert("备注不能为空!!");
                }
            });
        }
    };

    //查询session中的数据是否存在
    var key = 'tHead'+location.pathname;
    if(sessionStorage.getItem(key)){
        table.init(JSON.parse(sessionStorage.getItem(key)));
    }else{
        $.get("/static/app/gaodengji/json/thead.json",function(d){
            sessionStorage.setItem(key,JSON.stringify(d));
            table.init(d);
        },"json");
    }

});