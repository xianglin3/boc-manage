$(document).ready(function () {
    function getip(net) {
        var ipstr_list = []
        for (var i = 0; i < net.length; i++) {
            ipstr_list[i] = net[i][0] + '/' + net[i][1]
        }
        return ipstr_list.join('\n')
    }
    //创建一个表格
    var col = [{
            data: 's_obj'
        }, {
            data: 'd_obj'
        }, {
            data: 'fw_name'
        }, {
            data: 'fw_ip'
        }, {
            data: 'acl_name'
        }],
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
        html = "<thead><tr><th>源地址</th><th>目标地址</th><th>防火墙名称</th><th>防火墙IP</th><th>ACL列表</th></tr></thead>" +
        "<tbody><tr><td height='20' /><td/><td/><td/><td/></tr></tbody>";
    html1 = "<div class=\"col-md-4 alert alert-warning alert-dismissible fade in\" role=\"alert\">" +
        "<button class=\"close\" type=\"button\" data-dismiss=\"alert\"><span aria-hidden=\"true\">×</span>" +
        "<span class=\"sr-only\">Close</span></button><strong></strong></div>";

    var table = $('#example2').DataTable({
        columns: col,
        language: lang,
        lengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "所有"]
        ],
        bStateSave: true
    });

    function doResponse(data) {
        console.log(data)
        table.destroy();
        $('#example2').html(html);
        table = $('#example2').DataTable({
            buttons: [{
                extend: 'csvHtml5',
                text: 'Copy all data',
                exportOptions: {
                    modifier: {
                        search: 'none'
                    }
                },
            }],
            scrollY: 400,
            columns: col,
            language: lang,
            data: data,
            lengthMenu: [
                [10, 25, 50, 100, -1],
                [10, 25, 50, 100, "所有"]
            ],
            bStateSave: true,

        });
    }
    $("#findfw").bind("click", function () {
        $('.alert').remove();
        var srt_str = $('#srt-str').val();
        var dst_str = $('#dst-str').val();
        console.log(srt_str, dst_str);
        var find_key = {
                sourse_str: srt_str,
                dst_str: dst_str
            }
            // var find_key = {
            //     sourse_str: '11.4.16.1',
            //     dst_str: '21.123.16.1'
            // }
        $.ajax({
            type: "POST",
            url: "http://22.1.111.29:5000/find",
            data: find_key,
            dataType: "json",
            success: function (response) {
                for (var i = 0; i < response.length; i++) {
                    response[i].s_obj = getip(response[i].s_obj);
                    response[i].d_obj = getip(response[i].d_obj);
                }
                doResponse(response)
            },
            error: function (e) {
                // $('#alertbox').html();
                $('#example2').html(html1);
                $('div>strong').text(e['responseJSON'].reason);
                if (e['responseJSON'].error){
                    $('div>strong').append('<br>' + e['responseJSON'].error.join('<br>'));
                }
                // console.log(e);
            }
        });
    })
});