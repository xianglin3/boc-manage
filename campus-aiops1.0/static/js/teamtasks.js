/**
 * Created by nantian on 2016/12/1.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    $.get("/teamtasks/get_task_list/",function(d){
        table.init(d);
        table.classify({status:"all",year:"all",group:"all"});
    },"json")
    $("ul.nav-tabs>li>a").click(function(e){
        var e=e||event;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
        $(".preloader").removeClass("hidden");
        $(this).parent("li").addClass("active").siblings("li").removeClass("active");
        var pro=$(this).attr("href");
        table.classify({status:pro});
    });
    $(".container-fluid select[data-name]").change(function(){
        var option={};
        var name=$(this).attr("data-name");
        var val=$(this).val();
        option[name]=val;
        table.classify(option);
    });
    $(".container-fluid button.reset").click(function(){
        $(".container-fluid select[data-name]").val("all").trigger("change");
    });
    var table={
        lang:null,
        data:null,
        newData:null,
        table:null,
        trChild:null,
        isFirst:true,
        status:"",//用来筛选任务状态
        year:"2016",//用来筛选年份
        group:"",
        init:function(d){
            var me=this;
            this.data=d;
            this.lang={
                "sProcessing": "处理中...",
                "sLengthMenu": "每页显示 _MENU_ 项任务   （点击任务打开子任务列表）",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 项任务，共 _TOTAL_ 项",
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
            };
        },
        classify:function(option){
            this.newData={}
            !option&&(option={});
            if(option.status){
                this.status=option.status;
            }
            if(option.year){
                this.year=option.year;
            }
            if(option.group){
                this.group=option.group;
            }
            var me=this;
            this.status=(isNaN(this.status)?this.status:this.status-0);//三目运算、隐式转换
            $.each(this.data,function(i,v){
                var year= (v.task_id+"").slice(0,4);
                if(me.status!=="all"){
                    if(me.status== v.status){
                        a();
                    }
                }else{
                    a();
                }
                function a(){
                    if(me.year!=="all"){
                        if(me.year==year){
                            b();
                        }
                    }else{
                        b();
                    }
                }
                function b(){
                    if(me.group!=="all"){
                        if(v.group.indexOf(me.group)>=0){
                            c(v);
                        }
                    }else{
                        c(v);
                    }
                }
            });
            function c(v){
                if(v.task_id.length==10){
                    me.newData[v.task_id]=v;
                    me.newData[v.task_id]["data"]=[];
                }else if(v.task_id.length>11){
                    var pro=v.task_id.slice(0,10);
                    if(me.newData[pro]===undefined){
                       me.newData[pro]={
                           task_id:pro,
                           type:v.type,
                           name:v.name,
                           group: v.group,
                           status:4,
                           priority:3,
                           data:[]
                       };
                    }
                    me.newData[pro]["data"].push(v);
                }
            }
            this.drawTable();
            this.addEvent();
        },
        drawTable:function(){
            var me=this;
            this.table&&this.table.destroy&&this.table.destroy();
            $('#dataTables-device tbody').remove();
            var tbody=$('<tbody></tbody>');
            this.trChild={};
            var priority=[
                '<span style="color: orangered">高</span>',
                '<span style="color: orange">中</span>',
                '<span style="color: #008000">低</span>',
                " "
            ];
            var status=[
                ["未开始","btn-warning","启动"],
                ['<span style="color: #00b3ee">进行中</span>',"btn-info","跟进"],
                ['<span style="color: #008000">已完成</span>',"btn-success","查看"],
                ['<span style="color: orangered">延迟</span>',"btn-danger","跟进"],
                [' '," "," "]
            ];
            $.each(this.newData,function(i,v){
                var pri=priority[v.priority]||"未知";
                var sta=status[v.status]||["状态不明","btn-info","跟进"];
                if(v.priority==3&&v.status==4){//判断是不是一个组行
                    var followup="",opt="";
                }else{
                    var followup='<a class="btn '+sta[1]+' btn-xs" href="'+v.id+'">'+sta[2]+'</a>',
                        opt='<span><a class="fa fa-gear"  href="/teamtasks/editTask/?id='+v.id+'"></a></span>'+
                    '<span><a class="fa fa-search" href="/teamtasks/viewTask/?id='+v.id+'"></a></span>';
                }
                var tr=$('<tr data-parent="'+ v.task_id+'">' +
                    '<td>'+ (v.task_id=="None"?"":v.task_id)+'</td>' +
                    '<td>'+ v.type+'</td>' +
                    '<td>'+ v.name+' ('+ v.data.length+')</td>' +
                    '<td></td>' +
                    '<td>'+ (v.group||"")+'</td>' +
                    '<td>'+ (v.responsible||"")+'</td>' +
                    '<td>'+ (v.run_up_time||"")+'</td>' +
                    '<td>'+ (v.completion_time||"")+'</td>' +
                    '<td>'+ (pri||"")+'</td>' +
                    '<td>'+(sta[0]||"")+'</td>' +
                    '<td>'+ (v.update_time||"")+'</td>' +
                    '<td class="genJin">'+followup+'</td>' +
                    '<td class="edit_view">'+opt+'</td>' +
                '</tr>');
                tbody.append(tr);
                me.trChild[v.task_id]=[];
                $.each(v.data,function(item,val){
                    var pri=priority[val.priority]||"未知";
                    var sta=status[val.status]||["状态不明","btn-info","跟进"];
                    var tr1=$('<tr data-child="'+ v.task_id+'">' +
                        '<td>'+ (val.task_id=="None"?"":val.task_id)+'</td>' +
                        '<td></td>' +
                        '<td></td>' +
                        '<td>'+ val.sub_task_name+'</td>' +
                        '<td>'+ v.group+'</td>' +
                        '<td>'+ val.responsible+'</td>' +
                        '<td>'+ val.run_up_time+'</td>' +
                        '<td>'+ val.completion_time+'</td>' +
                        '<td>'+ pri+'</td>' +
                        '<td>'+ sta[0]+'</td>' +
                        '<td>'+ val.update_time+'</td>' +
                        '<td class="genJin"><a class="btn '+sta[1]+' btn-xs" href="'+val.id+'">'+sta[2]+'</a></td>' +
                        '<td class="edit_view">' +
                            '<span><a class="fa fa-gear"  href="/teamtasks/editTask/?id='+val.id+'"></a></span>'+
                            '<span><a class="fa fa-search" href="/teamtasks/viewTask/?id='+val.id+'"></a></span>'+
                        '</td>' +
                    '</tr>');
                    me.trChild[v.task_id].unshift(tr1);
                });
            });
            $('#dataTables-device').append(tbody);
            this.table=$('#dataTables-device').DataTable({
                responsive: true,
                language:this.lang,
                ordering: true
            });
            $(".preloader").addClass("hidden");
        },
        addEvent:function(){
            if(this.isFirst){
                this.isFirst=false;
                var me=this;
                $("div.widget-box").on("click","tr[data-parent]",function(){
                    var tar=$(this).attr("data-parent");
                    var self=this;
                    if($("tr[data-child="+tar+"]").length){
                        $("tr[data-child="+tar+"]").remove();
                    }else{
                        $.each(me.trChild[tar],function(i,v){
                            $(self).after($(v));
                        });
                    }
                });
                $("div.widget-box").on("click","td.genJin a.btn-xs",function(e){
                    var e=e||event;
                    if(e.preventDefault){
                        e.preventDefault();
                    }else{
                        e.returnValue = false;
                    }
                    var id=$(this).attr("href");
                    window.open("/teamtasks/followupTask/?id="+id,"_self");
                })
            }
        }
    }
});