/**
 * Created by nantian on 2017/2/23.
 */
$(document).ready(function(){
    $(".preloader").removeClass("hidden");
    $.get("/static/app/deviceassets/json/tableHead.json",function(d){
        table.init(d);
    },"json");
    $("div.box-body ul.nav-tabs>li>a").click(function(e){
        var tar = $(this).attr("href");
        if(tar=="#pie_view"){
            pie.init();
        }else if(tar=="#bar_view"){
            bar.init();
        }
    });
    var table = {
        ele:"#device_assets",
        searchEle:"div.form-inline .form-control",
        thead:null,
        url:"/deviceassets/",//获取表格数据接口
        searchStr:"",
        inputSelectUrl:"/deviceassets/device_search_api/",//获取下拉框数据接口
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
            //重置按钮点击事件
            $("#reset_btn").click(function(){
                $(me.searchEle).val("");
                $("#device_assets_filter input").val("");
            });
            //搜索按钮的点击事件
            $("#search_btn").click(function(){
                me.searchData();
            });
            this.inputSelect();
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
        searchData:function(){
            var searchObj = {};
            $(this.searchEle).each(function(i,v){
                searchObj[$(v).attr("id")] = $(v).val();
            });
            this.searchStr = JSON.stringify(searchObj);
            $("a[href='#table_view']").trigger("click");
            $("#device_assets_filter input").val(this.searchStr).trigger("keyup");
        },
        inputSelect:function(){
            //请求下拉框中的数据
            var valuesList = [];
            $("div.input_select").each(function(i,v){
                valuesList.push($(v).attr("data-tar"));
            });
            $.post(this.inputSelectUrl, {"values_list[]":valuesList}, function(data){
                $.each(data,function(item,val){
                    var lis="";
                    $.each(val,function(i,v){
                        lis += '<li class="select_item">'+v+'</li>';
                    });
                    $("div[data-tar="+item+"]").find("ul.select_menu").html(lis);
                    $(".preloader").addClass("hidden");
                });
            },"json");
            //输入框获得焦点时
            $(this.searchEle).focus(function(){
                var tar = $(this).attr("id");
                var input = $(this).val();
                $("div.form-group div[data-tar]").removeClass("show");
                $("div.form-group div[data-tar="+tar+"]").addClass("show");
                $(this).siblings("div.input_select").find("ul.select_menu>li").each(function(i,v){
                    if($(v).html().indexOf(input)==-1){
                        $(v).addClass("hidden");
                    }else{
                        $(v).removeClass("hidden");
                    }
                });
            });
            //点击其他位置隐藏下拉框
            $(this.searchEle).blur(function(){
                var tar = $(this).attr("id");
                setTimeout(function(){
                    $("div.form-group div[data-tar="+tar+"]").removeClass("show");
                },150);
            });
            //选中事件
            $("ul.select_menu").on("click","li.select_item",function(){
                $(this).parents("div.input_select")
                    .removeClass("show")
                    .siblings("input.form-control")
                    .val($(this).html());
            });
            //输入时过滤下拉菜单
            var timer;
            $(this.searchEle).keyup(function(){
                var input = $(this).val();
                var me = this;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    $(me).siblings("div.input_select").find("ul.select_menu>li").each(function(i,v){
                        if($(v).html().indexOf(input)==-1){
                            $(v).addClass("hidden");
                        }else{
                            $(v).removeClass("hidden");
                        }
                    });
                },180);
            });
        },
        drawBody:function(){
            $(this.ele).dataTable({
                "processing": true,
                "ajax": {
                    "url":this.url,
                    "type": 'POST'
                },
                "columns": this.thead,
                "serverSide": true,
                "language": this.lang,
                "ordering":  false
            });
        }
    }
    //饼状图
    var pie = {
        isFirst:true,
        ele:"#pie_statistics",//页面元素
        fieldArr:[],//请求参数
        url:"/deviceassets/pie_data/",//接口地址
        chart_pie:null,
        option:null,
        selected:null,//用来保存第一次选中的结果
        index:null,//用来保存图例的分组好
        ista1:true,
        ista2:true,
        init:function(){//初始化
            var me = this;
            if(this.isFirst){
                this.isFirst=false;
                $(".preloader").removeClass("hidden");
                $.get("/static/app/deviceassets/json/statisticsField.json",function(d){
                    var buttons="";
                    $.each(d,function(i,v){
                        var cls = i==0?"btn-info":"btn-default";
                        cls=="btn-info"&&(me.fieldArr.push(v.field));
                        buttons+='<button type="button" class="btn '+cls+'" data-btn="'+ v.field +'">'+ v.CH +'</button>';
                    });
                    $("#pie_view>div.cls").html(buttons).on("click",".btn",function(){
                        if(me.fieldArr.length ==1){
                            me.selected = me.chart_pie.getOption().legend[0].selected;
                        }else{
                            me.selected = null;
                        }

                        if(me.fieldArr.length>1&&$(this).hasClass("btn-default")){
                            window.alert('最多选中2个字段！！！');
                        }else{
                            var field = $(this).attr("data-btn");
                            if($(this).hasClass("btn-info")){
                                me.fieldArr.splice(me.fieldArr.indexOf(field),1);
                            }else{
                                me.fieldArr.push(field);
                            }
                            $(this).toggleClass("btn-info").toggleClass("btn-default");
                            //请求函数
                            me.requestDat();
                        }
                    });
                    me.requestDat();
                    $(".preloader").addClass("hidden");
                },"json");
            }else{
                me.requestDat();
            }
        },
        requestDat:function(){//请求函数
            var me = this;
            var search = table.searchStr;
            if(this.fieldArr.length){
                $.post(this.url,{
                    "field":this.fieldArr,
                    "search":search
                },function(d){
                    me.freshImg(d);
                },"json");
            }
        },
        freshImg:function(d){
            var me=this;
            if(this.chart_pie!==null){
                echarts.dispose($(me.ele)[0]);
            }
            this.chart_pie=echarts.init($(me.ele)[0]);
            var radius = [[],[[0, '60%']],[[0, '30%'],['40%', '60%']],[[0, '25%'],['35%', '55%'],['65%', '80%']]];
            var len = d.length;
            var legendData = [],
                selectedData = {},
                seriesData = [];
            me.index = {};
            $.each(d,function(i,v){
                var pos = i==len-1?"outer":"inner";
                var obj = {
                    name: v['CH'],
                    type:'pie',
                    selectedMode: 'single',
                    radius: radius[len][i],
                    label: {normal: {position:pos, formatter:'{b}:{d}%'}},
                    //labelLine: {normal: {show: false}},
                    data: v['data']
                };
                seriesData.push(obj);
                $.each(v['data'],function(item,val){
                    me.index[val['name']] = i;
                    if(me.selected){
                        var bool = false;
                        $.each(me.selected,function(a,b){
                            if(val['name'].indexOf(a) > -1&&b){
                                bool = true;
                                return false
                            }
                        });
                        if(bool){
                            legendData.push(val['name']);
                            selectedData[val['name']] = true;
                        }else{
                            legendData.push(val['name']);
                            selectedData[val['name']] = false;
                        }
                    }else{
                        legendData.push(val['name']);
                        selectedData[val['name']] = true;
                    }
                });
            });
            this.option = {
                title : {text: '设备总数统计',x:'center'},
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
                    selected:selectedData,
                    top:50,
                    left:15,
                    show:false
                },
                series: seriesData
            }
            this.setOption(d);
        },
        setOption:function(d){
            this.chart_pie.setOption(this.option);
            this.printLengend(d);
        },
        printLengend:function(d){
            $.each(d,function(i,v){
                $("#pie_view span[data-title="+i+"]").html(v['CH']);
            });
            var me = this;
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
            $("#pie_view .select1").html(btn1);
            $("#pie_view .select2").html(btn2);
            $("#pie_view>.dialog_self button").click(function(e){
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
                    if(me.index[pro] == 0){
                        var selected = me.option['legend']['selected'];
                        $.each(selected,function(i,v){
                                if(i.indexOf(pro)>-1){
                                selected[i] = !bool;
                                }
                        })
                    }else{
                        me.option['legend']['selected'][pro] = !bool;
                    }
                }
                me.setOption();
            });
        }
    };

    //柱状图
    var bar = {
        isFirst:true,
        ele:"#bar_statistics",//页面元素
        fieldArr:[],//请求参数
        url:"/deviceassets/pie_data/",//接口地址
        chart_bar:null,
        option:null,
        isSelectAll:true,
        init:function(){//初始化
            var me = this;
            if(this.isFirst){
                this.isFirst=false;
                $(".preloader").removeClass("hidden");
                $.get("/static/app/deviceassets/json/statisticsField.json",function(d){
                    var buttons="";
                    $.each(d,function(i,v){
                        var cls = i==0?"btn-info":"btn-default";
                        cls=="btn-info"&&(me.fieldArr.push(v.field));
                        buttons+='<button type="button" class="btn '+cls+'" data-btn="'+ v.field +'">'+ v.CH +'</button>';
                    });
                    $("#bar_view>div.cls").html(buttons).on("click",".btn",function(){
                        if(me.fieldArr.length>1&&$(this).hasClass("btn-default")){
                            window.alert('最多选中2个字段！！！');
                        }else{
                            var field = $(this).attr("data-btn");
                            if($(this).hasClass("btn-info")){
                                me.fieldArr.splice(me.fieldArr.indexOf(field),1);
                            }else{
                                me.fieldArr.push(field);
                            }
                            $(this).toggleClass("btn-info").toggleClass("btn-default");
                            //请求函数
                            me.requestDat();
                        }
                    });
                    me.requestDat();
                    $(".preloader").addClass("hidden");
                },"json");
                $("#bar_view .selectALL>.btn").click(function(){
                    me.selectAll();
                });
            }else{
                me.requestDat();
            }
        },
        requestDat:function(){//请求函数
            var me = this;
            var search = table.searchStr;
            if(this.fieldArr.length){
                $.post(this.url,{
                    "field":this.fieldArr,
                    "search":search
                },function(d){
                    me.freshImg(d);
                },"json");
            }
        },
        freshImg:function(d){
            var me=this;
            if(this.chart_bar!==null){
                echarts.dispose($(me.ele)[0]);
            }
            this.chart_bar=echarts.init($(me.ele)[0]);
            var xAxisData = [],
                seriesData = [],
                legendData = [];
            if(d.length==1){
                legendData.push(d[0]["CH"]);
                var data = [];
                $.each(d[0]['data'],function(i,v){
                    xAxisData.push(v['name']);
                    data.push(v['value']);
                });
                seriesData.push({
                    name: d[0]["CH"],
                    type: 'bar',
                    stack: '总量',
                    label: {normal: {show: true,position: 'insideLeft'}},
                    data: data
                });
            }else if(d.length==2){
                $.each(d[0]['data'],function(i,v){
                    xAxisData.push(v['name']);
                });
                var o = {},index={};
                $.each(d[1]['data'],function(i,v){
                    var pro = v['name'].replace(/^.+-/,"");
                    index[v.name]= v.value;
                    if(!o[pro]){
                        o[pro] = true;
                        legendData.push(pro);
                    }
                });
                $.each(legendData,function(i,v){
                    var data = [];
                    $.each(xAxisData,function(item,val){
                        var value = index[val+"-"+v];
                        data.push(value||"");
                    });
                    seriesData.push({
                        name: v,
                        type: 'bar',
                        stack: '总量',
                        label: {normal: {show: true,position: 'insideLeft'}},
                        data: data
                    })
                });
            }
            this.option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {type : 'shadow'},
                    formatter: function (params) {
                        var fmtStr = "</br>",n=0;
                        $.each(params,function(i,v){
                            if(v.data){
                                n+= v.data;
                                fmtStr+='<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+ v.color+'"></span>'+v.seriesName+': '+v.data+'</br>';
                            }
                        });
                        return params[0]['name']+"("+n+")"+fmtStr;
                    }
                },
                toolbox:{
                    show:true,
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    },
                    itemSize:18,
                    top:5,
                    right:30
                },
                legend: {data: legendData},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '8%',
                    containLabel: true
                },
                yAxis:  {type: 'value'},
                xAxis: {type: 'category',data: xAxisData},
                series: seriesData
            }
            this.setOption();
        },
        setOption:function(){
            this.chart_bar.setOption(this.option);
        },
        selectAll:function(){
            var me = this;
            me.isSelectAll = !me.isSelectAll;
            var selected = {};
            var selectArr = this.chart_bar.getOption().legend[0].data;
            $(selectArr).each(function(i,v){
                selected[v] = me.isSelectAll;
            });
            me.option.legend.selected = selected;
            me.setOption();
        }
    }
});