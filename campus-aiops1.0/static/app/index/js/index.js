/**
 * Created by wxt on 2017/08/10.
 */
$(document).ready(function () {
        $.get("/static/config/title.json", function (data) {
            var div_item = "", li = "";
            $(data).each(function (i, v) {
                var cls = "";
                i == 0 && (cls = "active");
                li += '<li data-target="#top_carousel" data-slide-to="' + i + '" class="' + cls + '"></li>';
                div_item += '<div class="item ' + cls + '">' +
                    '<a class="carouse_link" title="' + v['show'] + '" href="' + v['url'] + '">' + v['show'] + '</a>' +
                    '</div>';
            });
            $("#top_carousel>.carousel-indicators").html(li);
            $("#top_carousel>.carousel-inner").html(div_item);
        }, "json");
        function networkChartMaker() {
            var dev_num = 0;
            var cateory = [];
            var cateoryValue = [];
            cateoryValue.pop()
            // 基于准备好的dom，初始化echarts实例
            var hshChart = echarts.init(document.getElementById('network_dev_gram'));
            // 指定图表的配置项和数据
            option = {
                tooltip: {
                    // trigger: 'axis',
                    // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        // magicType :{
                        //     show:true,
                        //     type :['line','bar','stack','tiled'],
                        //
                        // },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: cateory,
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                            margin: 2,
                            textStyle: {
                                color: "#222"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: cateoryValue,
                        itemStyle: {normal: {label: {show: true, position: 'top'}}}
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            $.ajax({
                type: "post",
                data: {"field[]": "bus_type", "search": '{"fuzzy_search":""}'},
                url: "/deviceassets/pie_data/",
                dataType: "json",
                success: function (result) {
                    var chartDataObj = eval(result);
                    // option.legend.data = [chartDataObj[0].CH];
                    $.each(chartDataObj[0].data, function (i, obj) {
                        cateory.push(obj.name);
                        cateoryValue.push(obj.value);
                        dev_num = dev_num + obj.value;

                    });
                    option.xAxis[0].data = cateory;
                    option.series[0].data = cateoryValue;
                    option.legend.data[0] = '设备总数:' + dev_num;
                    option.series[0].name = '设备总数:' + dev_num;
                    hshChart.hideLoading();
                    hshChart.setOption(option, true);
                }

            });

        }
        ;
        function hshChartMaker() {
            var dev_num = 0;
            var cateory = [];
            var cateoryValue = [];
            cateoryValue.pop()
            // 基于准备好的dom，初始化echarts实例
            var hshChart = echarts.init(document.getElementById('hsh_dev_gram'));
            // 指定图表的配置项和数据
            option = {
                tooltip: {
                    // trigger: 'axis',
                    // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        // magicType :{
                        //     show:true,
                        //     type :['line','bar'],
                        //
                        // },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: cateory,
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                            margin: 2,
                            textStyle: {
                                color: "#222"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: cateoryValue
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            $.ajax({
                type: "post",
                data: {"field[]": "bus_type", "search": '{"reg_pos":"黑山扈", "fuzzy_search":""}'},
                url: "/deviceassets/pie_data/",
                dataType: "json",
                success: function (result) {
                    var chartDataObj = eval(result);
                    // option.legend.data = [chartDataObj[0].CH];
                    $.each(chartDataObj[0].data, function (i, obj) {
                        cateory.push(obj.name);
                        cateoryValue.push(obj.value);
                        dev_num = dev_num + obj.value;

                    });
                    option.xAxis[0].data = cateory;
                    option.series[0].data = cateoryValue;
                    option.legend.data[0] = '设备总数:' + dev_num;
                    option.series[0].name = '设备总数:' + dev_num;
                    hshChart.hideLoading();
                    hshChart.setOption(option, true);
                }

            });

        }
        ;
        function hyChartMaker() {
            var dev_num = 0;
            var cateory = [];
            var cateoryValue = [];
            cateoryValue.pop()
            // 基于准备好的dom，初始化echarts实例
            var hyChart = echarts.init(document.getElementById('hy_dev_gram'));

            // 指定图表的配置项和数据
            option = {
                tooltip: {
                    // trigger: 'axis',
                    // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: cateory,
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                            margin: 2,
                            textStyle: {
                                color: "#222"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: cateoryValue,
                        itemStyle: {normal: {label: {show: true, position: 'top'}}}
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            $.ajax({
                type: "post",
                data: {"field[]": "bus_type", "search": '{"reg_pos":"海鹰", "fuzzy_search":""}'},
                url: "/deviceassets/pie_data/",
                dataType: "json",
                success: function (result) {
                    var chartDataObj = eval(result);
                    // option.legend.data = [chartDataObj[0].CH];
                    $.each(chartDataObj[0].data, function (i, obj) {
                        cateory.push(obj.name);
                        cateoryValue.push(obj.value);

                        dev_num = dev_num + obj.value;

                    });
                    option.xAxis[0].data = cateory;
                    option.series[0].data = cateoryValue;
                    option.legend.data[0] = '设备总数:' + dev_num;
                    option.series[0].name = '设备总数:' + dev_num;
                    hyChart.hideLoading();
                    hyChart.setOption(option, true);
                }

            });

        }
        ;
        function xdChartMaker() {
            var dev_num = 0;
            var cateory = [];
            var cateoryValue = [];
            cateoryValue.pop()
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('xd_dev_gram'));

            // 指定图表的配置项和数据
            option = {
                tooltip: {
                    // trigger: 'axis',
                    // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: cateory,
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                            margin: 2,
                            textStyle: {
                                color: "#222"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: cateoryValue,
                        itemStyle: {normal: {label: {show: true}}}
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            $.ajax({
                type: "post",
                data: {"field[]": "bus_type", "search": '{"reg_pos":"西单", "fuzzy_search":""}'},
                url: "/deviceassets/pie_data/",
                dataType: "json",
                success: function (result) {
                    var chartDataObj = eval(result);
                    // option.legend.data = [chartDataObj[0].CH];
                    $.each(chartDataObj[0].data, function (i, obj) {
                        cateory.push(obj.name);
                        cateoryValue.push(obj.value);
                        dev_num = dev_num + obj.value;

                    });
                    option.xAxis[0].data = cateory;
                    option.series[0].data = cateoryValue;
                    option.legend.data[0] = '设备总数:' + dev_num;
                    option.series[0].name = '设备总数:' + dev_num;
                    myChart.hideLoading();
                    myChart.setOption(option, true);
                }

            });

        }
        ;
        function zjChartMaker() {
            var dev_num = 0;
            var cateory = [];
            var cateoryValue = [];
            cateoryValue.pop()
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('zj_dev_gram'));

            // 指定图表的配置项和数据
            option = {
                tooltip: {
                    // trigger: 'axis',
                    // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: true
                        },
                        // magicType :{
                        //     show:true,
                        //     type :['line','bar','pie'],
                        //
                        // },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        },


                    }
                },
                legend: {
                    data: ['数量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: cateory,
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                            margin: 2,
                            textStyle: {
                                color: "#222"
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        data: cateoryValue,
                        itemStyle: {normal: {label: {show: true, position: 'top'}}}
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            $.ajax({
                type: "post",
                data: {"field[]": "bus_type", "search": '{"reg_pos":"张江", "fuzzy_search":""}'},
                url: "/deviceassets/pie_data/",
                dataType: "json",
                success: function (result) {
                    var chartDataObj = eval(result);
                    // option.legend.data = [chartDataObj[0].CH];
                    $.each(chartDataObj[0].data, function (i, obj) {
                        cateory.push(obj.name);
                        cateoryValue.push(obj.value);
                        dev_num = dev_num + obj.value;

                    });
                    option.xAxis[0].data = cateory;
                    option.series[0].data = cateoryValue;
                    option.legend.data[0] = '设备总数:' + dev_num;
                    option.series[0].name = '设备总数:' + dev_num;
                    myChart.hideLoading();
                    myChart.setOption(option, true);
                }

            });

        }
        ;
        hshChartMaker();
        hyChartMaker();
        xdChartMaker();
        zjChartMaker();
        networkChartMaker();
    $.get("/static/app/gaodengji/json/no_opt_thead.json",function(data){
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

    }
);