/**
 * Created by nantian on 2016/11/1.
 */
$(document).ready(function () {
    $(".preloader").removeClass("hidden");
    $(".form_datetime").datetimepicker({
        format: "yyyy-MM-ddThh:ii",
        language: 'zh-CN',
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minuteStep: 1
    });
    //创建一个表格
    var col = [
            {data: 'ip'},
            {data: 'device_name'},
            {data: 'message'},
            {data: 'occur_time'},
            {data: 'host'}
        ],
        lang = {
            "sProcessing": "处理中...",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "查找:",
            "sUrl": "",
            "sEmptyTable": "未搜索到任何数据...",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            }
        },
        html = "<thead><tr><th>设备ip</th><th>设备名称</th><th>sysLog</th><th>时间</th><th>日志服务器</th></tr></thead>";
    var table = null;
    doResponse();
    //利用正则表达式校验ip地址
    function vliIpv4(ip) {
        //var reg=/^(2[5][0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})\.(25[0-5]|2[0-4]\d|1\d{2}|\d{1,2})$/;
        //ip=ip.toLowerCase();
        //if(ip=="any"||reg.test(ip)){
        //    return true;
        //}else{
        //    return false;
        //}
        return true;
    }

    $("#IpInputName").blur(function (e) {
        var ip = $(this).val();
        if (vliIpv4(ip)) {
            $("#ipTip").css("color", "#0f0").addClass("glyphicon-ok").removeClass("glyphicon-remove");
        } else {
            window.alert('您输入的IP格式不正确！');
            $("#ipTip").css("color", "#f00").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        }
    });
    //按钮提交表单
    $(".searchForm form button.btn").click(function () {
        var form = $(this).parents("form");
        submitForm(form[0]);
    });
    //回车键提交表单
    $(".searchForm form").keydown(function (e) {
        if (e.keyCode == 13) {
            submitForm(this);
        }
    });
    function submitForm(self) {
        $(".preloader").removeClass("hidden");
        var ip = $(self).find("#IpInputName").val();
        if (vliIpv4(ip)) {
            table.ajax.reload();
        } else {
            window.alert('您输入的IP格式不正确！');
            $("#ipTip").css("color", "#f00").addClass("glyphicon-remove").removeClass("glyphicon-ok");
        }
    }

    function doResponse(data) {
        table&&table.destroy();
        $('.systemLog .table').html(html);
        table = $('div.systemLog .table').DataTable({
            buttons:[{
                extend:'csvHtml5',
                text:'Copy all data',
                exportOptions:{
                    modifier:{
                        search:'none'
                    }
                },
            }],
            scrollY: 400,
            columns: col,
            language: lang,
            serverSide: true,
            ajax: {
                url:"/syslog/search_log/",
                type: 'POST',
                data:function(reqData){
                    $(".searchForm form").find("input").each(function(i,v){
                        reqData[$(v).attr("name")] = $(v).val();
                    });
                },
                dataSrc:function(d){
                    $(".preloader").addClass("hidden");
                    return d['data'];

                }
            },
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            bStateSave: true,

        });
    }
});
