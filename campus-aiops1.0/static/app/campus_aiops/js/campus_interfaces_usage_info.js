/**
 * Created by wxt on 2017/12/01.
 */
$(document).ready(function () {
        var chartData;
        function interfacesChartMaker() {
            var dev_num = 0;
            var cateory = [];
            var cateoryValue1 = [];
            var cateoryValue2 = [];
            cateoryValue1.pop();
            cateoryValue2.pop();
            // 基于准备好的dom，初始化echarts实例
            var eChart = echarts.init(document.getElementById('interfaces_gram'));
            var eChart1 = echarts.init(document.getElementById('interfaces_gram1'));
            var eChart2 = echarts.init(document.getElementById('interfaces_gram2'));
            var eChart3 = echarts.init(document.getElementById('interfaces_gram3'));
            var eChart4 = echarts.init(document.getElementById('interfaces_gram4'));
            var eChart5 = echarts.init(document.getElementById('interfaces_gram5'));
            var eChart6 = echarts.init(document.getElementById('interfaces_gram6'));
            var eChart7 = echarts.init(document.getElementById('interfaces_gram7'));
            var eChart8 = echarts.init(document.getElementById('interfaces_gram8'));
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    // trigger: 'axis',
                    // axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    //     type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    // }
                },
                color:['#00c0ef','#00a65a'],
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
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
                    data: ['接入端口总数','在用端口总数']
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
                        name: '接入端口总数',
                        type: 'bar',
                        barWidth:20,
                        barCateoryGap:10,
                        data: cateoryValue1,
                        itemStyle: {normal: {label: {show: true, position: 'top'}}}
                    },
                    {
                        name: '在用端口总数',
                        type: 'bar',
                        barWidth:20,
                        barCateoryGap:60,
                        data: cateoryValue2,
                        itemStyle: {normal: {label: {show: true, position: 'top'}}}
                    },
                ]
            };
            var pie_option = {
                title: {
                    text: '',
                    subtext: '合规统计',
                    x: 'center'
                },
                tooltip: {
                    backgroudColor: 'red',
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                color:['#69A33C','#4FCACF',"#dd4b39"],
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
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
                    orient: 'vertical',
                    left: 'left',
                    data: ['iNode认证', 'MAC认证', '无认证']
                },
                series: [
                    {
                        name: '类别',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            // {value:0, name:'notConnected'},
                            // {value:0, name:'down'},
                            // {value:0, name:'up'},
                            // {value:0, name:'trunking'}
                        ],
                        itemStyle: {
                            normal: {
                                label: true,
                                show: true,
                            },
                        }
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            $.ajax({
                type: "get",
                url: "/portconfiger/get_campus_interfaces_usage_info/",
                dataType: "json",
                success: function (result) {
                    /*loading cancel*/
                    $('.preloader').addClass('hide');
                    chartData = eval(result);
                    // option.legend.data = [chartDataObj[0].CH];
                    $.each(chartData, function (i, obj) {
                        cateory.push(obj.area);
                        cateoryValue1.push(obj.interface_access_sum);
                        cateoryValue2.push(obj.interface_access_used);

                    });
                    option.xAxis[0].data = cateory;
                    option.series[0].data = cateoryValue1;
                    option.series[1].data = cateoryValue2;
                    eChart.hideLoading();
                    /*eChart 事件*/
                    function eConsole(param){
                        alert('数据在console里查看');
                        console.log(chartData);
                        console.log(param);
                    };
                    eChart.on('click',eConsole);

                    eChart.setOption(option, true);

                    for (let i=1;i<9;i++){
                        let eChart_i = echarts.init(document.getElementById('interfaces_gram'+i));
                        let eChart_i_data = chartData[i-1];
                        pie_option.title.text = eChart_i_data.area;
                        pie_option.series[0].data = [{value:eChart_i_data.interface_auth_inode, name:'iNode认证'},
                                                    {value:eChart_i_data.interface_auth_mac, name:'MAC认证'},
                                                    {value:eChart_i_data.interface_auth_no, name:'无认证'}];
                        /*eChart 事件*/
                        function pieConsole(param){
                            alert('数据在console里查看');
                            console.log(eChart_i_data);
                            console.log(param);
                        };
                        eChart_i.on('click',pieConsole);

                        eChart_i.setOption(pie_option, true);
                    }




                }

            });

        }
        ;

        interfacesChartMaker();
    }
);