$(document).ready(function(){
    var vm = new Vue({
        el:'#homePage',
        data:{
            dialogDeviceVisible:false,
            deviceWarnData: [{},{},{},{},{},{},{},{},{},{}],
            functionAreaData: [],
            pieData:[],
            barData:[],
            tableDialog:[],
            options:{
                text:'加载中...'
            },
            loading:null
        },
        methods:{
            init:function(){
                var _this = this;
                /*请求设备警告TOP10数据*/
                $.get('/index/v1/events/devices/summary',function(result){
                    //console.log('top10', result);
                    if(result.info == 'success'){
                        if(result.data.length > 10){
                            _this.deviceWarnData = result.data.slice(0,10);
                        }else{
                            _this.deviceWarnData = result.data;
                        }
                    }else{
                        //console.log(result.info);
                    }
                });
                /*请求功能区表格数据*/
                $.get('/index/v1/events/areas/summary',function(result){
                    //console.log('功能区：',result);
                    if(result.info == 'success'){
                        _this.functionAreaData = result.data;
                    }else{
                        //console.log(result.info);
                    }
                })
            },
            drawEchart:function(){
                var _this = this;
                /*请求功能区数据--饼图*/
                $.get('/index/v1/utilization/interfaces/area',function(result){
                    //console.log('pie',result);
                    if(result.info == 'success'){
                        _this.pieData = result.data;
                        var echartElements = $('.pie .echarts');
                        for(var i = 0;i<echartElements.length;i++){
                            var myChart = echarts.init(echartElements[i]);
                            var option = {
                                title: {
                                    text: _this.pieData[i].area,
                                    subtext: '',
                                    x:'center',
                                    bottom:'8px',
                                    textStyle:{
                                        fontSize:14,
                                        fontWeight:500
                                    }
                                },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                                    position:'inside'

                                },
                                legend: {
                                    show:true,
                                    /*orient: 'vertical',
                                    x: 'left',*/
                                    itemGap:8,
                                    itemWidth:10,
                                    itemHeight:10,
                                    data:['已用','未用'],
                                    textStyle:{
                                        color:'#999',
                                        fontSize:12,
                                    }
                                },
                                series: [
                                    {
                                        name:'利用情况',
                                        type:'pie',
                                        radius: ['0', '70%'],
                                        avoidLabelOverlap: false,
                                        label: {
                                            normal: {
                                                show: false,
                                                position: 'left'
                                            },
                                            emphasis: {
                                                show: false,
                                                textStyle: {
                                                    fontSize: '30',
                                                    fontWeight: 'bold'
                                                }
                                            }
                                        },
                                        labelLine: {
                                            normal: {
                                                show: false
                                            }
                                        },
                                        data:[
                                            {value:_this.pieData[i].useable, name:'已用'},
                                            {value:_this.pieData[i].unuseable, name:'未用'}
                                        ]
                                    }
                                ],
                                color:['#7fd1ff','#ffe17f']
                            };
                            myChart.setOption(option);
                        }
                    }else{
                        //console.log(result.info);
                    }
                })
                /*请求微模块数据--柱状图*/
                $.get('/index/v1/utilization/interfaces/module',function(result){
                    //console.log('bar',result);
                    if(result.info == 'success'){
                        var moduleData = [],unData = [],useData = [];

                        for(var j = 0;j<result.data.length;j++){
                            moduleData.push(result.data[j].detail_locate);
                            unData.push(result.data[j].unuseable);
                            useData.push(result.data[j].useable);
                        }
                        /*配置柱状图*/
                        var barElement = document.getElementById('bar');
                        var myBarChart = echarts.init(barElement);
                        var barOption = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            color:['#7fd1ff','#ffe17f'],
                            toolbox: {
                                show: false
                            },
                            legend: {
                                data: ['已用','未用']
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
                                    data: moduleData,
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
                                    name: '未用',
                                    type: 'bar',
                                    barWidth:20,
                                    stack:'',
                                    barCateoryGap:60,
                                    data: unData,
                                    itemStyle: {normal: {label: {show: true, position: 'top'}}}
                                },
                                {
                                    name: '已用',
                                    type: 'bar',
                                    barWidth:20,
                                    stack:'',
                                    barCateoryGap:10,
                                    data: useData,
                                    itemStyle: {normal: {label: {show: true, position: 'top'}}}
                                }
                            ]
                        };
                        myBarChart.setOption(barOption);
                    }else{
                        //console.log(result.info);
                    }
                })
                /*配置圆环图*/
                function drawPie(ele,data){
                    let e = data.value;
                    var pieEle = document.getElementById(ele);
                    var pieChart = echarts.init(pieEle);
                    var pieSet = {
                        title:{
                          text:data.name,
                          x:'center',
                          bottom:'30',
                          textStyle:{
                            color:'#333',
                            fontSize:'14',
                            fontWeight:300
                          }
                        },
                        tooltip: {
                            show:false,
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        series: [
                            {
                                name:'流量消耗',
                                type:'pie',
                                center:['50%','45%'],
                                radius: ['48%', '58%'],
                                legendHoverLink:false,
                                hoverAnimation:false,
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data:[
                                    {
                                        value:e,
                                        name:'',
                                        label: {
                                            normal: {
                                                show: true,
                                                position: 'center',
                                                formatter:e+'%',
                                                fontSize:20
                                            },
                                            emphasis: {
                                                show: true,
                                                textStyle: {
                                                    fontSize: '20',
                                                }
                                            }
                                        },
                                        itemStyle:{
                                            color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 1,
                                                y2: 1,
                                                colorStops: [
                                                 {offset: 0.2, color: '#7ef5b3' // 0% 处的颜色
                                                  },
                                                {
                                                    offset: 1, color: '#7fbcf3' // 100% 处的颜色
                                                }],
                                                globalCoord: true // 缺省为 false
                                            }
                                        }
                                    },
                                    {value:100-e,name:'',
                                        itemStyle:{
                                            color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 1,
                                                y2: 1,
                                                colorStops: [
                                                 {offset: 0.2, color: '#eee' // 0% 处的颜色
                                                  },
                                                {
                                                    offset: 1, color: '#ccc' // 100% 处的颜色
                                                }],
                                                globalCoord: true // 缺省为 false
                                            },
                                            opacity:0.3
                                        }
                                    }
                                ]
                            }
                        ]
                    };
                    pieChart.setOption(pieSet);
                }
                drawPie('gaugeOne',{name:'圆环表一',value:'35'});
                drawPie('gaugeTwo',{name:'圆环表二',value:'45'});
                drawPie('gaugeThree',{name:'圆环表三',value:'15'});
                drawPie('gaugeFour',{name:'圆环表四',value:'75'});
                /*配置仪表盘*/
                function drawGauge(ele,data){
                    var gaugeOneEle = document.getElementById(ele);
                    var gaugeChartOne = echarts.init(gaugeOneEle);
                    var gaugeOneOption = {
                        title: {
                            text: data.name,
                            subtext: '',
                            x:'center',
                            bottom:'-5px',
                            textStyle:{
                                fontSize:8,
                                fontWeight:500
                            }
                        },
                        tooltip : {
                            formatter: "{a} <br/>{b} : {c}%",
                            position:'inter'
                        },
                        series: [
                            {
                                name: data.name,
                                type: 'gauge',
                                radius:'100%',
                                detail: {formatter:'{value}%',fontSize:12,offsetCenter:[0,'60%']},
                                data: [{value: data.value}],
                                pointer:{
                                    width:3,
                                    length:'60%'
                                },
                                axisLine: {            // 坐标轴线
                                     lineStyle: {       // 属性lineStyle控制线条样式
                                         color: [[0.2, '#7ef5b3'], [0.8, '#7fbcf3'], [1, '#f67f9f']],
                                         width:8
                                     }
                                },
                                axisLabel:{
                                    fontSize:6
                                }
                            }
                        ]
                    };
                    gaugeChartOne.setOption(gaugeOneOption);
                }
//                drawGauge('gaugeOne',{name:'端口占用率',value:'83'});
//                drawGauge('gaugeTwo',{name:'cpu使用率',value:'45'});
//                drawGauge('gaugeThree',{name:'仪表盘三',value:'15'});
//                drawGauge('gaugeFour',{name:'仪表盘四',value:'75'});
                /*配置折线图*/
                function drawLine(ele,data){
                    var myChartLine = echarts.init(document.getElementById(ele));
                    var seriesSet = [];
                    for(var i = 0;i<data.lineData.length;i++){
                        var obj = {
                            name:data.lineData[i].name,
                            type:'line',
                            stack:'',
                            areaStyle:{normal:{}},
                            lineStyle:{
                                width:1
                            },
                            data:data.lineData[i].data,
                            itemStyle : {normal : {color:'#32A8FF'}},
                            smooth:true
                        };
                        seriesSet.push(obj);
                    }
                    var optionLine = {
                        legend: {
                            top: 20,
                            /*itemGap:5,
                            itemWidth:5,
                            textStyle: {
                                color: '#000',
                                fontSize: '10'
                            },*/
                            data: ['已使用','未使用']
                        },
                        title: {
                            text: data.title,
                            subtext: '',
                            x:'center',
                            bottom:'0',
                            textStyle:{
                                fontSize:14,
                                fontWeight:500
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        lineStyle:{
                            normal:{
                                color:'#32A8FF'
                            }
                        },
                        areaStyle:{
                           //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

                                offset: 0,
                                color: 'rgba(80,141,255,0.39)'
                            }, {
                                offset: .34,
                                color: 'rgba(56,155,255,0.25)'
                            },{
                                offset: 1,
                                color: 'rgba(38,197,254,0.00)'
                            }])
                        },
                        grid: {
                            top:'5%',
                            bottom: '15%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap:false,
                            data:data.xAxisData,
                            axisLabel:{
                                fontSize:10,
                            },
                            axisLine:{
                                show:false
                            },
                            axisTick:{
                                show:false,
                                lineStyle:{
                                    color:'#f5f5f5'
                                }
                            },
                        },
                        yAxis: {
                            type: 'value',
                            axisLine:{
                                show:false
                            },
                            axisTick:{
                                lineStyle:{
                                    color:'#f5f5f5'
                                }
                            },
                            splitNumber:3,
                            splitLine:{
                                lineStyle:{
                                    color:'#f5f5f5'
                                }
                            }
                        },
                        series:seriesSet
                    };
                    myChartLine.setOption(optionLine);
                }
                drawLine('polylineOne',
                    {title:'内存使用',
                    xAxisData:['功能区1','功能区2','功能区3','功能区4'] ,
                    lineData:[{name:'已使用',time:'2017-09-10',data:['10','30','10','15']},{name:'未使用',time:'2017-09-10',data:['2','17','8','10']},{name:'总数',data:['12','47','18','25']}]}
                );
                drawLine('polylineTwo',
                    {title:'带宽使用',
                    xAxisData:['微模块1','微模块2','微模块3','微模块4'] ,
                    lineData:[{name:'已使用',data:['5','20','10','15']},{name:'未使用',data:['4','17','8','13']}]}
                );
                drawLine('mobileEchart',
                    {title:'移动',
                    xAxisData:['微模块1','微模块2','微模块3','微模块4'] ,
                    lineData:[{name:'已使用',data:['5','20','10','15']},{name:'未使用',data:['4','17','8','13']}]}
                );
                drawLine('unicomEchart',
                    {title:'联通',
                    xAxisData:['微模块1','微模块2','微模块3','微模块4'] ,
                    lineData:[{name:'已使用',data:['5','20','10','15']},{name:'未使用',data:['4','17','8','13']}]}
                );
                drawLine('teleEchart',
                    {title:'电信',
                    xAxisData:['微模块1','微模块2','微模块3','微模块4'] ,
                    lineData:[{name:'已使用',data:['5','20','10','15']},{name:'未使用',data:['4','17','8','13']}]}
                );
            },
            handleClick:function(row) {
                //console.log(row);
                window.open('/index/detail/?devName=' + row.dev_name);
            },
            handleClickFun:function(row) {
                this.loading = this.$loading(this.options);
                var _this = this;
                /*请求该功能区对应的设备警告信息*/
                $.get('/index/v1/events/devices/summary/' + (row.area),function(result){
                    if(result.info == 'success'){
                        _this.dialogDeviceVisible = true;
                        _this.tableDialog = result.data;
                        _this.loading.close();
                    }else{
                        //console.log(result.info);
                        _this.loading.close();
                    }
                });
            },
            deviceCellClick:function(row,column,cell,event){
                var _this = this;
                if(column.property == 'area'){
                    _this.loading = this.$loading(this.options);
                    //console.log('这是功能区',$(cell).find('.cell').text());
                    /*请求该功能区对应的设备警告信息*/
                    $.get('/index/v1/events/devices/summary/' + (row.area),function(result){
                    // $.get('/index/v1/events/devices/summary',function(result){
                        //console.log(result);
                        if(result.info == 'success'){
                            _this.tableDialog = result.data;
                            _this.dialogDeviceVisible = true;
                            _this.loading.close();
                        }else{
                            //console.log(result.info);
                            _this.loading.close();
                        }
                    });
                }
            },
            functionCellClick:function(row,column,cell,event){
                var _this = this;
                if(column.property == 'area'){
                    _this.loading = this.$loading(this.options);
                    //console.log('这是功能区',$(cell).find('.cell').text());
                    /*请求该功能区对应的设备警告信息*/
                    $.get('/index/v1/events/devices/summary/' + (row.area),function(result){
                        //console.log(result);
                        if(result.info == 'success'){
                            _this.dialogDeviceVisible = true;
                            _this.tableDialog = result.data;
                            _this.loading.close();
                        }else{
                            //console.log(result.info);
                            _this.loading.close();
                        }
                    });
                }
            },
        },
        mounted:function(){
            this.init();
            this.drawEchart();
            this.loading.close();
        },
        beforeMount:function(){
            this.loading = this.$loading();
            this.drawEchart();
        }
    })
});