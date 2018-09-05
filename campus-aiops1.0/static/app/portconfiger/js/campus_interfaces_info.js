/**
 * Created by nantian on 2016/12/7.
 */

$('#pushBut').click(function () {
    var configText = $('#configText').val();
    var old_config = $('#showRun').html();
    if (configText == undefined) {
        alert('请选择配置模式');
        return false;

    }
    var ip = device_ip;
    var configText = $('#configText').val();
    if (window.confirm("您确定下要发配置吗？") == false) {
        return false;
    }
    ;
    $('#show_loader').removeClass('hidden');
    $.ajax({
        type: 'POST',
        url: '/portconfiger/port_config/',
        data: {"ip": ip, "config_text": configText, "old_config": old_config},
        success: function (data) {
            var port_config_result = data.port_config_result;
            $('#show_loader').addClass('hidden');
            if (port_config_result == "success") {
                alert("配置下发成功！");
            } else {
                alert("推送失败，原因如下：" + port_config_result);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('err');
            console.log("error");
        },
        dataType: 'json'
    });
});
var device_ip;
var interface;
var device_name;
//添加异步请求时等待界面
var $preloader = $('<div class="preloader hidden"> <i class="fa fa-spinner fa-spin fa-5x"></i></div>');
$("section.content").append($preloader);
$("div.preloader").removeClass("hidden");
var parameters = {};
//页面加载完成第一次get请求全部数据
//$.get("/portconfiger/campus_interfaces_info/", function (d) {
//    tableObj.init();
//    tableObj.drawTable(d);
//}, "json");

//获取园区和IP对应关系
$.get("/portconfiger/campus_areas_info/", function (d) {
    // var parameters = {};
    var li = "";
    var campus_name_list = [];
    $.each(d, function (i, v) {
        campus_name_list.push(i);
    });
    campus_name_list.sort();
    $.each(campus_name_list, function (i, v) {
        li += '<li class="option"><a href="' + v + '">' + v + '</a></li>';
    });
    $("ul[data-title=ip_list]").append(li);
    //选择按钮的选择事件
    $("div.filterBox li>a").click(function (e) {
        var e = e || event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        $(this).parent("li").toggleClass("active");
        var pro = $(this).attr("href");
        var field = $(this).parents("ul.list-inline").attr("data-title");
        var hasClass = $(this).parent("li").hasClass("active");
        if (pro == "all") {
            if (hasClass) {
                $(this).parent("li").siblings("li.option").addClass("active");
            } else {
                $(this).parent("li").siblings("li.option").removeClass("active");
            }
            delete parameters[field];
        } else {
            parameters[field] = [];
            $(this).parents("ul.list-inline")
                .find("li.option.active>a").each(function (i, v) {
                var href = $(v).attr("href");
                if (field == "ip_list") {
                    parameters[field] = Array.prototype.concat.apply(parameters[field], d[href]);
                } else {
                    parameters[field].push(href);
                }
            });
            parameters[field].length == 0 && delete parameters[field];
            if (hasClass) {
                var liTotal = $(this).parent("li").siblings("li.option").length + 1;
                var liActive = $(this).parents("ul.list-inline").find("li.active").length;
                if (liActive >= liTotal) {
                    $(this).parent("li").siblings("li.all").addClass("active");
                    delete parameters[field];
                }
            } else {
                $(this).parent("li").siblings("li.all").removeClass("active");
            }
        }
    });
    //开始筛选
    $("#search").click(function () {
        $("div.preloader").removeClass("hidden");
        //重新加载datatable的数据  调用的是drawbody datatable返回的对象
        table.draw_table_returned_obj.ajax.reload(null, false);
    });
    //下载按钮
    $("#download").click(function () {
        $.post("/portconfiger/download_all_ports/", parameters, function (d) {
            function export_raw(name, data) {
                var urlObject = window.URL || window.webkitURL || window;

                var export_blob = new Blob([data]);

                var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
                save_link.href = urlObject.createObjectURL(export_blob);
                save_link.download = name;
                fake_click(save_link);
            }

            function fake_click(obj) {
                var ev = document.createEvent("MouseEvents");
                ev.initMouseEvent(
                    "click", true, false, window, 0, 0, 0, 0, 0
                    , false, false, false, false, 0, null
                );
                obj.dispatchEvent(ev);
            }

            export_raw("过滤后的端口列表.csv", d)
        })
    });
}, "json");
$.get("/static/app/portconfiger/json_info/campusInterfacesInfo.json", function (d) {
    table.init(d);
}, "json");
var table = {
    draw_table_returned_obj: null,
    ele: "#campusInterfacesInfo",
    thead: null,
    url: "/portconfiger/campus_interfaces_info/",//获取表格数据接口
    lang: {
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
    init: function (thead) {
        var me = this;
        this.thead = thead;
        this.drawHead();
        //this.addEvent(); //通过js添加事件 实现跳转 与按钮不可同时使用
    },
    drawHead: function () {
        var thead = '<thead><tr>';
        $.each(this.thead, function (i, v) {
            thead += '<td>' + v["CH"] + '</td>';
        });
        thead += '</tr></thead>';
        $(this.ele).html(thead);
        this.drawBody();
    },
    drawBody: function () {
        //此处的Datatable返回api对象，Datatable()= datatable().api()
        this.draw_table_returned_obj = $(this.ele).DataTable({
            "processing": true,
            "ajax": {
                "url": this.url,
                "type": 'POST',
                "data": function (reqData) {
                    $(".preloader").removeClass("hidden");
                    // reqData{"staus":["up"],"log_status":["up"],"mode":["access"]}
                    $.each(parameters, function (i, v) {
                        reqData[i] = v
                    })
                    // reqData['search_json'] = JSON.stringify(parameters);
                },
                "dataSrc": function (jsonData) {
                    $.each(jsonData['data'], function (i, v) {
                        v['opt'] = '<button type="button" class="btn btn-primary" ' +
                            'data-toggle="modal" data-target="#interfaceConfigModal" ' +
                            'data-whatever="' + v["ip"] + ' ' + v["dev_name"] + ' ' + v["name"] + '"' +
                            '>配置</button>';
                    });
                    $("div.preloader").addClass("hidden");
                    return jsonData['data'];
                }
            },
            "columns": this.thead,
            "serverSide": true,
            "language": this.lang,
            "ordering": false
        });
        // $(".preloader").addClass("hidden");
    },
};
$('#interfaceConfigModal').on('show.bs.modal', function (event) {
    var typeoption_list = $('input[name="typeoption"]');
    $.each(typeoption_list,function (i,ele) {
        ele.checked=false;
    });
    $('#config').html('</textarea>');
    $('#show_loader').removeClass('hidden');
    $('#showRun').html('<pre>端口配置请求中...</pre>');
    var button = $(event.relatedTarget); // Button that triggered the modal
    var iinterface_info_arr = button.data('whatever').split(' '); // Extract info from data-* attributes
    device_ip = iinterface_info_arr[0];
    device_name = iinterface_info_arr[1];
    interface = iinterface_info_arr[2];
    $.ajax({
        type: 'POST',
        url: '/cli_realtime/ssh_get_info/',
        data: {
            "ip_list": device_ip,
            "commands": 'show run interface ' + interface,
            "platform": '',
            "ssh_user": '',
            "ssh_password": ''
        },
        timeout: 2000000,
        success: function (data) {
            var infocollection = data['infocollection'];
            var showContentStr = '';
            var output_array = infocollection[device_ip].output;
            $.each(output_array, function (n, value) {
                showContentStr = showContentStr + value.output;
            });
            $('#showRun').html('<pre>' + showContentStr + '</pre>');
            $('#show_loader').addClass('hidden');
        },

        error: function (jqXHR, textStatus, errorThrown) {
            $('#show_loader').addClass('hidden');
            alert('收集过程中发生错误，可能是因为访问控制未开通，或者是设备型号暂时不支持等原因');
            console.log("error");
        },
        dataType: 'json'
    });


    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-title').text(device_ip + ' ' + device_name + ' ' + interface);

});

function generateConfig(obj) {
    var portFullName = interface;
    var type = $(obj).attr("id");
    var type1config = "config t\ninterface " + portFullName + "\ndescription [请注意修改端口描述等配置]\nno switchport access vlan 需添加\nswitchport voice vlan 2468\nswitchport port-security maximum 3\nswitchport port-security\nauthentication event fail action authorize vlan 2424\nauthentication event no-response action authorize vlan 2424\nauthentication port-control auto\ndot1x pae authenticator\ndot1x timeout quiet-period 3\ndot1x timeout tx-period 5\nstorm-control broadcast include multicast\nstorm-control broadcast level 5.00\nspanning-tree portfast\n no shut\n end\n wr\n!\n";
    var type2config = "config t\ninterface " + portFullName + "\ndescription [请注意修改端口描述等配置]\nswitchport access vlan 2472\nswitchport port-security maximum 3\nswitchport port-security\nauthentication port-control auto\nmab\nauthentication host-mode multi-host\ndot1x pae authenticator\ndot1x timeout quiet-period 3\ndot1x timeout tx-period 5\nstorm-control broadcast include multicast\nstorm-control broadcast level 5.00\nspanning-tree portfast\n no shut\n end\n wr\n!"
    var type3config = "config t\ndefault interface" + portFullName + "\ninterface " + portFullName + "\n description [端口描述需添加] \n switchport access vlan 需修改  \n switchport port-security maximum 3 \n spanning-tree portfast \n no shut\nend\nwr\n！\n"

    switch (type) {
        case 'typeoption1':
            $('#config').html('<textarea rows="20" cols="70" id="configText">' + type1config + '</textarea>');
            break;
        case 'typeoption2':
            $('#config').html('<textarea rows="23" cols="70" id="configText">' + type2config + '</textarea>');
            break;
        case 'typeoption3':
            $('#config').html('<textarea rows="12" cols="70" id="configText">' + type3config + '</textarea>');
            break;
    }
    ;
}