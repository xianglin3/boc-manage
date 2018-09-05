/**
 * Created by nantian on 2017/4/24.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    $.get("/static/app/gaodengji/json/no_opt_thead.json",function(data){
        table.init(data);
        pie.init();
    },"json");

    var pie = {
        url:"/gaodengji/gdjstatistics/",
        ele:"#pie_statistics",
        data:null,
        tableData:null,
        option:null,
        time_range:7,//默认显示最近一周
        filed:["bus_type"],
        selected:{},
        index:null,//用来保存图例的分组好
        ista1:true,
        ista2:true,

        init:function(){
            var me = this;
            me.requestData();
            //this.chart_pie=echarts.init($(me.ele)[0]);
            $(".radio_group input").click(function(){
                me.time_range = $(this).val()-0;
                me.requestData();
            });
            $(".btn_group .btn-group>.btn").click(function(){
                var isAdd = $(this).hasClass("btn-default");
                var filed = $(this).attr("data-filed");
                if(isAdd){
                    if(me.filed.length > 1){
                        window.alert("最多选择两个字段！！");
                        return;
                    }else{
                        $(this).removeClass("btn-default").addClass("btn-info");
                        me.filed.push(filed);
                    }
                }else{
                    var i = me.filed.indexOf(filed);
                    i >= 0 && (me.filed.splice(i,1));
                    $(this).removeClass("btn-info").addClass("btn-default");
                }
                me.requestData();
            });

        },
        requestData:function(){
            var me = this;
            if(me.filed.length == 0){
                return;
            }
            $(".preloader").removeClass("hidden");
            $.post(me.url,{
                "time_range":me.time_range,
                "filed":me.filed
            },function(data){
                me.data = data['pieData'];
                me.refreshImg();
                $(data['tableData']).each(function(i,v){
                    v['opt'] = '<button type="button" class="btn btn-info btn-xs">查看详情</button>';
                });
                table.drawBody(data['tableData']);
                me.tableData = data['tableData'];
            },"json");
        },
        refreshImg:function(){
            var me = this;
            var radius = [[],[[0, '60%']],[[0, '30%'],['40%', '60%']],[[0, '25%'],['35%', '55%'],['65%', '80%']]];
            var len = me.data.length;
            var legendData = [],
                seriesData = [];
            me.index = {};
            $.each(me.data,function(i,v){
                var pos = i==len-1?"outer":"inner";
                var obj = {
                    name: v['CH'],
                    type:'pie',
                    selectedMode: 'single',
                    radius: radius[len][i],
                    //center: ['65%', '50%'],
                    label: {normal: {position:pos, formatter:'{b}:{d}%'}},
                    //labelLine: {normal: {show: false}},
                    data: v['data']
                };
                seriesData.push(obj);
                $.each(v['data'],function(item,val){
                    legendData.push(val['name']);
                    me.selected[val['name']] = true;
                    me.index[val['name']] = i;
                });
            });
            this.option = {
                title : {text: '事件总数统计',x:'center'},
                tooltip: {trigger: 'item',formatter: "{a} <br/>{b}: {c} ({d}%)"},
                toolbox:{
                    show:true,
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    },
                    itemSize:18,
                    top:50,
                    right:30
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:legendData,
                    selected:this.selected,
                    top:50,
                    left:15,
                    show:false
                },
                series: seriesData
            };
            this.setOption();
        },
        setOption:function(){
            //var me=this;
            if(this.chart_pie!==null){
                echarts.dispose($(this.ele)[0]);
            }
            this.chart_pie=echarts.init($(this.ele)[0]);
            this.chart_pie.setOption(this.option);
            this.printLegend();
            $(".preloader").addClass("hidden");
        },
        printLegend:function(){
            var me = this;
            $.each(me.data,function(i,v){
                $("#legend_data"+i+">.span_title").html(v['CH']);
            });

            var data = this.chart_pie.getOption().legend[0];
            var cls1 = "",cls2 = "";
            me.ista1&&(cls1 = "active");
            me.ista2&&(cls2 = "active");
            var btn1 = '<button type="button" data-pro="all1" class="btn btn-default btn-xs '+cls1+'">取消/全选</button>',
                btn2 = '<button type="button" data-pro="all2" class="btn btn-default btn-xs '+cls2+'">取消/全选</button>';
            $.each(data['data'],function(i,v){
                var cls = "";
                data['selected'][v]&&(cls = "active");
                if(me.index[v] == 1){
                    btn2 += '<button type="button" data-pro="'+v+'" class="btn btn-default btn-xs '+cls+'">'+v+'</button>';
                }else if(me.index[v] == 0){
                    btn1 += '<button type="button" data-pro="'+v+'" class="btn btn-default btn-xs '+cls+'">'+v+'</button>';
                }
            });
            $("#legend_data0>.legend_data").html(btn1);
            $("#legend_data1>.legend_data").html(btn2);
            $(".pie_legend .legend_data>.btn").click(function(e){
                var pro = $(this).attr("data-pro"),
                    bool = $(this).hasClass("active");
                if(pro == "all1"){
                    me.ista1 = !me.ista1;
                    $(this).siblings(".btn").each(function(i,v){
                        var p = $(v).attr("data-pro");
                        me.option['legend']['selected'][p] = me.ista1;
                    });
                }else if(pro == "all2"){
                    me.ista2 = !me.ista2;
                    $(this).siblings(".btn").each(function(i,v){
                        var p = $(v).attr("data-pro");
                        me.option['legend']['selected'][p] = me.ista2;
                    });
                }else{
                    /*if(me.index[pro] == 0){
                        var selected = me.option['legend']['selected'];
                        $.each(selected,function(i,v){
                            if(i.indexOf(pro)>-1){
                                selected[i] = !bool;
                            }
                        });
                    }else{
                        me.option['legend']['selected'][pro] = !bool;
                    }*/
                    me.option['legend']['selected'][pro] = !bool;
                }
                //过滤表格
                var index = $(this).parents(".legend").attr("id"),
                    data = [];
                if(index == "legend_data0"){
                    $.each(me.option['legend']['selected'],function(i,v){
                        if(me.index[i] == 0 && v){
                            data.push(i);
                        }
                    });
                    table.filterData(me.tableData,{filed:me.filed[0],data:data});
                }
                me.setOption();
            });
        }
    };

    var table = {
        ele:"#dataTables_device",
        table:null,
        thead:null,
        data:null,
        color:null,
        init:function(data){
            var me = this;
            me.thead = data["thead"];
            me.color = data["color"];
            me.drawHead();
            //me.drawBody();
        },
        drawHead:function(){
            var tHead = '<thead><tr>';
            $.each(this.thead,function(i,v){
                tHead += '<th>'+v["CH"]+'</th>';
            });
            $(this.ele).html(tHead);
        },
        //过滤数据
        filterData:function(odata,param){
            var data = [];
            $.each(odata,function(i,v){
                if( param["data"].indexOf(v[param['filed']]) != -1 ){
                    data.push(v);
                }
            });
            this.drawBody(data);
        },
        drawBody:function(data){
            data = data || [];
            var me = this;
            me.table && me.table.destroy();
            me.table = $(me.ele).DataTable({
                dom: 'B<"clear">lifrtp',
                responsive: false,
                columns:me.thead,
                stateSave: true,
                //禁用排序的列
                columnDefs: [
                    {"orderable": false,"targets": [11] }
                ],
                searching: false,
                data:data,
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
                buttons: [
                    {extend: 'excelHtml5',text: '导出到Excel',exportOptions: {//自定义导出的列
                        columns:( function ( idx, data, node ) {
                            return me.thead[idx]['export'];
                        })
                    },filename:"高等级事件统计结果"}
                ]
            });
            me.colShow();
            me.addColorEvent();
        },
        colShow:function(){
            var me = this;
            $.each(me.thead,function(i,v){
                me.table.column(i).visible(v["show"],false);
            });
        },
        addColorEvent:function(){
            var me = this;
            var rows = me.table.rows;
            $(rows()[0]).each(function(i,v){
                var state = rows(i).data()[0]['bus_type'];
                //  .to$()  将 node 转换为 jquery 节点
                rows(i).nodes().to$().css("background-color",me.color[state]);
                rows(i).nodes().to$().find(".btn").click(function(){
                    var data = rows(i).data()[0];
                    $("#myModal").modal()
                    var li = "";
                    $.each(me.thead,function(item,val){
                        if(val['data'] != 'opt'){
                            var v = data[val['data']]||"_";
                            li += '<li>' +
                            '<b>'+val['CH']+'</b>：' +
                            '<span>'+v+'</span>' +
                            '</li>';
                        }
                    });
                    $("#detail_information").html(li);
                });
            });
        }
    };
});