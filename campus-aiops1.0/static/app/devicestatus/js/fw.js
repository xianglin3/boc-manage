/**
 * Created by wxt on 2017/09/10.
 */
var master_show_data = {output: '请选择设备 '};
var backup_show_data = {output: '请选择设备 '};
var masterTimer = null;
var showTimer = null;

var fwVue = new Vue({
    el: '#fwShowContent',
    data: {
        lastReqIP: '',
        master_fw_show_content: '',
        backup_fw_show_content: '',
    },
});

function request_show_content() {
    if ($('#master_ip').text()==''){
        return false;
    }
    $(".preloader").removeClass("hidden");
    $.post("/devicestatus/fw/", {
        "master_ip": $('#master_ip').text(),
        "backup_ip": $('#backup_ip').text()
    }, function (data) {
        $(".preloader").addClass("hidden");
        if ($('#master_ip').text() == fwVue.lastReqIP) {
            fwVue.master_fw_show_content = data.master + '\n' + fwVue.master_fw_show_content;
            fwVue.backup_fw_show_content = data.backup + '\n' + fwVue.backup_fw_show_content;
        } else {
            fwVue.master_fw_show_content = data.master;
            fwVue.backup_fw_show_content = data.backup;
            fwVue.lastReqIP = $('#master_ip').text();

        }

    }, "json");

}
//页面加载完成后通过GET获取设备准备和IP信息
$.get("/static/app/devicestatus/json/fwInfo.json", function (d) {
    var data = d.data;
    var $html = '<option value="0">请选择设备</option>';
    $.each(data, function (i, v) {
        $html += '<option value="' + i + '">' + v.masterDevice + '</option>';
    });
    $("#master_device").html($html).change(function () {
        var value = $(this).val();
        if (value !== "0") {
            var masterIP = data[value].masterIp;
            $("#master_ip").html(masterIP);
            $("#backup_device").html('<option>' + data[value].backupDevice + '</option>');
            var backupIP = data[value].backupIp;
            $("#backup_ip").html(backupIP);
            $(".preloader").removeClass("hidden");
    $.post("/devicestatus/fw/", {
        "master_ip": $('#master_ip').text(),
        "backup_ip": $('#backup_ip').text()
    }, function (data) {
        $(".preloader").addClass("hidden");
        if ($('#master_ip').text() == fwVue.lastReqIP) {
            fwVue.master_fw_show_content = data.master + '\n' + fwVue.master_fw_show_content;
            fwVue.backup_fw_show_content = data.backup + '\n' + fwVue.backup_fw_show_content;
        } else {
            fwVue.master_fw_show_content = data.master;
            fwVue.backup_fw_show_content = data.backup;
            fwVue.lastReqIP = $('#master_ip').text();

        }
        overrunRealTimeChart.isFirst = true;
        overrunRealTimeChart.run();
        startTimer();
    }, "json");
            //通过改变select的选择触发post请求设备状态
        } else {
            $("#master_ip").html("");
            $("#backup_device").html("");
            $("#backup_ip").html("");
        }
    });
}, "json");

var overrunRealTimeChart = {
    isFirst: true,
    reqErr: 0,
    reqNo:0,
    reqLimit:30,
    masterEleId: "overrunMasterRealTime",//页面元素
    backupEleId: "overrunBackupRealTime",//页面元素
    url: "/devicestatus/fw_overrun_analyzer/",//接口地址
    //存放overrun的绝对值队列
    m1arr: [],
    m2arr: [],
    m3arr: [],
    m4arr: [],
    b1arr: [],
    b2arr: [],
    b3arr: [],
    b4arr: [],
    timeArr: [],
    //存档overrun相对值的
    intervalArrDict: {m1: [], m2: [], m3: [], m4: [], b1: [], b2: [], b3: [], b4: []},
    masterChart: null,
    backupChart: null,
    chart_bar: null,
    masterOption: {
        title: {
            text: '主防火墙overrun',
            
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['data0/0', 'data0/1', 'data0/2', 'data0/3']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                data: (function () {
                    var now = new Date();
                    var res = [];
                    var len = 20;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 10000);
                    }
                    return res;
                })()

            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '增量',
                boundaryGap: false

            }
        ],
        series: [
            {
                name: 'data0/0',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                },
            },
            {
                name: 'data0/1',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                },
            },
            {
                name: 'data0/2',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'}
                    ]
                },
            },
            {
                name: 'data0/3',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                },
            },
        ]
    },
    backupOption: {
        title: {
            text: '备防火墙overrun',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['data0/0', 'data0/1', 'data0/2', 'data0/3']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                name: '时间',
                boundaryGap: false,
                data: (function () {
                    var now = new Date();
                    var res = [];
                    var len = 20;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '增量',
                boundaryGap: false
            }
        ],
        series: [
            {
                name: 'data0/0',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},

                    ]
                },

            },
            {
                name: 'data0/2',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                }
            },
            {
                name: 'data0/3',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                },
            },
            {
                name: 'data0/1',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                    ]
                },
            },
        ]
    },
    run : function () {
        var me = this;
        if (me.isFirst){
            me.init();
        } else {
            me.requestData();
        }
    },
    init: function () {
        var me = this;
        me.isFirst = false;
        me.reqErr = 0;
        me.reqNo = 0;
        me.m1arr = [];
        me.m2arr = [];
        me.m3arr = [];
        me.m4arr = [];
        me.b1arr = [];
        me.b2arr = [];
        me.b3arr = [];
        me.b4arr = [];
        me.timeArr = [];
        me.intervalArrDict = {m1: [], m2: [], m3: [], m4: [], b1: [], b2: [], b3: [], b4: []};
        me.requestData();
        me.masterChart = echarts.init(document.getElementById(this.masterEleId));
        me.backupChart = echarts.init(document.getElementById(this.backupEleId));
        me.masterOption.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.masterOption.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.masterOption.series[2].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.masterOption.series[3].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.backupOption.series[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.backupOption.series[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.backupOption.series[2].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.backupOption.series[3].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        me.requestData();
        me.freshImg();
    },
    requestData: function () {//请求函数
        var me = this;
        if ($('#master_ip').text() == '') {
            return false;
        }
        me.reqNo++;
        if(me.reqNo>me.reqLimit){
            stopTimer();
            alert('已经刷新了'+me.reqLimit+'次的overrun，为防止资源浪费暂停刷新数据，如果继续刷新请点击On按钮');
        }
        var master_ip = $('#master_ip').text();
        var backup_ip = $('#backup_ip').text();
        $.post(me.url, {"master_ip": master_ip, "backup_ip": backup_ip}, function (d) {
            var m1 = d.m1;
            var m2 = d.m2;
            var m3 = d.m3;
            var m4 = d.m4;
            var b1 = d.b1;
            var b2 = d.b2;
            var b3 = d.b3;
            var b4 = d.b4;
            me.m1arr.push(m1);
            me.m2arr.push(m2);
            me.m3arr.push(m3);
            me.m4arr.push(m4);
            me.b1arr.push(b1);
            me.b2arr.push(b2);
            me.b3arr.push(b3);
            me.b4arr.push(b4);
            me.timeArr.push((new Date()).toLocaleTimeString().replace(/^\D*/, ''));
            if (me.m1arr.length > 1) {
                for (var index = 0; index < me.m1arr.length - 1; index++) {
                    me.intervalArrDict.m1.push(me.m1arr[index + 1] - me.m1arr[index]);
                    me.intervalArrDict.m2.push(me.m2arr[index + 1] - me.m2arr[index]);
                    me.intervalArrDict.m3.push(me.m3arr[index + 1] - me.m3arr[index]);
                    me.intervalArrDict.m4.push(me.m4arr[index + 1] - me.m4arr[index]);
                    me.intervalArrDict.b1.push(me.b1arr[index + 1] - me.b1arr[index]);
                    me.intervalArrDict.b2.push(me.b2arr[index + 1] - me.b2arr[index]);
                    me.intervalArrDict.b3.push(me.b3arr[index + 1] - me.b3arr[index]);
                    me.intervalArrDict.b4.push(me.b4arr[index + 1] - me.b4arr[index]);
                }

                var axisData;
                axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
                me.masterOption.xAxis[0].data.shift();
                me.masterOption.xAxis[0].data.push(axisData);
                me.backupOption.xAxis[0].data.shift();
                me.backupOption.xAxis[0].data.push(axisData);

                var datam1 = me.masterOption.series[0].data;
                datam1.shift();
                datam1.push(me.intervalArrDict.m1[me.intervalArrDict.m1.length - 1]);

                var datam2 = me.masterOption.series[1].data;
                datam2.shift();
                datam2.push(me.intervalArrDict.m2[me.intervalArrDict.m2.length - 1]);

                var datam3 = me.masterOption.series[2].data;
                datam3.shift();
                datam3.push(me.intervalArrDict.m3[me.intervalArrDict.m3.length - 1]);

                var datam4 = me.masterOption.series[3].data;
                datam4.shift();
                datam4.push(me.intervalArrDict.m4[me.intervalArrDict.m4.length - 1]);


                var datab1 = me.backupOption.series[0].data;
                datab1.shift();
                datab1.push(me.intervalArrDict.b1[me.intervalArrDict.b1.length - 1]);

                var datab2 = me.backupOption.series[1].data;
                datab2.shift();
                datab2.push(me.intervalArrDict.b2[me.intervalArrDict.b2.length - 1]);

                var datab3 = me.backupOption.series[2].data;
                datab3.shift();
                datab3.push(me.intervalArrDict.b3[me.intervalArrDict.b3.length - 1]);

                var datab4 = me.backupOption.series[3].data;
                datab4.shift();
                datab4.push(me.intervalArrDict.b4[me.intervalArrDict.b4.length - 1]);


                me.freshImg();
            }
        }, "json").error(function () {
            me.reqErr++;
            if (me.reqErr > 1) {
                alert('解析失败，如果多次解析失败，设备可能存在问题，请手工登陆设备查看');
            }

        });
    },
    freshImg: function () {
        var me = this;
        me.masterChart.setOption(me.masterOption);
        me.backupChart.setOption(me.backupOption);
    }

};

function startTimer() {
    if (masterTimer) {
        stopTimer();
        masterTimer = setInterval(overrunRealTimeChart.run.bind(overrunRealTimeChart), 10300);
    } else {
        masterTimer = setInterval(overrunRealTimeChart.run.bind(overrunRealTimeChart), 10300);
    }
}

function stopTimer() {
    clearInterval(masterTimer);
    masterTimer = null;

};


$('#RealTimeOff').click(function () {
    stopTimer();
});

$('#RealTimeOn').click(function () {
    overrunRealTimeChart.reqNo = 0;
    startTimer();
});

$('#RealTimeShow').click(function () {
    request_show_content();
});


